/**
 * In-memory channel pool implementation
 * 
 * Author: Jin-woo Shin
 * Date: 2017-11-22
 */
import { AbstractChannel } from "./channel";
import { IChannelPool, ISSEConnection } from "./interfaces";
import * as sse from "./sse";

export class ChannelPoolImpl implements IChannelPool {

	private mChannels: any = {};

	public put(channel: AbstractChannel): void {
		// this.mChannels.set(channelId, group);
		this.mChannels[channel.getId()] = channel;
	}

	public get(channelId: string): AbstractChannel | undefined{
		// return this.mChannels.get(channelId);
		return this.mChannels[channelId];
	}

	public getIds(): string[] {
		const ids: string[] = [];
		// this.mChannels.forEach((value: sse.ISSEConnection[] | undefined, key: string, map: Map<string, sse.ISSEConnection[] | undefined>) => {
		// 	ids.push(key);
		// });
		for (const id in this.mChannels) {
			ids.push(id);
		}
		return ids;
	}

	public remove(channelId: string): void {
		// this.mChannels.set(channelId, undefined);
		this.mChannels[channelId] = undefined;
	}

}
