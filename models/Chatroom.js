const mongoose = require("mongoose")

const ChatroomSchema = new mongoose.Schema({
    roomName: { type: String, unique: true, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

const Chatroom = mongoose.model("Chatroom", ChatroomSchema)
module.exports = Chatroom
