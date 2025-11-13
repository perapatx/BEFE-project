import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';

const FeaturedBoardGames = () => {
  // กำหนด State สำหรับจัดการข้อมูล
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
        // เรียก API เพื่อดึงข้อมูลบอร์ดเกมทั้งหมด
        const response = await fetch('http://localhost:8080/api/v1/boardgames');

        if (!response.ok) {
          throw new Error('Failed to fetch board games');
        }

        const data = await response.json();

        // สุ่มบอร์ดเกม 5 เกมมาเป็น "แนะนำ"
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);

        setFeaturedGames(selected);
        setError(null);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching board games:', err);
        
      } finally {
        setLoading(false);
      }
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูล
    fetchGames();
  }, []); // [] = dependency array ว่าง = รันครั้งเดียว

  // กรณีกำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="text-center py-8 col-span-full text-gray-600">
          กำลังโหลดบอร์ดเกมแนะนำ...
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
      {featuredGames.map((game) => (
        <GameCard 
          key={game.id} 
          game={game} 
        />
      ))}
    </div>
  );
};

export default FeaturedBoardGames;
