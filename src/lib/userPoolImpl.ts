/**
 * Simple User Pool Implementation
 * 
 * Author: Jin-woo Shin
 * Date: 2017-12-17
 */
import { IUserPool } from "./interfaces";
import { AbstractUser } from "./user";

export class UserPoolImpl implements IUserPool{

	private users: any;

	constructor() {
		this.users = {};
	}

	public get(userId: string): AbstractUser {
		return this.users[userId];
	}

	public put(user: AbstractUser): void {
		this.users[user.getId()] = user;
		console.log("put " + user.getId() + " into user pool");
	}

	public remove(userId: string): void {
		delete this.users[userId];
		console.log("user " + userId + " removed from user pool");
		console.log("user " + userId + ": " + this.users[userId] );
	}
}
