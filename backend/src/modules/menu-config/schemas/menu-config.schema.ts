import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MenuConfigDocument = MenuConfig & Document;

@Schema({ timestamps: true })
export class MenuConfig {
  @Prop({ required: true, trim: true })
  label: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  route: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: [String], default: ['admin', 'user', 'company'] })
  roles: string[];

  @Prop({ type: Types.ObjectId, ref: 'MenuConfig', default: null })
  parentMenu: Types.ObjectId;

  @Prop({
    type: {
      canCreate: { type: Boolean, default: true },
      canEdit: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: true },
      canView: { type: Boolean, default: true },
    },
    default: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canView: true,
    },
  })
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
  };
}

export const MenuConfigSchema = SchemaFactory.createForClass(MenuConfig);

// Índice para ordenação eficiente
MenuConfigSchema.index({ order: 1 });
MenuConfigSchema.index({ parentMenu: 1 });
