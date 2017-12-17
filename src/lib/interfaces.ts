/**
 * Interfaces
 * 
 * Author: Jin-woo Shin
 * Date: 2017-12-17
 */
import * as express from "express";
import { AbstractChannel } from "./channel";
import * as user from "./user";
import { AbstractUser } from "./user";

export interface ISSEMessage {
	from: string;
	to: string;
	msg: string;
	dateSent: Date;
}

export interface ISSEConnection extends express.Response{
	id: string;
	sendMsg: (data: ISSEMessage) => void;
}

export interface IChannelPool {
	put: (channel: AbstractChannel) => void;
	get: (channelId: string) => AbstractChannel | undefined;
	getIds: () => string[];
	remove: (channelId: string) => void;
}

export interface IConnectionPool {
	put: (userId: string, conn: ISSEConnection) => void;
	get: (userId: string) => ISSEConnection | undefined;
	remove: (userId: string) => void;
}

export interface IMessageQueue {
	get: (channelId: string) => ISSEMessage[];
	put: (channelId: string, msg: ISSEMessage) => void;
	clear: (channelId: string) => void;
}

export interface IUserPool {
	get: (userId: string) => user.AbstractUser;
	put: (user: user.AbstractUser) => void;
	remove: (userId: string) => void;
}
