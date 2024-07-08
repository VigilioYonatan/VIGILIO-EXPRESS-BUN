import { Injectable } from "@vigilio/express-core";

@Injectable()
export class AppService {
	index() {
		const user = { id: 0, fullName: "Will Smith", edad: 54 };
		return { user, title: "home" };
	}
}
