const express = require("express")
const {getAllMessages, addMessage, markRead, updateMessage, getOneMessage, deleteMessage, getChatMessages, getChatList, getChatroomMessages, getBroadcastMessages } = require("../controllers/messages-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllMessages)
router.post("/", addMessage)
router.post("/:messageID", markRead)
router.put("/:messageID", updateMessage)
router.delete("/:messageID", deleteMessage)
// /api/messages/chat/${sender}/${receiver}
router.get("/chat/:sender/:receiver", getChatMessages)
router.get("/chatroom/:chatroomID", getChatroomMessages)
router.get("/broadcast", getBroadcastMessages)
router.get("/chat_list/:userID", getChatList)
router.get("/:messageID", getOneMessage)

module.exports = router
