import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import shopIcon from "../../assets/common/shop_logo.png";
import CustomImage from "../ui/image";

export default function ShopInfo() {
    return (
        <div className="flex flex-col md:flex-row items-center bg-white rounded shadow px-4 py-4 gap-6">
            {/* Logo & Tên shop */}
            <div className="flex items-center gap-4 min-w-[200px] justify-center md:justify-start">
                <div className="relative">
                    <CustomImage
                        src={shopIcon}
                        alt="EcommercePWA"
                        className="w-16 h-16 rounded-full object-cover border"
                    />
                </div>
                <div className="text-center md:text-left">
                    <div className="font-semibold text-base">EcommercePWA</div>
                    <div className="flex gap-2 mt-2 justify-center md:justify-start">
                        <button className="bg-red-500 text-white text-xs px-3 py-1 rounded font-semibold flex items-center gap-1 hover:bg-red-600 transition">
                            <FontAwesomeIcon icon={faComments} className="text-sm" />
                            Chat Ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* Thông tin số liệu */}
            <div className="flex-1 mt-4 md:mt-0">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center md:items-start min-w-[100px]">
                        <span className="text-gray-500">Đánh Giá</span>
                        <span className="text-red-500 font-semibold">96k</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start min-w-[100px]">
                        <span className="text-gray-500">Tỉ Lệ Phản Hồi</span>
                        <span className="text-red-500 font-semibold">100%</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start min-w-[100px]">
                        <span className="text-gray-500">Tham Gia</span>
                        <span className="text-red-500 font-semibold">6 năm trước</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start min-w-[100px]">
                        <span className="text-gray-500">Sản Phẩm</span>
                        <span className="text-red-500 font-semibold">294</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start min-w-[120px]">
                        <span className="text-gray-500">Phản Hồi</span>
                        <span className="text-red-500 font-semibold">trong vài giờ</span>
                    </div>
                    <div className="flex flex-col items-center md:items-start min-w-[120px]">
                        <span className="text-gray-500">Người Theo Dõi</span>
                        <span className="text-red-500 font-semibold">137,2k</span>
                    </div>
                </div>
            </div>
        </div>


    );
}
