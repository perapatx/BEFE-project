import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

// Pages
import HomePage from './pages/HomePage';
import BoardGameListPage from './pages/BoardGameListPage';
import BoardGameDetailPage from './pages/BoardGameDetailPage';
import EditBoardGamePage from './pages/EditBoardGamePage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AddBoardGamePage from './pages/AddBoardGamePage';
import BoardgamelistAdmin from './pages/BoardgamelistAdmin';
import CartPage from './pages/CartPage';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* {/ ✅ Routes ที่ไม่มี Navbar/Footer /} */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/store-manager/add-BoardGame" element={<AddBoardGamePage />} />
        <Route path='/store-manager/boardgamelist' element={<BoardgamelistAdmin/>}/>
        <Route path='/store-manager/edit-boardgame/:id' element={<EditBoardGamePage/>}/>
        {/* {/ ✅ Routes ที่มี Navbar/Footer /} */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
           <Route path="/games" element={<BoardGameListPage />} /> 
          <Route path="/games/:id" element={<BoardGameDetailPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;