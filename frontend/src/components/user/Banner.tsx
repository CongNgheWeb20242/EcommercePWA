import { useEffect, useRef, useState } from "react";
import bg_1 from '../../assets/common/bg_1.jpg';
import bg_2 from '../../assets/common/bg_2.jpg';
import bg_3 from '../../assets/common/bg_3.jpg';

const banners = [
    {
        image: bg_1,
        title: "Bộ Sưu Tập Mới 2025",
        slogan: "Khám phá phong cách thời trang hiện đại",
    },
    {
        image: bg_2,
        title: "Ưu Đãi Đặc Biệt",
        slogan: "Giảm giá lên đến 50% cho mọi sản phẩm",
    },
    {
        image: bg_3,
        title: "Thời Trang Nam & Nữ",
        slogan: "Nâng tầm phong cách, tự tin mỗi ngày",
    },
];

const Banner = () => {
    const [current, setCurrent] = useState(0);
    const slideRef = useRef<HTMLDivElement>(null);

    // Tự động chuyển banner mỗi 4 giây
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative bg-black text-white h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
            {/* Slides container */}
            <div
                ref={slideRef}
                className="flex transition-transform duration-700 h-full"
                style={{
                    width: `${banners.length * 100}%`,
                    transform: `translateX(-${current * (100 / banners.length)}%)`,
                }}
            >
                {banners.map((banner, idx) => (
                    <div
                        key={idx}
                        className="relative flex-shrink-0 h-full"
                        style={{ width: `${100 / banners.length}%` }}
                    >
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                        {/* Content */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-4 text-center">
                            <div className="max-w-4xl w-full">
                                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">
                                    {banner.title}
                                </h2>
                                <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white drop-shadow-lg">
                                    {banner.slogan}
                                </h1>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;
