import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/solid';
const BoardGameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8080/api/v1/boardgames/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch board game details');
        }

        const data = await response.json();
        setGame(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching board game:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGame();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50">
        <div className="text-xl text-red-600 mb-4">Error: {error}</div>
        <Link to="/games" className="text-blue-600 hover:underline">
          Go back to Board Game List
        </Link>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50">
        <div className="text-xl mb-4">Board game not found</div>
        <Link to="/games" className="text-blue-600 hover:underline">
          Go back to Board Game List
        </Link>
      </div>
    );
  }
  const HandleCount =()=> {
    if (count >1) {
      setCount(count -1)
    }
  }
  return (
    <div className="min-h-screen bg-red-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/games" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Board Game List
        </Link>

       


<div className="max-w-6xl mx-auto p-4 space-y-4">

  {/* ===== ส่วนที่ 1: ส่วนบน (รูป + ราคา/ปุ่ม) ===== */}
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="md:flex md:space-x-8">

      {/* --- คอลัมน์ซ้าย: รูป (จากโค้ดเดิมของคุณ) --- */}
      <div className="w-full md:w-2/5 flex-shrink-0">
        <img
          src={game.cover_image || '/images/boardgameCover/1.png'}
          alt={game.title}
          className="w-full h-auto object-cover rounded-lg border border-gray-200"
        />
        {/* Mockup thumbnails (อิงจาก Shopee) */}
        <div className="flex space-x-2 mt-2">
          <div className="w-16 h-16 rounded border-2 border-red-500 bg-gray-100"></div>
          <div className="w-16 h-16 rounded border border-gray-300 bg-gray-100"></div>
        </div>
      </div>

      {/* --- คอลัมน์ขวา: ข้อมูล (จากโค้ดเดิมของคุณ + Mockups) --- */}
      <div className="w-full md:w-3/5 mt-6 md:mt-0 flex flex-col space-y-4">
        
        {/* ชื่อ (จาก game.title) */}
        <h1 className="text-2xl font-semibold text-gray-800">{game.title}</h1>
        
        {/* Mockup รีวิว */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                i < Math.floor(game.rating || 0) ? (
                  <StarSolidIcon key={i} className="h-4 w-4" />
                ) : (
                  <StarIcon key={i} className="h-4 w-4" />
                )
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({game.reviews_count || 0} รีวิว)
            </span>
          
        </div>

        {/* ราคา (จาก game.price) */}
        <div className="bg-gray-50 p-4 rounded-lg flex items-baseline space-x-3">
          <span className="text-gray-500 line-through text-lg">฿{Math.floor(game.price * 1.2)}</span>
          <span className="text-red-600 text-3xl font-bold">฿{game.price}</span>
        </div>

        {/* Mockup ส่วนลด (เหมือนใน Shopee) */}
        <div className="flex items-center space-x-2">
            <span className="text-gray-600">ส่วนลดร้านค้า:</span>
            <span className="text-xs bg-red-100 text-red-600 px-3 py-1">ลด 10%</span>
        </div>

        {/* Mockup ตัวเลือก (สี/แบบ) */}
        {/* <div className="pt-2">
          <span className="font-semibold text-gray-700">สี:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="px-4 py-2 border rounded border-red-500 text-red-600">Black</button>
            <button className="px-4 py-2 border rounded border-gray-300 text-gray-700">Brown</button>
          </div>
        </div> */}

        {/* Mockup จำนวน */}
        <div className="flex items-center space-x-3 pt-2">
          <span className="font-semibold text-gray-700">จำนวน:</span>
          <div className="flex items-center border rounded border-gray-300">
            {/* <button className="px-3 py-1 text-lg text-gray-600">-</button> */}
            <button className="px-3 py-1 text-lg text-gray-600" onClick={() => {HandleCount()}}>
                -
            </button>
            <p className="w-12 text-center border-l border-r" >{count}</p>
            <button className="px-3 py-1 text-lg text-gray-600" onClick={() => setCount(count + 1)}>
                +
            </button>
          </div>
        </div>

        {/* Mockup ปุ่มกด */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <button className="bg-red-100 border border-red-500 text-red-600 px-6 py-3 rounded-md">
            เพิ่มไปยังรถเข็น
          </button>
          <button className="bg-red-500 text-white px-6 py-3 rounded-md">
            ซื้อสินค้า
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* ===== ส่วนที่ 2: รายละเอียดสินค้า (ใช้ข้อมูลที่เหลือจากโค้ดเดิม) ===== */}
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-xl font-bold mb-4">รายละเอียดสินค้า</h2>
    
    {/* นี่คือส่วนข้อมูลเดิมของคุณ */}
    <div className="space-y-3 text-gray-700">
      {/* ใช้ grid เพื่อจัดให้สวยเหมือน Shopee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        <p><span className="font-semibold text-gray-500 w-32 inline-block">ID:</span> {game.id}</p>
        <p><span className="font-semibold text-gray-500 w-32 inline-block">Creater:</span> {game.creater}</p>
        <p><span className="font-semibold text-gray-500 w-32 inline-block">Publisher:</span> {game.publisher}</p>
        <p><span className="font-semibold text-gray-500 w-32 inline-block">Year:</span> {game.year}</p>
        <p><span className="font-semibold text-gray-500 w-32 inline-block">Min Players:</span> {game.min_players}</p>
        <p><span className="font-semibold text-gray-500 w-32 inline-block">Max Players:</span> {game.max_players}</p>
      </div>
      
      <hr className="my-4"/>
      
      <h3 className="font-semibold text-lg">คำอธิบายเกม</h3>
      <p className="whitespace-pre-wrap">{game.description}</p>
    </div>
  </div>

</div>
 </div>
      </div>
  );
};

export default BoardGameDetailPage;
