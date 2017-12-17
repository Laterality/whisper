import * as mongoose from "mongoose";

export const ChannelModel = mongoose.model("Channel", new mongoose.Schema({
	id: String,
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	}],
}));

export const UserModel = mongoose.model("User", new mongoose.Schema({
	id: String,
	channels: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Channel",
	}],
}));
