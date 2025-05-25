import { useState, useEffect, useRef, useCallback } from "react";
import Card from "../../components/user/ProductCard";
import { useProductStore } from "@/store/useProductStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSliders, faSpinner } from "@fortawesome/free-solid-svg-icons";
import SidebarFilter from "@/components/user/SidebarFilter";
import SortByDropdown from "../../components/user/SortByDropdown";

interface ProductsProps {
    searchText: string;
}

export default function Products({ searchText }: ProductsProps) {
    const [showFilters, setShowFilters] = useState(false);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const { products, loading, error, fetchProducts, currentPage, setCurrentPage, pages } = useProductStore();
    const pageSize = 12;

    // Reset khi searchText thay đổi
    useEffect(() => {
        setCurrentPage(1);
        fetchProducts({ page: 1, pageSize });
    }, [searchText]); //TDOD: 

    // Infinite scroll: gọi khi loaderRef xuất hiện trong viewport
    const loadMore = useCallback(async () => {
        if (pages === null) return;
        if (loading || !(pages > currentPage)) return;
        const nextPage = currentPage + 1;
        fetchProducts({
            page: nextPage,
            append: true,
        });
        setCurrentPage(nextPage);
    }, [currentPage, pages, loading, fetchProducts]);

    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && (pages == null || pages > currentPage) && !loading) {
                    loadMore();
                }
            },
            { threshold: 1 }
        );
        observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loaderRef, (pages == null || pages > currentPage), loading, loadMore]);

    // Sidebar width khi mở
    const SIDEBAR_WIDTH = 280;

    return (
        <div className="w-full min-h-screen bg-gray-50 transition-all duration-300">
            <div
                className="grid transition-all duration-300"
                style={{
                    gridTemplateColumns: showFilters
                        ? `${SIDEBAR_WIDTH}px 1fr`
                        : `0px 1fr`,
                }}
            >
                <SidebarFilter show={showFilters} onClose={() => setShowFilters(false)} />
                <main className="w-full transition-all duration-300">
                    <div className="flex sticky top-20 items-center justify-between mb-6 bg-white z-10 px-4 py-5">
                        <h2 className="text-2xl font-semibold">{searchText}</h2>
                        <div className="flex items-center gap-4">
                            <button
                                className="flex items-center gap-2 border px-3 py-1 rounded hover:bg-gray-100"
                                onClick={() => setShowFilters((v) => !v)}
                            >
                                {showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                                <FontAwesomeIcon icon={faSliders} className="text-base" />
                            </button>
                            <SortByDropdown />
                        </div>
                    </div>
                    <div className="mx-auto pt-0 pb-8 px-4">
                        {loading && currentPage === 1 ? (
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
                                    <div className="skeleton-shimmer w-full h-full rounded-full"></div>
                                </div>
                                <div className="text-lg text-red-500 font-semibold mb-2">
                                    Lỗi: {error}
                                </div>
                                <div className="text-gray-500">Vui lòng thử lại hoặc liên hệ quản trị viên.</div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <Card key={product._id} product={product} />
                                    ))}
                                </div>
                                <div ref={loaderRef} className="flex justify-center items-center py-8">
                                    {(pages == null || pages > currentPage) && (
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                            Đang tải thêm sản phẩm...
                                        </span>
                                    )}
                                    {!(pages! > currentPage) && (
                                        <span className="text-gray-400 text-sm">
                                            🎉 Bạn đã xem hết tất cả sản phẩm!
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
