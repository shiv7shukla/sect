import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
    participantsKey: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        enum: ["direct", "group"],
        default: "direct"
    },
    lastMessageAt: {
        type: Date,
    },
    lastMessagePreview: {
        type: String,
    },
}, { timestamps: true });
conversationSchema.index({ type: 1, participantsKey: 1 }, { unique: true });
export const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
//# sourceMappingURL=conversationModel.js.map