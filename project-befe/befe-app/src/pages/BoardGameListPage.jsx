import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllBoardGames } from '../data/boardGamesData'; // แก้เป็นข้อมูลบอร์ดเกม
import GameCard from '../components/GameCard';
const BoardGameListPage = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;
  
  const categories = [
    'all', 'strategy', 'family', 'party', 'co-op', 'card', 'dice', 'abstract'
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const gamesData = getAllBoardGames();
      setGames(gamesData);
      setFilteredGames(gamesData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = games.filter(game => 
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(filtered);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game => 
        game.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredGames(filtered);
    }
    setCurrentPage(1);
  };

  const handleSort = (sortValue) => {
    setSortBy(sortValue);
    const sorted = [...filteredGames];
    switch (sortValue) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => b.id - a.id);
    }
    setFilteredGames(sorted);
  };

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">บอร์ดเกมทั้งหมด</h1>
          <p className="text-gray-600">ค้นหาบอร์ดเกมที่คุณชื่นชอบจากคอลเล็กชันของเรา</p>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-viridian-500 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="all">ทุกหมวดหมู่</option>
              <option value="strategy">กลยุทธ์</option>
              <option value="family">สำหรับครอบครัว</option>
              <option value="party">ปาร์ตี้</option>
              <option value="co-op">ร่วมมือ</option>
              <option value="card">การ์ด</option>
              <option value="dice">ลูกเต๋า</option>
              <option value="abstract">นามธรรม</option>
            </select>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-viridian-500 cursor-pointer"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="price-low">ราคาต่ำ-สูง</option>
              <option value="price-high">ราคาสูง-ต่ำ</option>
              <option value="popular">ยอดนิยม</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            พบบอร์ดเกม {filteredGames.length} เกม
            {selectedCategory !== 'all' && ` ในหมวด ${selectedCategory}`}
          </div>
        </div>
        
        {/* Games Grid */}
        {currentGames.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบบอร์ดเกมที่ค้นหา</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg 
                  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                ก่อนหน้า
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNumber = index + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) pageNumber = currentPage - 2 + index;
                  if (currentPage > totalPages - 3) pageNumber = totalPages - 4 + index;
                }
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <button 
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-viridian-600 text-white' 
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg 
                  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                ถัดไป
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardGameListPage;
