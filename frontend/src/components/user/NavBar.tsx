import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import LiveSearchBar from './LiveSearchBar';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import React from 'react';
import useCartStore from '@/store/useCartStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartIconRef = React.useRef<HTMLButtonElement>(null);
  const setCartIconRef = useCartStore((state) => state.setCartIconRef);

  useEffect(() => {
    if (cartIconRef.current) {
      setCartIconRef(cartIconRef);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleHomelick = () => {
    navigate('/home');
  };

  const handleCartClick = () => {
    navigate('/user/cart');;
  };

  const handleLoginClick = () => {
    navigate('/user/login');
  };

  const handleRegisterClick = () => {
    navigate('/user/register');
  };

  const handleLogoutClick = () => {
    logOut();
    navigate('/user/login');
  };

  return (
    <nav className="flex fixed items-center justify-between w-full px-4 md:px-8 lg:px-60 py-4 bg-white shadow-lg shadow-black/20 z-50">
      {/* Logo */}
      <button className="text-lg text-black" onClick={handleHomelick}>
        <div className="text-xl font-bold">NIKESHOP</div>
      </button>

      {/* Desktop Menu - Hidden on mobile */}
      <ul className="hidden lg:flex space-x-10 text-sm font-bold">
        <li>
          <Link to="/user/products" className="hover:text-gray-600">
            Tất Cả Sản Phẩm
          </Link>
        </li>
        <li><a href="#" className="hover:text-gray-600">Giày Nam</a></li>
        <li><a href="#" className="hover:text-gray-600">Giày Nữ</a></li>
        <li><a href="#" className="hover:text-gray-600">Giày Trẻ Em</a></li>
      </ul>

      {/* Desktop Search and Icons - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
        <LiveSearchBar />
        <button className="text-lg text-black" ref={cartIconRef} onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>

      {/* Desktop Login/Register - Hidden on mobile */}
      <ul className="hidden lg:flex space-x-6 text-sm font-bold">
        {user ? (
          <>
            <li className="flex items-center space-x-2">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold uppercase">
                {user.name.charAt(0)}
              </span>
              <span>{user.name}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={handleLogoutClick} className="hover:text-gray-600">
                Đăng xuất
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button onClick={handleLoginClick} className="hover:text-gray-600">
                Đăng nhập
              </button>
            </li>
            <li>
              <button onClick={handleRegisterClick} className="hover:text-gray-600">
                Đăng ký
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Mobile Icons - Cart and Hamburger */}
      <div className="flex items-center space-x-4 lg:hidden">
        {/* Mobile Cart Icon */}
        <button className="text-lg text-black md:hidden" onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>

        {/* Hamburger Menu Button */}
        <button
          className="text-xl text-black"
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-white z-40 lg:hidden">
          <div className="flex flex-col h-full">
            {/* Mobile Search */}
            <div className="px-4 py-4 border-b md:hidden">
              <LiveSearchBar />
            </div>

            {/* Mobile Navigation Links */}
            <ul className="flex flex-col px-4 py-4 space-y-4 text-sm font-bold border-b">
              <li>
                <Link
                  to="/user/products"
                  className="block py-2 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tất Cả Sản Phẩm
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giày Nam
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giày Nữ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giày Trẻ Em
                </a>
              </li>
            </ul>

            {/* Mobile Login/Register */}
            <ul className="flex flex-col px-4 py-4 space-y-4 text-sm font-bold">
              {user ? (
                <>
                  <li className="flex items-center space-x-2 py-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold uppercase">
                      {user.name.charAt(0)}
                    </span>
                    <span>{user.name}</span>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogoutClick()
                      }}
                      className="block py-2 hover:text-gray-600"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLoginClick();
                      }}
                      className="block py-2 hover:text-gray-600"
                    >
                      Đăng nhập
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleRegisterClick();
                      }}
                      className="block py-2 hover:text-gray-600"
                    >
                      Đăng ký
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
};

export default Navbar