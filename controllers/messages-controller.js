const Message = require("../models/Message")
const User = require("../models/User")
const Chatroom = require("../models/Chatroom")
const mongoose = require("mongoose")

exports.getAllMessages = async (req, res) => {

  try {
    const messages = await Message.find()
      .populate({ path: 'sender', select: { '_id': 1, 'name': 1, 'picture': 1 }, })

    if (!messages) {
      return res.status(200).json({ message: "No messages found" })
    }
    return res.status(200).json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
exports.getChatMessages = async (req, res) => {
  const { sender, receiver } = req.params

  try {
    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender }
      ]
    })
      .populate({ path: 'sender', select: { '_id': 1, 'name': 1, 'picture': 1 }, })
      .sort({ createdAt: 1 })

    if (!messages) {
      return res.status(200).json({ message: "No messages found" })
    }

    res.status(200).json(messages)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getChatroomMessages = async (req, res) => {
  const { chatroomID } = req.params

  try {
    const messages = await Message.find({ chatroom: chatroomID })
      .populate({ path: 'sender', select: { '_id': 1, 'name': 1, 'picture': 1 }, })

    if (!messages) {
      return res.status(200).json({ message: "No messages found" })
    }

    return res.status(200).json(messages)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

exports.getBroadcastMessages = async (req, res) => {

  try {
    const messages = await Message.find({ receiver: null, chatroom: null })
      .populate({ path: 'sender', select: { '_id': 1, 'name': 1, 'picture': 1 }, })

    if (!messages) {
      return res.status(200).json({ message: "No broadcasts found" })
    }

    return res.status(200).json(messages)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

exports.getUserChatList = async (req, res) => {
  const { userID } = req.params;

  try {
    // Ensure userID is a valid ObjectId
    const validUserID = mongoose.Types.ObjectId.isValid(userID) ? new mongoose.Types.ObjectId(userID) : null;

    if (!validUserID) {
      return res.status(400).json({ error: "Invalid userID" });
    }

    // Fetch latest messages for general broadcasts: messages sent to everyone (receiver=null, chatroom=null)
    const broadcastMessages = await Message.aggregate([
      {
        $match: { receiver: null, chatroom: null }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: null,
          latestMessage: { $first: '$$ROOT' },
          allMessages: { $push: '$$ROOT' }
        }
      }
    ]);

    // Fetch latest messages for chatrooms
    const chatroomMessages = await Message.aggregate([
      {
        $match: { chatroom: { $ne: null } }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$chatroom',
          latestMessage: { $first: '$$ROOT' },
          allMessages: { $push: '$$ROOT' }
        }
      }
    ])

    // Fetch latest messages for DMs
    const dmMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: validUserID },
            { receiver: validUserID }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: { $cond: { if: { $eq: ['$sender', validUserID] }, then: '$receiver', else: '$sender' } },
          latestMessage: { $first: '$$ROOT' },
          allMessages: { $push: '$$ROOT' }
        }
      }
    ])

    // Combine results and fetch user/chatroom details
    const chatLists = await Promise.all([
      ...broadcastMessages.map(async (msg) => {
        return {
          type: 'broadcast',
          latestMessage: msg.latestMessage,
          allMessages: msg.allMessages
        };
      }),
      ...chatroomMessages.map(async (msg) => {
        const chatroom = await Chatroom.findById(msg._id);
        return {
          type: 'chatroom',
          chatroom,
          latestMessage: msg.latestMessage,
          allMessages: msg.allMessages
        };
      }),
      ...dmMessages.map(async (msg) => {
        const user = await User.findById(msg._id);
        return {
          type: 'dm',
          user,
          latestMessage: msg.latestMessage,
          allMessages: msg.allMessages
        };
      }),
    ]);

    // Return the combined chat list
    return res.json(chatLists);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addMessage = async (req, res) => {

  const { sender, receiver, message, chatroom } = req.body

  const newMessage = new Message({ sender, receiver, message, chatroom })

  try {
    const result = await newMessage.save()

    // Populate the 'user' field to get the full user document
    const populatedMessage = await Message.findById(result._id)
      .populate({ path: 'sender', select: { '_id': 1, 'name': 1, 'picture': 1 }, })

    return res.status(201).json(populatedMessage)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Failed to send message" })
  }
}

exports.updateMessage = async (req, res) => {
  const { sender, receiver, message, chatroom } = req.body

  const messageID = req.params.messageID

  try {
    const updatedMessage = await Message.findByIdAndUpdate(messageID, { sender, receiver, message, chatroom })

    if (!updatedMessage) {
      return res.status(500).json({ message: "Unable to update message" })
    }
    return res.status(200).json({ updatedMessage, message: "Message updated successfully" })

  } catch (error) {
    return res.status(500).json({ message: "Failed to update message" })
  }
}

exports.getOneMessage = async (req, res) => {
  const messageID = req.params.messageID

  try {
    const message = await Message.findById(messageID)
      .populate({ path: 'sender', select: { '_id': 1, 'name': 1, 'picture': 1 }, })

    if (!message || message.length === 0) {
      return res.status(404).json({ message: "No message found" })
    }
    return res.status(200).json(message)
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch message" })
  }
}

exports.deleteMessage = async (req, res) => {
  const messageID = req.params.id

  try {
    const deletedMessage = await Message.findByIdAndDelete(messageID)

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" })
    }
    res
      .status(200)
      .json({ message: "Message deleted successfully", message: deletedMessage })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" })
  }
}

// Mark messages as read
exports.markAsRead = async (req, res) => {

  const messagesIDs = req.body;
  console.log("Messages to mark as read", req.body);
  try {

    if (!messagesIDs || messagesIDs.length === 0) {
      return res.status(200).send("All messages are marked as read");
    }

    await Message.updateMany({ _id: { $in: messagesIDs } }, { $set: { read: true } });
    res.status(200).send("Messages marked as read");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}