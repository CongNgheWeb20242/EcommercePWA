import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from '@/store/userStore';
import LiveSearchBar from './LiveSearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

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
        <button className="text-lg text-black" onClick={handleCartClick}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
        <button className="text-lg text-black" onClick={handleMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Login and Register */}
      <ul className="flex space-x-6 text-sm font-bold">
        {user ? (
          <>
            <li className="flex items-center space-x-2">
              {/* Avatar */}
              {/* TODO: thay avatar */}
              {/* {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )} */}
              <span className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold uppercase">
                {user.name.charAt(0)}
              </span>
              {/* Tên người dùng */}
              <span>{user.name}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={() => { }} className="hover:text-gray-600">
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