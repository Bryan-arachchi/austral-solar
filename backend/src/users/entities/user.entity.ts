import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { userTypes, UserAuthState } from 'src/Types/user.types';

@Schema({ _id: false })
class GeoJSONPoint {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: 'Point';

  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

@Schema({
  timestamps: true,
})
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ type: String, required: false, default: '' })
  avatar: string;

  @Prop({
    required: true,
    type: [String],
    enum: userTypes,
  })
  type: userTypes[];

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: false, type: Boolean, default: false })
  loginEnabled: boolean;

  @Prop({ required: false, type: String, default: UserAuthState.UNVERIFIED })
  authState: UserAuthState;

  @Prop({ type: GeoJSONPoint, required: false })
  location?: GeoJSONPoint;

  @Prop({ type: String, required: false })
  phoneNumber?: string;

  @Prop({ type: String, required: false })
  address?: string;

  @Prop({ type: String, required: false })
  city?: string;

  @Prop({ type: String, required: false })
  country?: string;
}

export type UserDocument = HydratedDocument<User>;

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);

// Create a 2dsphere index on the location field
UserSchema.index({ location: '2dsphere' });

export { UserSchema };
