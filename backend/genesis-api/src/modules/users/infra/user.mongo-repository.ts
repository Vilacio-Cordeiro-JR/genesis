import type { NewUser, User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { UserModel, type UserLean } from './user.model';

const toUser = (doc: UserLean): User => ({
  id: doc._id.toHexString(),
  name: doc.name,
  email: doc.email,
  passwordHash: doc.passwordHash,
  role: doc.role,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).select('+passwordHash').lean<UserLean>();
    return doc ? toUser(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).select('+passwordHash').lean<UserLean>();
    return doc ? toUser(doc) : null;
  }

  async create(data: NewUser): Promise<User> {
    const created = await UserModel.create(data);
    return toUser({ ...created.toObject(), passwordHash: data.passwordHash } as UserLean);
  }
}
