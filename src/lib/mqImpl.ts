/**
 * 
 * Simple Message Queue Implementation
 * 
 * Author: Jin-woo Shin
 * Date: 2017-12-09
 */
import * as sse from "./sse";
import { ISSEMessage } from "./sse";

export class MQImpl implements sse.IMessageQueue {

	private queue: any = {};
	
	public get(channelId: string): ISSEMessage[] {
		const q = this.queue["channelId"];

		if (q) {
			return q;
		}
		else {
			return [];
		}
	}

	public put(channelId: string, msg: sse.ISSEMessage) {
		const q: ISSEMessage[] = this.queue[channelId];
		if (!q) {
			this.queue[channelId] = [];
		}
		else {
			this.queue[channelId].push(msg);
		}
	}

	public clear(channelId: string) {
		this.queue[channelId] = [];
	}
}
