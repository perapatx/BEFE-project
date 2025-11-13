import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';

const NewBoardGames = () => {
  // กำหนด State สำหรับจัดการข้อมูล
  const [newGames, setNewGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewGames = async () => {
      try {
        setLoading(true);
        
        // เรียก API เพื่อดึงข้อมูลบอร์ดเกมใหม่
        const response = await fetch('http://localhost:8080/api/v1/boardgames/new');

        if (!response.ok) {
          throw new Error('Failed to fetch new board games');
        }

        const data = await response.json();
        setNewGames(data);
        setError(null);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching new board games:', err);
        
      } finally {
        setLoading(false);
      }
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูล
    fetchNewGames();
  }, []); // [] = dependency array ว่าง = รันครั้งเดียว

  // กรณีกำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="text-center py-8 col-span-full text-gray-600">
          กำลังโหลดบอร์ดเกมใหม่...
        </div>
      </div>
    );
  }

  // กรณีเกิดข้อผิดพลาด
  if (error) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="text-center py-8 col-span-full text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  // กรณีแสดงผลข้อมูลปกติ
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
      {newGames.map((game) => (
        <GameCard 
          key={game.id} 
          game={game} 
        />
      ))}
    </div>
  );
};

export default NewBoardGames;
