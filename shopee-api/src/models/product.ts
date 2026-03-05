import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price_old: number;
  sale_off_percent: number;
  image: string;
  category: string;
  rating: number;
  sold: number;
  brand?: string;
  origin?: string;
  description?: string;
  liked?: boolean;
  favorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price_old: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    sale_off_percent: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold quantity cannot be negative"],
    },
    brand: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    liked: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Tạo index cho tìm kiếm
ProductSchema.index({ name: "text", brand: "text", origin: "text" });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
