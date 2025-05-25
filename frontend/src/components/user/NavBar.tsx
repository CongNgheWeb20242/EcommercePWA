import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from '@/store/userStore';
import LiveSearchBar from './LiveSearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleHomelick = () => {
    navigate('/home');
  };

  const handleCartClick = () => {
    navigate('/user/cart');;
  };

  const handleMenuClick = () => {
    alert('Bạn đã bấm vào nút menu!');
  };

  const handleLoginClick = () => {
    navigate('/user/login');
  };

  const handleRegisterClick = () => {
    navigate('/user/register');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/home');
  };
  
  const handleAdminDashboard = () => {
    navigate('/admin/products');
  };

  return (
    <nav className="flex fixed items-center justify-between w-full px-60 py-4 bg-white shadow-lg shadow-black/20 z-50">
      {/* Logo */}
      <button className="text-lg text-black" onClick={handleHomelick}>
        <div className="text-xl font-bold">NIKESHOP</div>
      </button>


      {/* Menu */}
      <ul className="flex space-x-10 text-sm font-bold">
        <li>
          <Link to="/user/products" className="hover:text-gray-600">
            Tất Cả Sản Phẩm
          </Link>
        </li>
        <li><a href="#" className="hover:text-gray-600">Giày Nam</a></li>
        <li><a href="#" className="hover:text-gray-600">Giày Nữ</a></li>
        <li><a href="#" className="hover:text-gray-600">Giày Trẻ Em</a></li>
      </ul>

      {/* Search and Icons */}
      <div className="flex items-center space-x-10">
        <LiveSearchBar />
        <button 
          className="text-lg text-black" 
          onClick={handleCartClick} 
          aria-label="Giỏ hàng"
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
        <button 
          className="text-lg text-black" 
          onClick={handleMenuClick} 
          aria-label="Menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Login and Register */}
      <ul className="flex space-x-6 text-sm font-bold">
        {user ? (
          <>
            <li className="flex items-center space-x-2">
              {/* Avatar */}
              <span className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold uppercase">
                {user.name.charAt(0)}
              </span>
              {/* Tên người dùng */}
              <span>{user.name}</span>
            </li>
            {user.isAdmin && (
              <li className="flex items-center justify-center">
                <button onClick={handleAdminDashboard} className="hover:text-blue-600">
                  Admin
                </button>
              </li>
            )}
            <li className="flex items-center justify-center">
              <button onClick={handleLogout} className="hover:text-gray-600">
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
    </nav>)
};

export default Navbar