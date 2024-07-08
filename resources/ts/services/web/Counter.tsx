import { useSignal } from "@preact/signals";

function Counter() {
    const numero = useSignal(0);

    function onIncrement() {
        numero.value += 1;
    }
    function onDecrement() {
        numero.value -= 1;
    }
    return (
        <>
            {/* en preact hay un bug con botones y <a/> */}
            <span
                class="py-2 px-4 bg-black bg-opacity-50 text-white"
                onClick={onIncrement}
                type="button"
                aria-label="change number"
            >
                +
            </span>
            <span class="text-white font-bold">{numero.value}</span>
            <span
                class="py-2 px-4 bg-black bg-opacity-50 text-white"
                onClick={onDecrement}
                type="button"
                aria-label="change number"
            >
                -
            </span>
        </>
    );
}

export default Counter;
