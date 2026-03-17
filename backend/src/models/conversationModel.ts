import mongoose from "mongoose";

export interface IC{
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  participantsKey: string;
  type: string;
  lastMessageAt: Date;
  lastMessagePreview: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const conversationSchema = new mongoose.Schema<IC>({
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
},{timestamps: true});

conversationSchema.index({type: 1, participantsKey:1}, {unique: true});

export const Conversation = mongoose.models.Conversation as mongoose.Model<IC>||mongoose.model<IC>("Conversation", conversationSchema);