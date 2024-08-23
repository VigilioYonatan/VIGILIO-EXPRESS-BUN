import type { ServerMiddleware } from "@vigilio/express-core";
import socket from "socket.io";

export class GlobalMiddleware implements ServerMiddleware {
	public use(
		_io: socket.Server | socket.Namespace,
		_socket: socket.Socket,
		next: () => void,
	) {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log(
			"********************conectado sockets correctamente***************",
		);
		next();
	}
}
