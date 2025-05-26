const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto grid grid-cols-4 gap-8">
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
            <li className="mb-2 hover:text-gray-400"><a href="#">Giới thiệu về EcommercePWA</a></li>
            <li className="mb-2 hover:text-gray-400"><a href="#">Thời Trang Nam</a></li>
            <li className="mb-2 hover:text-gray-400"><a href="#">Thời Trang Nữ</a></li>
          </ul>
        </div>

        {/* Cột 3: Chính sách công ty */}
        <div>
          <h3 className="text-lg font-bold mb-4">CHÍNH SÁCH CÔNG TY</h3>
          <p>CÔNG TY CP THỜI TRANG EcommercePWA</p>
          <p>Ngõ 347, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</p>
          <p>0774379436</p>
        </div>

        {/* Cột 3: Chính sách công ty */}
        <div>
          <h3 className="text-lg font-bold mb-4">CHÍNH SÁCH CÔNG TY</h3>
          <p>CÔNG TY CP THỜI TRANG EcommercePWA</p>
          <p>Ngõ 347, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</p>
          <p>0774379436</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;