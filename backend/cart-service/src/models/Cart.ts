import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

CartSchema.index({ userId: 1 });

export default mongoose.model<ICart>('Cart', CartSchema);

