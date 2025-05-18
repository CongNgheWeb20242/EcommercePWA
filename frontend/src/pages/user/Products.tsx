import { useState, useEffect } from "react";
import Card from "../../components/user/ProductCard";
import { useProductStore } from "@/store/useProductStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSliders } from "@fortawesome/free-solid-svg-icons";
import SidebarFilter from "@/components/user/SidebarFilter";


interface ProductsProps {
    searchText: string;
}

export default function Products({ searchText }: ProductsProps) {
    const [showFilters, setShowFilters] = useState(false);
    const { products, loading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts({
            page: 1,
            pageSize: 12,
        });
    }, []);

    // Sidebar width khi mở
    const SIDEBAR_WIDTH = 280;

    return (
        <div
            className={`w-full min-h-screen bg-gray-50 transition-all duration-300`}
        >
            <div
                className={`grid transition-all duration-300`}
                style={{
                    gridTemplateColumns: showFilters
                        ? `${SIDEBAR_WIDTH}px 1fr`
                        : `0px 1fr`,
                }}
            >
                {/* Sidebar */}
                <SidebarFilter show={showFilters} onClose={() => setShowFilters(false)} />

                {/* Main Content */}
                <main className="w-full transition-all duration-300">
                    <div className="mx-auto py-8 px-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">{searchText}</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    className="flex items-center gap-2 border px-3 py-1 rounded hover:bg-gray-100"
                                    onClick={() => setShowFilters((v) => !v)}
                                >
                                    {showFilters ? "Hide Filters" : "Show Filters"}
                                    <FontAwesomeIcon icon={faSliders} className="text-base" />
                                </button>
                                <button className="flex items-center gap-2 border px-3 py-1 rounded hover:bg-gray-100">
                                    Sort By
                                    <FontAwesomeIcon icon={faChevronDown} className="text-base" />
                                </button>
                            </div>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(16)].map((_, idx) => (
                                    <div key={idx} className="bg-white rounded-lg shadow">
                                        <div className="skeleton-shimmer w-full h-56 mb-4 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="skeleton-shimmer h-4 w-1/4 rounded"></div>
                                            <div className="skeleton-shimmer h-6 w-3/4 rounded"></div>
                                            <div className="skeleton-shimmer h-3 w-full rounded"></div>
                                            <div className="skeleton-shimmer h-5 w-1/3 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-32 h-32 mb-4">
                                    {/* Hình ảnh lỗi shimmer hoặc SVG lỗi */}
                                    <div className="skeleton-shimmer w-full h-full rounded-full"></div>
                                </div>
                                <div className="text-lg text-red-500 font-semibold mb-2">
                                    Lỗi: {error}
                                </div>
                                <div className="text-gray-500">Vui lòng thử lại hoặc liên hệ quản trị viên.</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <Card key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
