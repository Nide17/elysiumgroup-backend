const express = require("express")
const { getAllMessages, addMessage, markAsRead, updateMessage, getOneMessage, deleteMessage,
    getChatMessages, getUserChatList, getChatroomMessages, getBroadcastMessages } = require("../controllers/messages-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllMessages)
router.post("/", addMessage)
router.put("/markAsRead", markAsRead)
router.put("/:messageID", updateMessage)
router.delete("/:messageID", deleteMessage)
// /api/messages/chat/${sender}/${receiver}
router.get("/chat/:sender/:receiver", getChatMessages)
router.get("/chatroom/:chatroomID", getChatroomMessages)
router.get("/broadcast", getBroadcastMessages)
router.get("/userChatList/:userID", getUserChatList)
router.get("/:messageID", getOneMessage)

module.exports = router
