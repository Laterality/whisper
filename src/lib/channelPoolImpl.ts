/**
 * In-memory channel pool implementation
 * 
 * Author: Jin-woo Shin
 * Date: 2017-11-22
 */
import * as sse from "./sse";
import { ISSEConnection } from "./sse";

export class ChannelPoolImpl implements sse.IChannelPool {

	private mChannels: any = {};

	public put(channelId: string, group: sse.ISSEConnection[]) {
		// this.mChannels.set(channelId, group);
		this.mChannels[channelId] = group;
	}

	public get(channelId: string) {
		// return this.mChannels.get(channelId);
		return this.mChannels[channelId];
	}

	public getIds() {
		const ids: string[] = [];
		// this.mChannels.forEach((value: sse.ISSEConnection[] | undefined, key: string, map: Map<string, sse.ISSEConnection[] | undefined>) => {
		// 	ids.push(key);
		// });
		for (const id in this.mChannels) {
			ids.push(id);
		}
		return ids;
	}

	public putInto(channelId: string, user: ISSEConnection) {
		// const channel = this.mChannels.get(channelId);
		// console.log("connection: ", user);
		const channel = this.mChannels[channelId];
		if (!channel) { return; }
		channel.push(user);
	}

	public remove(channelId: string) {
		// this.mChannels.set(channelId, undefined);
		this.mChannels[channelId] = undefined;
	}

	public removeUser(channelId: string, userId: string) {
		// const channels = this.mChannels.get(channelId);
		const channels = this.mChannels[channelId];
		if (!channels) { return; }
		const idx = channels.findIndex((value: sse.ISSEConnection, index: number, obj: sse.ISSEConnection[]) => {
			return value.id === userId;
		});
	}
}
