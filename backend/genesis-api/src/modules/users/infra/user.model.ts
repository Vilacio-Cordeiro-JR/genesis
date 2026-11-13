import { model, Schema, type Types } from 'mongoose';
import { USER_ROLES, type UserRole } from '../domain/user.entity';

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserLean = UserDocument & { _id: Types.ObjectId };

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true, maxlength: 160 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: [...USER_ROLES], default: 'ADMIN' },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = model<UserDocument>('User', userSchema, 'users');
