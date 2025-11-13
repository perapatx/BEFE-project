import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Flame, Star, Sparkles } from "lucide-react";
import NewBoardGames from "../components/NewBoardGames";
import FeaturedBoardGames from "../components/FeaturedBoardGames";


const HomePage = () => {
  const [games, setGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/v1/boardgames`);
        if (!response.ok) throw new Error("Failed to fetch games");
        const data = await response.json();
        setGames(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGames();
  }, []);

  const addToCart = (game) => {
    if (!cart.find((item) => item.id === game.id)) {
      setCart([...cart, game]);
    }
  };

  const categories = [
    { key: "popular", icon: <Star size={24} />, label: "ยอดฮิต" },
    { key: "new", icon: <Sparkles size={24} />, label: "มาใหม่" },
    { key: "strategy", icon: <Flame size={24} />, label: "กลยุทธ์" },
    { key: "family", icon: <ShoppingCart size={24} />, label: "ครอบครัว" },
  ];

  const filteredGames = games.filter((g) => g.category === selectedCategory);

  return (
    <div className="min-h-screen bg-red-50 text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-b from-red-600 to-red-400 text-white">
        <h1 className="text-4xl font-bold mb-2">มีปาร์ตี้ ต้องมีบอร์ดเกม</h1>
        <p className="text-lg">รวมมิตรบอร์ดเกม</p>
      </section>


      {/* NewBoardGames */}
<section className="py-16 bg-red-50">
  <div className="container mx-auto px-4">
    <div className="relative mb-12 text-center">
      {/* หัวข้อ */}
      <h2 className="relative text-3xl font-bold z-10 px-6 py-4 inline-block text-red-900 drop-shadow-sm">
        New Arrived
      </h2>
      {/* แถบเหลืองมีมิติ */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 h-full rounded-xl shadow-md -z-0"></div>
    </div>

    <NewBoardGames />
  </div>
</section>

{/* FeaturedBoardGames */}
<section className="py-16 bg-red-50">
  <div className="container mx-auto px-4">
    <div className="relative mb-12 text-center">
      <h2 className="relative text-3xl font-bold z-10 px-6 py-4 inline-block text-red-900 drop-shadow-sm">
        HOT Hit!!
      </h2>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 h-full rounded-xl shadow-md -z-0"></div>
    </div>

    <FeaturedBoardGames />
  </div>
</section>


      {/* Game Cards */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={game.image}
              alt={game.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{game.title}</h3>
              <p className="text-gray-600 text-sm">{game.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="font-semibold text-red-600">฿{game.price}</span>
                <button
                  onClick={() => addToCart(game)}
                  className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-700"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Cart Preview */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-700 text-white p-4 shadow-lg flex justify-between items-center">
          <span>🛒 {cart.length} รายการในตะกร้า</span>
          <Link
            to="/cartpage"
            className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold"
          >
            ดูตะกร้า
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
