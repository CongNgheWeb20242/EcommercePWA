import Banner from '@/components/user/Banner';
import NikeCollection from '@/components/user/Collection';
import ChatWidget from '@/services/chat-bot/components/ChatWidget';


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