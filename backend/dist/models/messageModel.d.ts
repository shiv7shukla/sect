import mongoose from "mongoose";
import type { IUser } from "./userModel.js";
import type { IC } from "./conversationModel.js";
export interface IM {
    _id: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId | IUser;
    conversationId: mongoose.Types.ObjectId | IC;
    content: {
        text: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Message: mongoose.Model<IM, {}, {}, {}, mongoose.Document<unknown, {}, IM, {}, mongoose.DefaultSchemaOptions> & IM & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IM>;
//# sourceMappingURL=messageModel.d.ts.map