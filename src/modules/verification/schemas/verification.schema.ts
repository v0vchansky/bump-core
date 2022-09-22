import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class VerificationModel {
    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    code: string;
}

export type VerificationDocument = VerificationModel & Document;

export const VerificationSchema = SchemaFactory.createForClass(VerificationModel);
