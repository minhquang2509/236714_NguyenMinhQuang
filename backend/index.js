import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Food from './models/Food.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Ket noi MongoDB Atlas thanh cong'))
  .catch((err) => console.error('Loi ket noi MongoDB:', err));

// 1. Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend hoat dong tot' });
});

// 2. Lấy danh sách món ăn & Hỗ trợ tìm kiếm (?search=...)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

// 3. Xem chi tiết món ăn theo ID (Mongo ID hoặc foodId)
app.get('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let food = await Food.findById(id).catch(() => null);
    if (!food) food = await Food.findOne({ foodId: id });
    if (!food) return res.status(404).json({ message: 'Khong tim thay mon an' });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

// 4. Thêm món ăn mới (Kiểm tra trùng foodId)
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;
    if (!foodId || !name || !category || !cuisine || price == null || quantity == null) {
      return res.status(400).json({ message: 'Vui long nhap day du thong tin bat buoc' });
    }
    const existing = await Food.findOne({ foodId });
    if (existing) {
      return res.status(400).json({ message: 'Ma mon an (foodId) da ton tai' });
    }
    const newFood = new Food({ foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl });
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

// 5. Cập nhật thông tin món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Food.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Khong tim thay mon an de cap nhat' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

// 6. Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Food.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Khong tim thay mon an de xoa' });
    res.status(200).json({ message: 'Xoa thanh cong', food: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server dang chay tai port ${PORT}`);
});