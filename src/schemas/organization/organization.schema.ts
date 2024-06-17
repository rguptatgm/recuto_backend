import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { SystemSchema, System } from "../system.schema";
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrganizationDocument = Organization & Document;

export class OrganizationProtection{
    private static getDefaultProtection() {
        return {
            title: 1,
            system: 1,
        };
    }
    static DEFAULT(): any {
        return {
            ...this.getDefaultProtection(),
        };
    }
}
@Schema({
    timestamps: { createdAt: 'system.createdAt', updatedAt: 'system.modifiedAt' },
})
export class Organization {
    @Prop()
    title: string;

    @Prop({ type: SystemSchema, required: false })
    system?: System;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);