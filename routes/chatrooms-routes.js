const express = require("express")
const { getAllChatrooms, addChatroom, updateChatroom, getOneChatroom, deleteChatroom } = require("../controllers/chatrooms-controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

router.get("/", getAllChatrooms)
router.post("/", addChatroom)
router.put("/:chatroomID", updateChatroom)
router.get("/:chatroomID", getOneChatroom)
router.delete("/:chatroomID", deleteChatroom)

module.exports = router
