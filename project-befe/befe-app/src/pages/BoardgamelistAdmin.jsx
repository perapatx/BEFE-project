import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilAltIcon, TrashIcon, LogoutIcon } from '@heroicons/react/outline';

const BoardgamelistAdmin = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/store-manager/add-boardgame'); // Redirect to login if not authenticated
      return;
    }

    fetchGames();
  }, [navigate]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://127.0.0.1:8080/api/v1/boardgames');
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลบอร์ดเกมได้');
      const data = await res.json();
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm('คุณแน่ใจว่าจะลบบอร์ดเกมนี้?')) return;
  //   try {
  //     const res = await fetch(`/api/v1/boardgames/${id}`, { method: 'DELETE' });
  //     if (!res.ok) throw new Error('ลบบอร์ดเกมไม่สำเร็จ');
  //     setGames(prev => prev.filter(game => game.id !== id));
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-400 via-red-500 to-red-400 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Board Game Paradise - Admin</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/store-manager/add-boardgame')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
            >
              <PlusIcon className="h-5 w-5" /> เพิ่มบอร์ดเกม
            </button>
            <button
              onClick={() => { localStorage.removeItem('isAdminAuthenticated'); navigate('/login'); }}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
            >
              <LogoutIcon className="h-5 w-5" /> ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">ชื่อเกม</th>
                  <th className="px-6 py-3 text-left">ผู้สร้าง</th>
                  <th className="px-6 py-3 text-left">ผู้จัดจำหน่าย</th>
                  <th className="px-6 py-3 text-left">หมวดหมู่</th>
                  <th className="px-6 py-3 text-left">ปี</th>
                  <th className="px-6 py-3 text-left">ราคา</th>
                  <th className="px-6 py-3 text-left">สต็อก</th>
                  <th className="px-6 py-3 text-left">ผู้เล่น</th>
                  <th className="px-6 py-3 text-left">ภาษา</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{game.id}</td>
                    <td className="px-6 py-3">{game.title}</td>
                    <td className="px-6 py-3">{game.creater}</td>
                    <td className="px-6 py-3">{game.publisher}</td>
                    <td className="px-6 py-3">{game.category}</td>
                    <td className="px-6 py-3">{game.year}</td>
                    <td className="px-6 py-3">{game.price.toLocaleString()} บาท</td>
                    <td className="px-6 py-3">{game.stock}</td>
                    <td className="px-6 py-3">{game.min_players} - {game.max_players}</td>
                    <td className="px-6 py-3">{game.language}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-boardgame/${game.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                      >
                        <PencilAltIcon className="h-4 w-4" /> แก้ไข
                      </button>
                      <button
                        // onClick={() => handleDelete(game.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                      >
                        <TrashIcon className="h-4 w-4" /> ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardgamelistAdmin;
