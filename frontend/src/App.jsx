import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    foodId: '', name: '', category: '', cuisine: '',
    ingredients: '', price: '', quantity: '', description: '', imageUrl: ''
  });

  const fetchFoods = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `${API_BASE}/api/foods?search=${encodeURIComponent(keyword)}` : `${API_BASE}/api/foods`;
      const res = await axios.get(url);
      setFoods(res.data);
    } catch (err) {
      setError('Lỗi tải dữ liệu từ server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchFoods(search); };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ foodId: '', name: '', category: '', cuisine: '', ingredients: '', price: '', quantity: '', description: '', imageUrl: '' });
    setIsEditing(false);
    setSelectedFood(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ingredients: typeof formData.ingredients === 'string' ? formData.ingredients.split(',').map(s => s.trim()) : formData.ingredients
    };
    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/api/foods/${selectedFood._id}`, payload);
        setSuccess('Cập nhật món ăn thành công!');
      } else {
        await axios.post(`${API_BASE}/api/foods`, payload);
        setSuccess('Thêm món ăn mới thành công!');
      }
      resetForm();
      fetchFoods();
    } catch (err) {
      setError(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleEdit = (food) => {
    setSelectedFood(food);
    setIsEditing(true);
    setFormData({
      foodId: food.foodId, name: food.name, category: food.category, cuisine: food.cuisine,
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      price: food.price, quantity: food.quantity, description: food.description || '', imageUrl: food.imageUrl || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món này?')) return;
    try {
      await axios.delete(`${API_BASE}/api/foods/${id}`);
      setSuccess('Xóa món thành công!');
      fetchFoods();
    } catch (err) {
      setError('Không thể xóa món ăn');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', color: '#333' }}>
      
      {/* Tiêu đề đã được chỉnh sửa kích thước và line-height để không bị chồng */}
      <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '25px', lineHeight: '1.4', color: '#2c3e50' }}>
        Hệ Thống Quản Lý Món Ăn<br />
        <span style={{ fontSize: '18px', fontWeight: 'normal', color: '#555' }}>MSSV: 236714 - Nguyễn Minh Quang</span>
      </h1>

      {error && <div style={{ color: '#d9534f', background: '#f2dede', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      {success && <div style={{ color: '#449d44', background: '#dff0d8', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

      {/* Tìm kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Tìm theo tên, loại, ẩm thực..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ padding: '8px 12px', flex: '1', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#337ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Tìm kiếm</button>
        <button type="button" onClick={() => { setSearch(''); fetchFoods(); }} style={{ padding: '8px 16px', background: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Làm mới</button>
      </form>

      {/* Form Thêm / Sửa */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '6px', border: '1px solid #e3e3e3', marginBottom: '30px' }}>
        <h3 style={{ marginTop: '0', marginBottom: '15px', fontSize: '18px', color: '#333' }}>
          {isEditing ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <input name="foodId" placeholder="Mã món (foodId)" value={formData.foodId} onChange={handleInputChange} disabled={isEditing} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input name="name" placeholder="Tên món ăn" value={formData.name} onChange={handleInputChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input name="category" placeholder="Loại món ăn" value={formData.category} onChange={handleInputChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input name="cuisine" placeholder="Ẩm thực / Vùng miền" value={formData.cuisine} onChange={handleInputChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input name="price" type="number" placeholder="Giá bán (VNĐ)" value={formData.price} onChange={handleInputChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleInputChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input name="ingredients" placeholder="Nguyên liệu (cách nhau bởi dấu phẩy)" value={formData.ingredients} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input name="imageUrl" placeholder="Đường dẫn hình ảnh URL" value={formData.imageUrl} onChange={handleInputChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <textarea name="description" placeholder="Mô tả món ăn" value={formData.description} onChange={handleInputChange} style={{ gridColumn: 'span 2', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} />
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isEditing ? 'Lưu Thay Đổi' : 'Thêm Món Ăn'}
            </button>
            {isEditing && <button type="button" onClick={resetForm} style={{ marginLeft: '10px', padding: '10px 20px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>}
          </div>
        </form>
      </div>

      {/* Bảng danh sách */}
      <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#2c3e50' }}>Danh Sách Món Ăn</h2>
      {loading ? <p>Đang tải...</p> : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#ddd' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th>Ảnh</th>
              <th>Mã ID</th>
              <th>Tên món</th>
              <th>Loại</th>
              <th>Ẩm thực</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Không có món ăn nào</td></tr> : (
              foods.map(food => (
                <tr key={food._id}>
                  <td style={{ textAlign: 'center' }}>{food.imageUrl ? <img src={food.imageUrl} alt="" width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} /> : 'Trống'}</td>
                  <td>{food.foodId}</td>
                  <td><strong>{food.name}</strong></td>
                  <td>{food.category}</td>
                  <td>{food.cuisine}</td>
                  <td>{food.price?.toLocaleString()} đ</td>
                  <td>{food.quantity}</td>
                  <td>
                    <button onClick={() => setSelectedFood(food)} style={{ marginRight: '5px', padding: '4px 8px', background: '#5bc0de', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Xem</button>
                    <button onClick={() => handleEdit(food)} style={{ marginRight: '5px', padding: '4px 8px', background: '#f0ad4e', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(food._id)} style={{ padding: '4px 8px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Xem chi tiết */}
      {selectedFood && !isEditing && (
        <div style={{ marginTop: '25px', padding: '20px', border: '1px solid #bce8f1', background: '#e8f4f8', borderRadius: '6px' }}>
          <h3 style={{ marginTop: '0', color: '#31708f' }}>Chi Tiết: {selectedFood.name}</h3>
          <p><strong>Mã món:</strong> {selectedFood.foodId}</p>
          <p><strong>Loại:</strong> {selectedFood.category} | <strong>Ẩm thực:</strong> {selectedFood.cuisine}</p>
          <p><strong>Giá:</strong> {selectedFood.price?.toLocaleString()} VNĐ | <strong>Số lượng:</strong> {selectedFood.quantity}</p>
          <p><strong>Nguyên liệu:</strong> {Array.isArray(selectedFood.ingredients) ? selectedFood.ingredients.join(', ') : selectedFood.ingredients}</p>
          <p><strong>Mô tả:</strong> {selectedFood.description}</p>
          <button onClick={() => setSelectedFood(null)} style={{ padding: '6px 15px', background: '#777', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Đóng</button>
        </div>
      )}
    </div>
  );
}

export default App;