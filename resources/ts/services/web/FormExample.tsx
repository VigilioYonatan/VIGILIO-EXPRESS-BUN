import { useSignal } from "@preact/signals";
import { sweetAlert } from "@vigilio/sweet";
import { useForm } from "react-hook-form";
import {
    Input,
    array,
    boolean,
    instance,
    minLength,
    minValue,
    number,
    object,
    omit,
    string,
    toTrimmed,
} from "valibot";
import Form from "~/components/form";
import validFileValibot, { valibotVigilio } from "~/libs/valibot";

const user = object({
    id: string(),
    name: string("Este campo es obligatorio.", [
        toTrimmed(), // toTrimmed() elimina los espacios en blanco de los costados
        minLength(3, "Mínimo 3 carácteres."),
    ]),
    age: number("Este campo es obligatorio.", [
        minValue(18, "Minimo 18 de edad."),
    ]),
    image: array(instance(File), "Este campo es obligatorio.", [
        validFileValibot({
            required: false,
            min: 1, // min files
            max: 1, // max files
            // types:["image/jpg"]
        }),
    ]),
    enabled: boolean("Este campo es obligatorio"),
});
export type User = Input<typeof user>;

// store
const usersStoreDto = omit(user, ["id"]); // omit quitar id de usuario
export type UsersStoreDto = Input<typeof usersStoreDto>;

// update - in this case no use it
const usersUpdateDto = omit(user, ["id"]);
export type UsersUpdateDto = Input<typeof usersUpdateDto>;

function FormExample() {
    const users = useSignal<User[]>([]);
    // update
    const usersUpdateId = useSignal<string | null>(null);

    const usersStoreForm = useForm<UsersStoreDto>({
        resolver: valibotVigilio(usersStoreDto),
    });

    function onUserStore(body: UsersStoreDto) {
        const id = Date.now().toString(32); //generate id
        // add
        if (!usersUpdateId.value) {
            users.value = [...users.value, { ...body, id }];
            usersStoreForm.reset(); // clean form
            sweetAlert({
                icon: "success",
                title: `Se agregó nuevo usuario <b>${body.name}</b>`,
            });
            return;
        }
        // update
        users.value = users.value.map((user) =>
            user.id === usersUpdateId.value ? { ...body, id: user.id } : user
        );
        usersStoreForm.reset(); // clean form
        sweetAlert({
            icon: "success",
            title: `Se agregó nuevo usuario <b>${body.name}</b>`,
        });
    }
    function onUserDelete(id: string) {
        users.value = users.value.filter((user) => user.id !== id);
    }

    function onUserUpdate(body: User) {
        const { id, ...rest } = body;
        usersUpdateId.value = id;
        for (const [key, value] of Object.entries(rest)) {
            // set value
            usersStoreForm.setValue(key as keyof UsersStoreDto, value);
        }
    }

    return (
        <div class="max-w-[700px] bg-[#362574] mx-auto p-2  mt-5 rounded-md flex gap-2">
            <Form
                className="w-[350px]"
                onSubmit={onUserStore}
                {...usersStoreForm}
            >
                <Form.control
                    name={"name" as keyof UsersStoreDto}
                    title="Nombre"
                    placeholder="Tu nombre"
                    question="Este campo es obligatorio."
                />
                <Form.control
                    name={"age" as keyof UsersStoreDto}
                    type="number"
                    title="Edad"
                    options={{ valueAsNumber: true }} //converter number because is string
                    placeholder="Tu nombre"
                />
                <Form.control.file
                    name={"image" as keyof UsersStoreDto}
                    title="Imagen"
                    typeFile="image" // file ,video,image
                    // accept="image/*"
                    // multiple
                />
                <Form.control.toggle
                    name={"enabled" as keyof UsersStoreDto}
                    title="Habilitado"
                />
                <div class="flex gap-2 items-center">
                    {/* reset form */}
                    <Form.button.reset />
                    <Form.button.submit
                        className="px-6 py-3"
                        title={usersUpdateId.value ? "Editar" : "Guardar"}
                        isLoading={false}
                        // more props: ico, isloading,disabled..etc
                    />
                </div>
                <code>{JSON.stringify(usersStoreForm.getValues())}</code>
            </Form>
            <div class="flex-1">
                <h3 class="text-center font-bold text-white ">
                    Usuarios{" "}
                    {users.value.length ? (
                        <b class="text-xs text-white font-bold">
                            {users.value.length}
                        </b>
                    ) : null}
                </h3>
                <div>
                    {users.value.length ? (
                        <div>
                            {/* in preact use "key" is not neccesary but is recomendable use it */}
                            {users.value.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onUserDelete={onUserDelete}
                                    onUserUpdate={onUserUpdate}
                                />
                            ))}
                        </div>
                    ) : (
                        <span class="text-xs text-white text-center block">
                            No hay usuarios
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

interface UserCardProps {
    user: User;
    onUserDelete: (id: string) => void;
    onUserUpdate: (user: User) => void;
}
function UserCard({ user, onUserDelete, onUserUpdate }: UserCardProps) {
    return (
        <>
            <div class="flex items-center text-xs gap-2 py-1 text-white">
                <span>
                    Nombre: <b>{user.name}</b>
                </span>
                <span>
                    Edad: <b>{user.age}</b>
                </span>
                <img
                    src={URL.createObjectURL(user.image[0])}
                    width={40}
                    height={40}
                    alt={user.name}
                />
                <div class="flex gap-2">
                    <button
                        class="bg-orange-600 px-4 py-1 rounded-md text-white"
                        type="button"
                        aria-label="update user"
                        onClick={() => onUserUpdate(user)}
                    >
                        <i class="fa-solid fa-pen" />
                    </button>
                    <button
                        class="bg-danger px-4 py-1 rounded-md text-white"
                        type="button"
                        aria-label="delete user"
                        onClick={() => onUserDelete(user.id)}
                    >
                        <i class="fa-solid fa-trash" />
                    </button>
                </div>
            </div>
            <div class="w-full h-[1px] bg-slate-500" />
        </>
    );
}

export default FormExample;
