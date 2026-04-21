import mongoose from "mongoose";
export interface IC {
    _id: mongoose.Types.ObjectId;
    participants: mongoose.Types.ObjectId[];
    participantsKey: string;
    type: string;
    lastMessageAt: Date;
    lastMessagePreview: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Conversation: mongoose.Model<IC, {}, {}, {}, mongoose.Document<unknown, {}, IC, {}, mongoose.DefaultSchemaOptions> & IC & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IC>;
//# sourceMappingURL=conversationModel.d.ts.map