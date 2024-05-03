const Chatroom = require("../models/Chatroom")

exports.getAllChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find()
    return res.status(200).json(chatrooms)
  } catch (err) {
    return res.status(500).json({ error: "Unable to get all chatrooms" })
  }
}

exports.addChatroom = async (req, res) => {

  const { roomName, createdBy, members } = req.body

  const newChatroom = new Chatroom({ roomName, createdBy, members })

  try {
    const chatroom = await newChatroom.save()
    res.status(201).json({ chatroom, message: "Chatroom created successfully" })
  } catch (error) {
    res.status(500).json({ chatroom: "Failed to send chatroom" })
  }
}
exports.updateChatroom = async (req, res) => {
  const { roomName, createdBy, members } = req.body

  const chatroomID = req.params.chatroomID
  let updatedChatroom

  try {
    updatedChatroom = await Chatroom.findByIdAndUpdate(chatroomID, { roomName, createdBy, members })
  } catch (error) {
    return res.status(500).json({ chatroom: "Failed to update chatroom" })
  }
  if (!updatedChatroom) {
    return res.status(500).json({ chatroom: "Unable to update chatroom" })
  }
  return res.status(200).json({ updatedChatroom, chatroom: "Chatroom updated successfully" })
}

exports.getOneChatroom = async (req, res) => {
  const chatroomID = req.params.chatroomID

  let chatroom

  try {
    chatroom = await Chatroom.findById(chatroomID)
  } catch (error) {
    return res.status(500).json({ chatroom: "Failed to fetch chatroom" })
  }
  if (!chatroom) {
    return res.status(404).json({ chatroom: "No chatroom found" })
  }
  return res.status(200).json(chatroom)
}

exports.deleteChatroom = async (req, res) => {
  const chatroomID = req.params.id

  try {
    const deletedChatroom = await Chatroom.findByIdAndDelete(chatroomID)

    if (!deletedChatroom) {
      return res.status(404).json({ chatroom: "Chatroom not found" })
    }
    res
      .status(200)
      .json({ chatroom: "Chatroom deleted successfully", chatroom: deletedChatroom })
  } catch (error) {
    res.status(500).json({ chatroom: "Failed to delete chatroom" })
  }
}
