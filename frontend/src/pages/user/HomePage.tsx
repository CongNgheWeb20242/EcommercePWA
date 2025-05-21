import logo from '../../assets/common/logo.png';
import home_bg from '../../assets/common/home_bg.jpg';
import NikeCollection from '@/components/user/Collection';

const Banner = () => (
    <div className="relative bg-black text-white h-[600px] flex items-center justify-between px-30">
      {/* Left Content */}
      <div className="z-30">
        <img
          src={logo}
          alt="Jordan Logo"
          className="h-[300px] w-auto"
        />
      </div>
  
      {/* Right Content */}
      <div className="text-center z-20 w-[600px]">
        <h2 className="text-xl uppercase font-bold mb-4">Air Jordan I</h2>
        <h1 className="text-7xl uppercase font-extrabold leading-tight">The One That Started It All</h1>
      </div>

  
      {/* Background Image */}
      <img
        src={home_bg}
        alt="Air Jordan I"
        className="absolute top-1/6 left-1/2 transform -translate-x-1/2 w-auto object-cover h-[70%] z-10"
      />
    </div>
  );


  const Features = () => (
    <div className="grid grid-cols-4 gap-6 text-center py-8 bg-white h-[400px]">
      {/* Feature 1 */}
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold text-xl">Miễn phí vận chuyển</p>
        <p className="text-lg">Cho đơn hàng từ 800k</p>
      </div>
  
      {/* Feature 2 */}
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold text-xl">Bảo hành 6 tháng</p>
        <p className="text-lg">15 ngày đổi trả</p>
      </div>
  
      {/* Feature 3 */}
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold text-xl">Thanh toán COD</p>
        <p className="text-lg">Yên tâm mua sắm</p>
      </div>
  
      {/* Feature 4 */}
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold text-xl">Hotline: 07743xxxx</p>
        <p className="text-lg">Hỗ trợ bạn 24/7</p>
      </div>
    </div>
  );
  
  

  const HomePage = () => {
    return (
        <div>
            {/* Navbar */}
            <Banner />
      
            {/* Banner Section */}
            <Features />

            {/* Collection Section */}
            <NikeCollection />
        </div>
    )
  }

export default HomePage