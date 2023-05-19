import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const sendMessage = async (req, res) => {
  try {
    const recipientId = req.params.id;
    const { content, userId } = req.body;

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      throw new Error("No se ha encontrado al mensajero");
    }

    let conversation = await Conversation.findOne({
      recipients: {
        $all: [userId, recipientId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        recipients: [userId, recipientId],
      });
    }

    await Message.create({
      conversation: conversation._id,
      sender: userId,
      content,
    });

    conversation.lastMessageAt = Date.now();

    conversation.save();

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("No se ha encontrado la conversación");
    }

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "-password")
      .sort("-createdAt")
      .limit(12);

    return res.json(messages);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const { userId } = req.body;

    const conversations = await Conversation.find({
      recipients: {
        $in: [userId],
      },
    })
      .populate("recipients", "-password")
      .sort("-updatedAt")
      .lean();

    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      for (let j = 0; j < 2; j++) {
        if (conversation.recipients[j]._id != userId) {
          conversation.recipient = conversation.recipients[j];
        }
      }
    }

    return res.json(conversations);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

export {
  sendMessage,
  getMessages,
  getConversations,
};
