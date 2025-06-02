import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import LiveSearchBar from './LiveSearchBar';
import { userStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import React from 'react';
import useCartStore from '@/store/useCartStore';
import { UserIcon } from '@heroicons/react/24/outline';
import Avatar from '../ui/avatar';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = userStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartIconRefDesktop = React.useRef<HTMLButtonElement>(null);
  const cartIconRefMobile = React.useRef<HTMLButtonElement>(null);
  const { setCartIconRefDesktop, setCartIconRefMobile, clearCart } = useCartStore();

  useEffect(() => {
    if (cartIconRefDesktop.current) {
      setCartIconRefDesktop(cartIconRefDesktop);
    }

    if (cartIconRefMobile.current) {
      setCartIconRefMobile(cartIconRefMobile);
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

  const handleProfileClick = () => {
    navigate('/user/profile');
  };

  const handleLoginClick = () => {
    navigate('/user/login');
  };

  const handleRegisterClick = () => {
    navigate('/user/register');
  };

  const handleLogoutClick = () => {
    clearCart();
    logOut();
    navigate('/user/login');
  };

  return (
    <nav className="flex fixed items-center justify-between w-full px-4 md:px-8 lg:px-40 py-4 bg-white shadow-lg shadow-black/20 z-50">
      {/* Logo */}
      <button className="text-lg text-black" onClick={handleHomelick}>
        <div className="text-xl font-bold">EcommercePWA</div>
      </button>

      {/* Desktop Menu - Hidden on mobile */}
      <ul className="hidden lg:flex space-x-10 text-sm font-bold">
        <li>
          <Link to="/user/products" className="hover:text-gray-600">
            Tất Cả Sản Phẩm
          </Link>
        </li>
        <li>
          <Link to="/user/products/men" className="hover:text-gray-600">
            Thời Trang Nam
          </Link>
        </li>
        <li>
          <Link to="/user/products/women" className="hover:text-gray-600">
            Thời Trang Nữ
          </Link>
        </li>
      </ul>

      {/* Desktop Search and Icons - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
        <LiveSearchBar />
        <button className="text-lg text-black" ref={cartIconRefDesktop} onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      </div>

      {/* Desktop Login/Register - Hidden on mobile */}
      <ul className="hidden lg:flex space-x-6 text-sm font-bold">
        {user ? (
          <>
            <li className="flex items-center space-x-2">
              <span className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold uppercase"
                onClick={handleProfileClick}>
                {(user && user.profilePic) ?
                  <Avatar
                    src={user.profilePic}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border"
                  /> :
                  <UserIcon className="w-6 h-6 text-white-600" />
                }
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
        <button className="text-lg text-black md:hidden" ref={cartIconRefMobile} onClick={handleCartClick}>
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
        <div className="fixed inset-0 top-[50px] bg-white z-40 lg:hidden">
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
                <Link
                  to="/user/products/men"
                  className="block py-2 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Thời Trang Nam
                </Link>
              </li>
              <li>
                <Link
                  to="/user/products/women"
                  className="block py-2 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Thời Trang Nữ
                </Link>
              </li>
            </ul>

            {/* Mobile Login/Register */}
            <ul className="flex flex-col px-4 py-4 space-y-4 text-sm font-bold">
              {user ? (
                <>
                  <li className="flex items-center space-x-2 py-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold uppercase"
                      onClick={handleProfileClick}>
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