const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Cột 1: Nhà phân phối độc quyền */}
        <div>
          <h3 className="text-lg font-bold mb-4">NHÀ PHÂN PHỐI ĐỘC QUYỀN</h3>
          <p>CÔNG TY CP THỜI TRANG EcommercePWA</p>
          <p>Ngõ 347, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</p>
          <p>0774379436</p>
        </div>

        {/* Cột 2: Danh mục nổi bật */}
        <div>
          <h3 className="text-lg font-bold mb-4">DANH MỤC NỔI BẬT</h3>
          <ul>
            <li className="mb-2 hover:text-gray-400 transition">
              <a href="#">Giới thiệu về EcommercePWA</a>
            </li>
            <li className="mb-2 hover:text-gray-400 transition">
              <a href="#">Thời Trang Nam</a>
            </li>
            <li className="mb-2 hover:text-gray-400 transition">
              <a href="#">Thời Trang Nữ</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chính sách công ty */}
        <div>
          <h3 className="text-lg font-bold mb-4">CHÍNH SÁCH CÔNG TY</h3>
          <ul>
            <li className="mb-2 hover:text-gray-400 transition">
              <a href="#">Chính sách bảo mật</a>
            </li>
            <li className="mb-2 hover:text-gray-400 transition">
              <a href="#">Chính sách đổi trả</a>
            </li>
            <li className="mb-2 hover:text-gray-400 transition">
              <a href="#">Chính sách vận chuyển</a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Kết nối & hỗ trợ */}
        <div>
          <h3 className="text-lg font-bold mb-4">KẾT NỐI & HỖ TRỢ</h3>
          <p>Email: support@ecommercepwa.vn</p>
          <p>Hotline: 0774379436</p>
          <div className="flex gap-4 mt-3">
            <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-400 transition"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Zalo" className="hover:text-blue-300 transition"><i className="icon-zalo"></i></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm mt-8">
        &copy; {new Date().getFullYear()} EcommercePWA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
