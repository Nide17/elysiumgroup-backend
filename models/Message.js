const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null for broadcasts and chatrooms
    chatroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' }, // Null for DMs and broadcasts
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
}, { timestamps: true })

MessageSchema.index({ sender: 1 });
MessageSchema.index({ receiver: 1 });
MessageSchema.index({ chatroom: 1 });
MessageSchema.index({ timestamp: -1 });

const Message = mongoose.model("Message", MessageSchema)
module.exports = Message
