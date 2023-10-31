import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { System, SystemSchema } from '../system.schema';

export type ProjectDocument = Project & Document;

export class ProjectProtection {
  private static getDefaultProtection() {
    return {
      name: 1,
    };
  }

  static DEFAULT(): any {
    return {
      ...this.getDefaultProtection(),
      system: 1,
    };
  }
}

export class ProjectPopulate {}

@Schema({
  timestamps: { createdAt: 'system.createdAt', updatedAt: 'system.modifiedAt' },
})
export class Project {
  @Prop()
  name: string;

  @Prop({ type: SystemSchema, required: false })
  system?: System;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
