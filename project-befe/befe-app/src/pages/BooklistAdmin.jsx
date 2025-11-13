import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilAltIcon, TrashIcon, LogoutIcon } from '@heroicons/react/outline';

const BooklistAdmin = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/store-manager/add-book'); // Redirect to login if not authenticated
      return;
    }

    fetchBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/books');
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลหนังสือได้');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

//   const handleDelete = async (id) => {
//     if (!window.confirm('คุณแน่ใจว่าจะลบหนังสือเล่มนี้?')) return;

//     try {
//       const res = await fetch(/api/v1/books/${id}, { method: 'DELETE' });
//       if (!res.ok) throw new Error('ลบหนังสือไม่สำเร็จ');
//       setBooks(prev => prev.filter(book => book.id !== id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-viridian-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">BookStore - BackOffice</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/store-manager/add-book')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
            >
              <PlusIcon className="h-5 w-5" /> เพิ่มหนังสือ
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
              <thead className="bg-viridian-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">ชื่อหนังสือ</th>
                  <th className="px-6 py-3 text-left">ผู้แต่ง</th>
                  <th className="px-6 py-3 text-left">ISBN</th>
                  <th className="px-6 py-3 text-left">ปี</th>
                  <th className="px-6 py-3 text-left">ราคา</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{book.id}</td>
                    <td className="px-6 py-3">{book.title}</td>
                    <td className="px-6 py-3">{book.author}</td>
                    <td className="px-6 py-3">{book.isbn}</td>
                    <td className="px-6 py-3">{book.year}</td>
                    <td className="px-6 py-3">{book.price.toLocaleString()} บาท</td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => navigate(/edit-book/)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                      >
                        <PencilAltIcon className="h-4 w-4" /> แก้ไข
                      </button>
                      <button
                        // onClick={() => handleDelete(book.id)}
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

export default BooklistAdmin;