import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

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
export class Branch {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  locationName: string;

  @Prop({ type: GeoJSONPoint, required: true })
  location: GeoJSONPoint;

  @Prop({ type: String, required: false })
  phoneNumber?: string;

  @Prop({ type: String, required: false })
  email?: string;
}

export type BranchDocument = HydratedDocument<Branch>;

const BranchSchema = SchemaFactory.createForClass(Branch);

BranchSchema.plugin(mongoosePaginate);

// Create a 2dsphere index on the location field
BranchSchema.index({ location: '2dsphere' });

export { BranchSchema };
