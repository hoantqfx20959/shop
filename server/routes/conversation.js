const express = require('express');

const router = express.Router();

const conversationController = require('../controllers/conversation');

router.get('/conversations', conversationController.getConversations);

router.get('/conversation/:id', conversationController.getConversation);

router.get(
  '/conversation-by-client/:id',
  conversationController.getConversationByClientId
);

module.exports = router;
