import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    //a conversation is a folder a message is a file inside that folder a file without a folder is useless.
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    content: {
        text: {
            type: String,
            required: true
        }
    },
}, { timestamps: true });
messageSchema.index({ conversationId: 1, createdAt: 1 });
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
//# sourceMappingURL=messageModel.js.map