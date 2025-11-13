import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const BoardGameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-red-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/games" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Board Game List
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
          <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
            <p><span className="font-semibold">ID:</span> {game.id}</p>
            <p><span className="font-semibold">Creater:</span> {game.creater}</p>
            <p><span className="font-semibold">Publisher:</span> {game.publisher}</p>
            <p><span className="font-semibold">Year:</span> {game.year}</p>
            <p><span className="font-semibold">Price:</span> ฿{game.price}</p>
            <p><span className="font-semibold">Min Players:</span> {game.min_players}</p>
            <p><span className="font-semibold">Max Players:</span> {game.max_players}</p>
            <p><span className="font-semibold">Description:</span> {game.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardGameDetailPage;
