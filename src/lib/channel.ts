import { ISSEMessage } from "./interfaces";
import { AbstractUser } from "./user";

export class AbstractChannel {
	private users: AbstractUser[];
	
	constructor(private id: string) {
		this.users = [];
	}

	public getId() {
		return this.id;
	}

	public join(user: AbstractUser) {
		user.addChannel(this);
		this.users.push(user);
	}

	public exit(user: AbstractUser) {
		const idx = this.users.indexOf(user);
		if (idx > -1) {
			// user exists
			this.users.splice(idx, 1);
		}
	}

	public broadcast(msg: ISSEMessage) {
		for (const p of this.users) {
			p.send(msg);
		}
	}
}
