import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  foodId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  cuisine: { type: String, required: true },
  ingredients: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  description: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Food', foodSchema, 'foods');