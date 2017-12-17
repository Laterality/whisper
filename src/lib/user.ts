/**
 * Abstract User class
 * 
 * Author: Jin-woo Shin
 * Date: 2017-12-17
 */
import { AbstractChannel } from "./channel";
import { ISSEConnection, ISSEMessage } from "./interfaces";
import * as sse from "./sse";

export class AbstractUser {

	private channelsBelong: AbstractChannel[];
	private connection: ISSEConnection | null;

	constructor(private id: string) {
		this.connection = null;
		this.channelsBelong = [];
	}

	public getId(): string {
		return this.id;
	}

	public setConnected(connection: ISSEConnection): void {
		this.connection = connection;
		
	}

	public setDisconnected(): void {
		this.connection = null;
	}

	public addChannel(channel: AbstractChannel): void {
		this.channelsBelong.push(channel);
	}

	public send(msg: ISSEMessage): void {
		if (this.connection) {
			this.connection.sendMsg(msg);
		}
	}

	public getChannels(): AbstractChannel[] {
		return this.channelsBelong;
	}
}
