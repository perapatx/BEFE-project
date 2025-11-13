import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mockup data 3 รายการ
  const mockData = [
    {
      id: 1,
      title: 'Catan',
      publisher: 'Kosmos',
      min_players: 3,
      max_players: 4,
      price: 1200,
      quantity: 1
    },
    {
      id: 2,
      title: 'Ticket to Ride',
      publisher: 'Days of Wonder',
      min_players: 2,
      max_players: 5,
      price: 1500,
      quantity: 2
    },
    {
      id: 3,
      title: 'Pandemic',
      publisher: 'Z-Man Games',
      min_players: 2,
      max_players: 4,
      price: 1300,
      quantity: 1
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setCartItems(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">ตะกร้าสินค้า</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">ตะกร้าว่าง</p>
            <Link to="/games" className="text-blue-600 hover:underline">
              ← กลับไปเลือกบอร์ดเกม
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-gray-600">Publisher: {item.publisher}</p>
                    <p className="text-gray-600">Players: {item.min_players}-{item.max_players}</p>
                    <p className="text-gray-600">Price: ฿{item.price} x {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <span className="text-xl font-bold">รวมทั้งหมด:</span>
              <span className="text-xl font-bold">฿{totalPrice}</span>
            </div>

            <div className="mt-6 text-right">
              <button className="px-6 py-3 bg-viridian-600 text-white rounded-lg hover:bg-viridian-700">
                ชำระเงิน
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
