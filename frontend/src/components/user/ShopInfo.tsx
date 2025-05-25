import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import CustomImage from "../ui/image";

export default function ShopInfo() {
    return (
        <div className="flex mt-6 items-center bg-white rounded shadow px-6 py-4">
            {/* Logo & Tên shop */}
            <div className="flex items-center gap-4 min-w-[260px]">
                <div className="relative">
                    <CustomImage
                        src="/shop-logo.jpg" //TDOD
                        alt="Kenco.clothing"
                        className="w-16 h-16 rounded-full object-cover border"
                    />
                </div>
                <div>
                    <div className="font-semibold text-base">Kenco.clothing(Kho sỉ Sài gòn)</div>
                    <div className="flex gap-2 mt-2">
                        <button className="bg-red-500 text-white text-xs px-3 py-1 rounded font-semibold flex items-center gap-1 hover:bg-red-600 transition">
                            <FontAwesomeIcon icon={faComments} className="text-sm" />
                            Chat Ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* Thông tin số liệu */}
            <div className="flex-1 flex flex-wrap justify-between ml-8 text-sm">
                <div className="flex flex-col items-start min-w-[100px]">
                    <span className="text-gray-500">Đánh Giá</span>
                    <span className="text-red-500 font-semibold">96k</span>
                </div>
                <div className="flex flex-col items-start min-w-[100px]">
                    <span className="text-gray-500">Tỉ Lệ Phản Hồi</span>
                    <span className="text-red-500 font-semibold">100%</span>
                </div>
                <div className="flex flex-col items-start min-w-[100px]">
                    <span className="text-gray-500">Tham Gia</span>
                    <span className="text-red-500 font-semibold">6 năm trước</span>
                </div>
                <div className="flex flex-col items-start min-w-[100px]">
                    <span className="text-gray-500">Sản Phẩm</span>
                    <span className="text-red-500 font-semibold">294</span>
                </div>
                <div className="flex flex-col items-start min-w-[120px]">
                    <span className="text-gray-500">Thời Gian Phản Hồi</span>
                    <span className="text-red-500 font-semibold">trong vài giờ</span>
                </div>
                <div className="flex flex-col items-start min-w-[120px]">
                    <span className="text-gray-500">Người Theo Dõi</span>
                    <span className="text-red-500 font-semibold">137,2k</span>
                </div>
            </div>
        </div>
    );
}
