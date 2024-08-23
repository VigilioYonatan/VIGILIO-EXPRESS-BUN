import { Users } from "@/users/entities/users.entity";
import { Injectable } from "@vigilio/express-core";

@Injectable()
export class AuthService {
   
    async forgotPassword(token: string | null) {
        let userByToken = null;
        if (token) {
            const user = await Users.findOne({
                where: { token },
                attributes: ["id", "username", "enabled"],
            });
            if (user) {
                await user.update({ token: null });
                userByToken = user;
            }
        }

        return {
            user: userByToken,
        };
    }
}
