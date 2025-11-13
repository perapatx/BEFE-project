import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCartIcon, SearchIcon, UserIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 bg-red-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">🎲</span>
            </div>
            <span className="text-2xl font-bold tracking-wide">
              Board Game Paradise
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { to: '/', label: 'หน้าแรก' },
              { to: '/games', label: 'บอร์ดเกม' },
              // { to: '/categories', label: 'หมวดหมู่' },
              { to: '/about', label: 'เกี่ยวกับเรา' },
              { to: '/contact', label: 'ติดต่อ' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `font-medium transition-colors ${
                    isActive
                      ? 'text-yellow-300 border-b-2 border-yellow-300'
                      : 'hover:text-yellow-200'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 hover:text-yellow-200 transition-colors">
              <SearchIcon className="h-6 w-6" />
            </button> */}

            <button className="relative p-2 hover:text-yellow-200 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs 
                  rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* <button className="p-2 hover:text-yellow-200 transition-colors">
              <UserIcon className="h-6 w-6" />
            </button> */}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:text-yellow-200 transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="py-4 border-t border-red-400 bg-red-700">
            {[
              { to: '/', label: 'หน้าแรก' },
              { to: '/games', label: 'บอร์ดเกม' },
              { to: '/categories', label: 'หมวดหมู่' },
              { to: '/about', label: 'เกี่ยวกับเรา' },
              { to: '/contact', label: 'ติดต่อ' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="block py-2 px-2 hover:text-yellow-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
