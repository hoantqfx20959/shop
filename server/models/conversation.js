const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    clientUserName: {
      type: String,
      required: true,
    },
    messages: [
      {
        content: String,
        username: String,
        ofUser: Schema.Types.ObjectId,
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastSender: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
