import logo from '../../assets/common/logo.png';
import home_bg from '../../assets/common/home_bg.jpg';
import NikeCollection from '@/components/user/Collection';
import ChatWidget from '@/services/chat-bot/components/ChatWidget';

const Banner = () => (
  <div className="relative bg-black text-white h-[200px] md:h-[600px] overflow-hidden">
    {/* Background Image */}
    <img
      src={home_bg}
      alt="Air Jordan I"
      className="absolute inset-0 w-full h-full object-contain z-10 md:w-auto md:h-[70%] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/60 md:bg-black/30 z-20"></div>

    {/* Content Container */}
    <div className="relative z-30 h-full flex flex-col justify-end md:justify-center pb-4 md:pb-0 px-4 md:px-10 lg:px-20">
      {/* Mobile: Content ở dưới cùng */}
      <div className="md:flex md:flex-row md:items-center md:justify-between">
        {/* Left Content (Logo) */}
        <div className="mb-2 md:mb-0 flex-shrink-0">
          <img
            src={logo}
            alt="Jordan Logo"
            className="h-20 w-auto md:h-[200px] lg:h-[300px]"
          />
        </div>

        {/* Right Content (Text) */}
        <div className="text-left md:text-center md:w-[380px] lg:w-[600px]">
          <h2 className="text-base md:text-xl uppercase font-bold mb-1 md:mb-4">Air Jordan I</h2>
          <h1 className="text-2xl md:text-6xl lg:text-7xl uppercase font-extrabold leading-tight">
            The One That Started It All
          </h1>
        </div>
      </div>
    </div>
  </div>
);




const Features = () => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center py-6 md:py-8 bg-white h-auto md:h-[400px] px-4">
    {/* Feature 1 */}
    <div className="flex flex-col justify-center items-center p-4">
      <p className="font-bold text-base md:text-xl">Miễn phí vận chuyển</p>
      <p className="text-sm md:text-lg">Cho đơn hàng từ 800k</p>
    </div>
    {/* Feature 2 */}
    <div className="flex flex-col justify-center items-center p-4">
      <p className="font-bold text-base md:text-xl">Bảo hành 6 tháng</p>
      <p className="text-sm md:text-lg">15 ngày đổi trả</p>
    </div>
    {/* Feature 3 */}
    <div className="flex flex-col justify-center items-center p-4">
      <p className="font-bold text-base md:text-xl">Thanh toán COD</p>
      <p className="text-sm md:text-lg">Yên tâm mua sắm</p>
    </div>
    {/* Feature 4 */}
    <div className="flex flex-col justify-center items-center p-4">
      <p className="font-bold text-base md:text-xl">Hotline: 07743xxxx</p>
      <p className="text-sm md:text-lg">Hỗ trợ bạn 24/7</p>
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
      <ChatWidget />
    </div>
  )
}

export default HomePage