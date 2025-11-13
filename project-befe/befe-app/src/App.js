import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

// Pages
import HomePage from './pages/HomePage';
import BoardGameListPage from './pages/BoardGameListPage';
import BookDetailPage from './pages/BookDetailPage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AddBookPage from './pages/AddBookPage';
import BooklistAdmin from './pages/BooklistAdmin';
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
        <Route path="/store-manager/add-book" element={<AddBookPage />} />
        <Route path='/store-manager/booklist' element={<BooklistAdmin/>}/>
        {/* {/ ✅ Routes ที่มี Navbar/Footer /} */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
           <Route path="/games" element={<BoardGameListPage />} /> 
          <Route path="/games/:id" element={<BookDetailPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;