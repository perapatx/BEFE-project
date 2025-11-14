import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBoardGamePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    creater: "",
    publisher: "",
    category: "",
    year: "",
    description: "",
    price: "",
    stock: "",
    rating: "",
    reviews_count: "",
    is_new: false,
    min_players: "",
    max_players: "",
    language: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...formData,
      year: Number(formData.year) || 0,
      price: parseFloat(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      rating: parseFloat(formData.rating) || 0,
      reviews_count: Number(formData.reviews_count) || 0,
      min_players: Number(formData.min_players) || 0,
      max_players: Number(formData.max_players) || 0,
      is_new: formData.is_new,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/v1/boardgames", payload);
      if (res.status === 201) {
        setMessage("✅ เพิ่มบอร์ดเกมสำเร็จ!");
        setFormData({
          title: "",
          creater: "",
          publisher: "",
          category: "",
          year: "",
          description: "",
          price: "",
          stock: "",
          rating: "",
          reviews_count: "",
          is_new: false,
          min_players: "",
          max_players: "",
          language: "",
        });
        setTimeout(() => {
          navigate("/store-manager/boardgamelist");
        }, 800);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage("❌ เกิดข้อผิดพลาด: " + err.response.data.error);
      } else {
        setMessage("❌ เกิดข้อผิดพลาด: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-400 flex justify-center items-start p-6 pt-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl relative">

        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate("/store-manager/boardgamelist")}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium shadow"
        >
          ← กลับไปยังรายการบอร์ดเกม
        </button>

        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          เพิ่มบอร์ดเกมใหม่
        </h2>

        {message && (
          <div
            className={`text-center mb-4 font-semibold ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">ชื่อเกม</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">ผู้สร้าง</label>
            <input
              type="text"
              name="creater"
              value={formData.creater}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">ผู้จัดจำหน่าย</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">หมวดหมู่</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">ปีที่ผลิต</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">ภาษา</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">คำอธิบาย</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">ราคา</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">จำนวนในสต็อก</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">จำนวนผู้เล่นขั้นต่ำ</label>
            <input
              type="number"
              name="min_players"
              value={formData.min_players}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">จำนวนผู้เล่นสูงสุด</label>
            <input
              type="number"
              name="max_players"
              value={formData.max_players}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_new"
              checked={formData.is_new}
              onChange={handleChange}
              className="h-4 w-4 text-red-500 focus:ring-red-400"
            />
            <label className="text-gray-700">สินค้าใหม่</label>
          </div>

          <div className="sm:col-span-2 text-center">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition"
            >
              บันทึกบอร์ดเกม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBoardGamePage;
