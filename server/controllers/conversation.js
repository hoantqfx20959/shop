const User = require('../models/auth');
const Conversation = require('../models/conversation');

exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find();
    res.status(201).json(conversations);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId);
    res.status(201).json(conversation);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getConversationByClientId = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const conversation = await Conversation.findOne({ clientId: clientId });
    res.status(201).json(conversation);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};
