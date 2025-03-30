import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleHomelick = () => {
        navigate('/user/home'); 
    };
    const handleSearchClick = () => {
        alert('Bạn đã bấm vào nút tìm kiếm!');
    };
    
    const handleCartClick = () => {
        alert('Bạn đã bấm vào nút giỏ hàng!');
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
      <li><a href="#" className="hover:text-gray-600">Tất Cả Sản Phẩm</a></li>
      <li><a href="#" className="hover:text-gray-600">Giày Nam</a></li>
      <li><a href="#" className="hover:text-gray-600">Giày Nữ</a></li>
      <li><a href="#" className="hover:text-gray-600">Giày Trẻ Em</a></li>
    </ul>

    {/* Search and Icons */}
    <div className="flex items-center space-x-10">
      <input
        type="text"
        placeholder="Tìm Kiếm Sản Phẩm...       "
        className="border-2 rounded-md px-4 py-3 text-sm focus:outline-none"
      />
      <button className="text-lg text-black" onClick={handleSearchClick}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <button className="text-lg text-black" onClick={handleCartClick}>
        <FontAwesomeIcon icon={faShoppingCart} />
      </button>
      <button className="text-lg text-black" onClick={handleMenuClick}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>

    {/* Login and Register */}
    <ul className="flex space-x-6 text-sm font-bold">
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
    </ul>
  </nav>)
};

export default Navbar