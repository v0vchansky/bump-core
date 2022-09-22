import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserModel {
    @Prop({ required: true })
    phone: string;

    @Prop()
    name: string;

    @Prop()
    birthday: string;
}

export type UserDocument = UserModel & Document;

export const UserSchema = SchemaFactory.createForClass(UserModel);
