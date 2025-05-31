import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TruckIcon from "@/assets/common/truck.png";
import MarkerIcon from "@/assets/common/marker.png";
import CheckIcon from "@/assets/common/v_icon.png";
import useCheckoutStore from '@/store/useCheckOutStore';

// Fix cho icon marker của Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const truckIcon = new L.Icon({
    iconUrl: TruckIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const hubIcon = new L.Icon({
    iconUrl: MarkerIcon,
    iconSize: [24, 40],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const deliveredIcon = new L.Icon({
    iconUrl: CheckIcon,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
});

// Thay YOUR_API_KEY bằng API key thực tế của bạn
const ORS_API_KEY = '';

interface ShippingStep {
    id: number;
    title: string;
    description: string;
    location: string;
    coordinates: [number, number];
    completed: boolean;
    current: boolean;
    animationActive: boolean;
    timestamp?: string;
}

interface RouteSegment {
    startIndex: number;
    endIndex: number;
    representativePoint: [number, number];
    distance: number;
}

// Component để auto-fit map bounds một lần
const MapInitializer: React.FC<{
    bounds: L.LatLngBounds | null;
    onInitialized: () => void;
}> = ({ bounds, onInitialized }) => {
    const map = useMap();
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (bounds && !hasInitialized) {
            map.fitBounds(bounds, {
                padding: [80, 80],
                maxZoom: 10
            });

            setHasInitialized(true);

            setTimeout(() => {
                onInitialized();
            }, 1500);
        }
    }, [bounds, map, hasInitialized, onInitialized]);

    return null;
};

const ShippingPage: React.FC = () => {
    const { goToNextStep } = useCheckoutStore();

    const [_currentStepIndex, setCurrentStepIndex] = useState(3); // Điều chỉnh theo 3 điểm tập kết + 1 điểm cuối
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [fullRoute, setFullRoute] = useState<[number, number][]>([]);
    const [shippingSteps, setShippingSteps] = useState<ShippingStep[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [truckPosition, setTruckPosition] = useState<[number, number]>([10.7500, 106.6667]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldStartAnimation, setShouldStartAnimation] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
    const animationRef = useRef<NodeJS.Timeout>(null);

    // Điểm đầu và cuối
    const startPoint = { lat: 21.0285, lng: 105.8542, name: 'Hà Nội' };
    const endPoint = { lat: 10.7500, lng: 106.6667, name: 'Địa chỉ nhận hàng' };

    // Cấu hình animation - cố định thời gian tổng là 4 giây (4 steps * 1 giây mỗi step)
    const TOTAL_ANIMATION_DURATION = 4000; // 4 giây cho 4 steps

    // Hàm tính khoảng cách giữa 2 điểm (Haversine formula)
    const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
        const R = 6371;
        const dLat = (point2[0] - point1[0]) * Math.PI / 180;
        const dLon = (point2[1] - point1[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Hàm chia route thành 3 clusters/segments (thay vì 5)
    const clusterRouteIntoHubs = (route: [number, number][]): RouteSegment[] => {
        if (route.length < 4) return []; // Cần ít nhất 4 điểm cho 3 segments

        const segments: RouteSegment[] = [];
        const segmentSize = Math.floor(route.length / 3); // Chia thành 3 phần

        for (let i = 0; i < 3; i++) { // Chỉ 3 điểm tập kết
            const startIndex = i * segmentSize;
            const endIndex = i === 2 ? route.length - 1 : (i + 1) * segmentSize; // i === 2 cho segment cuối

            const middleIndex = Math.floor((startIndex + endIndex) / 2);
            const representativePoint = route[middleIndex];

            let distance = 0;
            for (let j = startIndex; j < endIndex; j++) {
                distance += calculateDistance(route[j], route[j + 1]);
            }

            segments.push({
                startIndex,
                endIndex,
                representativePoint,
                distance: Math.round(distance)
            });
        }

        return segments;
    };

    // Hàm reverse geocoding đơn giản để lấy tên địa điểm
    const getLocationName = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${lng}&point.lat=${lat}&layers=locality`
            );
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                return data.features[0].properties.label || `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
            }
            return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
        } catch (error) {
            console.error('Geocoding error:', error);
            return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
        }
    };

    // Animation xe di chuyển và timeline steps
    const animateTruckAndTimeline = () => {
        if (fullRoute.length === 0 || isAnimating) return;

        console.log(`Bắt đầu animation với ${fullRoute.length} điểm`);
        setIsAnimating(true);
        setCurrentAnimationStep(0);

        // Reset trạng thái animation của tất cả steps
        setShippingSteps(prevSteps =>
            prevSteps.map(step => ({
                ...step,
                animationActive: false,
                completed: false,
                current: false
            }))
        );

        const totalSteps = fullRoute.length;

        const startTime = Date.now();

        const moveStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / TOTAL_ANIMATION_DURATION, 1);

            const targetIndex = Math.floor(progress * (totalSteps - 1));

            if (targetIndex < totalSteps) {
                setTruckPosition(fullRoute[targetIndex]);

                // Tính toán step hiện tại trong timeline (0-3 cho 4 steps)
                const timelineProgress = Math.floor(progress * 4); // 4 steps total (3 hub + 1 final)

                if (timelineProgress !== currentAnimationStep) {
                    setCurrentAnimationStep(timelineProgress);

                    // Cập nhật trạng thái các steps
                    setShippingSteps(prevSteps =>
                        prevSteps.map((step, index) => ({
                            ...step,
                            completed: index < timelineProgress,
                            current: index === timelineProgress,
                            animationActive: index === timelineProgress
                        }))
                    );
                }

                if (progress < 1) {
                    animationRef.current = setTimeout(moveStep, 50);
                } else {
                    // Animation hoàn thành
                    setIsAnimating(false);
                    setTruckPosition([endPoint.lat, endPoint.lng]);
                    setCurrentAnimationStep(4);

                    // Đặt trạng thái cuối cùng cho timeline
                    setShippingSteps(prevSteps =>
                        prevSteps.map(step => ({
                            ...step,
                            completed: true,
                            current: step.id === 4, // Step cuối (id = 4)
                            animationActive: false
                        }))
                    );

                    console.log('Animation hoàn thành');
                }
            }
        };

        moveStep();
    };

    // Hàm lấy tuyến đường từ API và tạo điểm tập kết
    const fetchRouteAndCreateHubs = async () => {
        setIsLoadingRoute(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${startPoint.lng},${startPoint.lat}&end=${endPoint.lng},${endPoint.lat}&format=geojson`
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.features || !data.features[0] || !data.features[0].geometry) {
                throw new Error('Invalid route data');
            }

            const routeCoordinates: [number, number][] = data.features[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]]
            );

            console.log(`Đã lấy ${routeCoordinates.length} điểm từ API`);
            setFullRoute(routeCoordinates);

            const segments = clusterRouteIntoHubs(routeCoordinates);
            console.log('Route segments:', segments);

            const steps: ShippingStep[] = [];

            // Tạo 3 điểm tập kết thay vì 5
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                const locationName = await getLocationName(
                    segment.representativePoint[0],
                    segment.representativePoint[1]
                );

                steps.push({
                    id: i + 1,
                    title: `Điểm tập kết ${i + 1}`,
                    description: `Đơn hàng đã qua khu vực này (${segment.distance}km từ điểm trước)`,
                    location: locationName,
                    coordinates: segment.representativePoint,
                    completed: false,
                    current: false,
                    animationActive: false,
                    timestamp: `${new Date(Date.now() + i * 8 * 60 * 60 * 1000).toLocaleDateString('vi-VN')} ${(8 + i * 4).toString().padStart(2, '0')}:00`
                });
            }

            // Thêm điểm cuối
            steps.push({
                id: 4,
                title: "Đơn hàng đã đến tay bạn",
                description: "Đơn hàng đã được giao thành công",
                location: endPoint.name,
                coordinates: [endPoint.lat, endPoint.lng],
                completed: false,
                current: false,
                animationActive: false,
                timestamp: "28/05/2025 15:30"
            });

            setShippingSteps(steps);
            setCurrentStepIndex(0);
            setShouldStartAnimation(true);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(`Lỗi khi tải tuyến đường: ${errorMessage}`);
            console.error('Route API error:', err);
            createDemoSteps();
        } finally {
            setIsLoadingRoute(false);
        }
    };

    // Hàm tạo dữ liệu demo khi API lỗi (3 điểm tập kết)
    const createDemoSteps = () => {
        const demoSteps: ShippingStep[] = [
            {
                id: 1,
                title: "Điểm tập kết 1",
                description: "Đơn hàng đã được tiếp nhận và xử lý",
                location: "Hà Nội",
                coordinates: [21.0285, 105.8542],
                completed: false,
                current: false,
                animationActive: false,
                timestamp: "26/05/2025 08:30"
            },
            {
                id: 2,
                title: "Điểm tập kết 2",
                description: "Đơn hàng đã đến khu vực miền Trung",
                location: "Đà Nẵng",
                coordinates: [16.0471, 108.2068],
                completed: false,
                current: false,
                animationActive: false,
                timestamp: "27/05/2025 10:45"
            },
            {
                id: 3,
                title: "Điểm tập kết 3",
                description: "Đơn hàng đã đến kho phân phối cuối",
                location: "TP. Hồ Chí Minh",
                coordinates: [10.7769, 106.7009],
                completed: false,
                current: false,
                animationActive: false,
                timestamp: "28/05/2025 09:00"
            },
            {
                id: 4,
                title: "Đơn hàng đã đến tay bạn",
                description: "Đơn hàng đã được giao thành công",
                location: "Địa chỉ nhận hàng",
                coordinates: [10.7500, 106.6667],
                completed: false,
                current: false,
                animationActive: false,
                timestamp: "28/05/2025 15:30"
            }
        ];

        setShippingSteps(demoSteps);

        const demoRoute = demoSteps.map(step => step.coordinates);
        setFullRoute(demoRoute);
        setShouldStartAnimation(true);
    };

    // Xử lý xác nhận nhận hàng - vô hiệu hóa khi đang load API hoặc đang animation
    const handleConfirmDelivery = () => {
        if (isAnimating || isLoadingRoute) return; // Thêm điều kiện isLoadingRoute

        setIsConfirmed(true);
        console.log('Đã xác nhận nhận hàng thành công!');

        goToNextStep()
    };

    // Load route khi component mount
    useEffect(() => {
        fetchRouteAndCreateHubs();
    }, []);

    // Cleanup animation
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    // Tính toán bounds để hiển thị tất cả điểm với padding đủ lớn
    const calculateMapBounds = (): L.LatLngBounds | null => {
        if (shippingSteps.length === 0) return null;

        const bounds = new L.LatLngBounds([]);
        shippingSteps.forEach(step => {
            bounds.extend(step.coordinates);
        });

        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        const latDiff = (northEast.lat - southWest.lat) * 0.1;
        const lngDiff = (northEast.lng - southWest.lng) * 0.1;

        const expandedBounds = new L.LatLngBounds([
            [southWest.lat - latDiff, southWest.lng - lngDiff],
            [northEast.lat + latDiff, northEast.lng + lngDiff]
        ]);

        return expandedBounds;
    };

    const mapBounds = calculateMapBounds();

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            {/* Header với z-index điều chỉnh */}
            <div className="mb-6 relative z-20"> {/* Giảm từ z-50 xuống z-20 */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🚚 Theo dõi vận chuyển đơn hàng
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                    <p><strong>Mã đơn hàng:</strong> #DH123456789</p>
                    <p><strong>Từ:</strong> {startPoint.name}</p>
                    <p><strong>Đến:</strong> {endPoint.name}</p>
                    <div className="flex items-center gap-2">
                        {isLoadingRoute ? (
                            <span className="text-blue-600 font-semibold">
                                ⏳ Đang tải tuyến đường...
                            </span>
                        ) : isAnimating ? (
                            <span className="text-blue-600 font-semibold">
                                🚛 Đang mô phỏng vận chuyển...
                            </span>
                        ) : (
                            <span className="text-green-600 font-semibold">✅ Đã giao thành công</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading và Error */}
            {isLoadingRoute && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-800">Đang tải tuyến đường thực tế từ API...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 relative z-30">
                    <p className="text-red-800">⚠️ {error}</p>
                    <p className="text-red-600 text-sm mt-1">Đang sử dụng dữ liệu demo thay thế.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-lg p-6 relative z-30">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        📍 Lịch trình vận chuyển (3 điểm tập kết)
                        {isAnimating && (
                            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                                Đang mô phỏng
                            </span>
                        )}
                    </h2>

                    {/* Vertical Timeline với animation */}
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-300 before:via-blue-400 before:to-gray-300">
                        {shippingSteps.map((step) => (
                            <div key={step.id} className="relative flex items-start gap-4">
                                <div className={`
                                    relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 transition-all duration-500
                                    ${step.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : step.animationActive
                                            ? 'bg-blue-500 border-blue-500 text-white animate-pulse shadow-lg scale-110'
                                            : 'bg-gray-300 border-gray-300 text-gray-600'
                                    }
                                `}>
                                    {step.completed ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : step.animationActive ? (
                                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                                    ) : (
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    )}
                                </div>

                                <div className={`
                                    flex-1 pb-6 transition-all duration-500
                                    ${step.animationActive ? 'transform scale-105' : ''}
                                `}>
                                    <div className={`
                                        p-4 rounded-lg border-l-4 transition-all duration-500
                                        ${step.completed
                                            ? 'bg-green-50 border-green-400'
                                            : step.animationActive
                                                ? 'bg-blue-50 border-blue-400 shadow-lg'
                                                : 'bg-gray-50 border-gray-300'
                                        }
                                    `}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`
                                                font-semibold text-lg transition-colors duration-300
                                                ${step.completed
                                                    ? 'text-green-800'
                                                    : step.animationActive
                                                        ? 'text-blue-800'
                                                        : 'text-gray-600'
                                                }
                                            `}>
                                                {step.title}
                                            </h3>
                                            {step.completed && (
                                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Hoàn thành
                                                </span>
                                            )}
                                            {step.animationActive && (
                                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                                    Đang xử lý
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-2">{step.description}</p>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>📍 {step.location}</span>
                                            <span>🕒 {step.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút xác nhận nhận hàng - disabled khi đang load API hoặc animation */}
                    {!isConfirmed && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleConfirmDelivery}
                                disabled={isAnimating || isLoadingRoute} // Thêm isLoadingRoute
                                className={`
                                    px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 mx-auto
                                    ${(isAnimating || isLoadingRoute)
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                    }
                                `}
                            >
                                {(isAnimating || isLoadingRoute) ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        {isLoadingRoute ? 'Đang tải...' : 'Đang xử lý...'}
                                    </>
                                ) : (
                                    <>
                                        ✅ Xác nhận đã nhận hàng
                                    </>
                                )}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">
                                {isLoadingRoute
                                    ? 'Vui lòng đợi tải dữ liệu tuyến đường'
                                    : isAnimating
                                        ? 'Vui lòng đợi hoàn thành mô phỏng vận chuyển'
                                        : 'Nhấn để xác nhận bạn đã nhận được đơn hàng'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Bản đồ */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden relative z-10">
                    <div className="p-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            🗺️ Hành trình vận chuyển
                        </h2>
                        <p className="text-gray-600">
                            {isLoadingRoute ?
                                'Đang tải tuyến đường từ API...' :
                                isAnimating ?
                                    'Đang mô phỏng quá trình vận chuyển...' :
                                    'Đơn hàng đã được giao thành công - Bạn có thể zoom/di chuyển bản đồ'
                            }
                        </p>
                    </div>

                    <div style={{ height: '500px', width: '100%' }} className="relative z-0">
                        <MapContainer
                            center={[16, 106]}
                            zoom={6}
                            style={{ height: '100%', width: '100%', zIndex: 1 }}
                            zoomSnap={0.1}
                            maxZoom={15}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />

                            <MapInitializer
                                bounds={mapBounds}
                                onInitialized={() => {
                                    if (shouldStartAnimation) {
                                        setShouldStartAnimation(false);
                                        animateTruckAndTimeline();
                                    }
                                }}
                            />

                            {/* Tuyến đường thực tế từ API */}
                            {fullRoute.length > 0 && (
                                <Polyline
                                    positions={fullRoute}
                                    color="blue"
                                    weight={4}
                                    opacity={0.6}
                                />
                            )}

                            {/* Markers cho 3 điểm tập kết */}
                            {shippingSteps.slice(0, -1).map((step) => (
                                <Marker
                                    key={step.id}
                                    position={step.coordinates}
                                    icon={hubIcon}
                                >
                                    <Popup>
                                        <div>
                                            <strong>{step.title}</strong><br />
                                            📍 {step.location}<br />
                                            🕒 {step.timestamp}<br />
                                            {step.completed ? '✅ Đã hoàn thành' :
                                                step.animationActive ? '🔄 Đang xử lý' : '⏳ Chờ xử lý'}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Marker điểm giao hàng */}
                            {shippingSteps.length > 0 && (
                                <Marker
                                    position={[endPoint.lat, endPoint.lng]}
                                    icon={deliveredIcon}
                                >
                                    <Popup>
                                        <div>
                                            <strong>🏠 Điểm giao hàng</strong><br />
                                            📍 {endPoint.name}<br />
                                            🕒 28/05/2025 15:30<br />
                                            {shippingSteps[shippingSteps.length - 1]?.completed ?
                                                '✅ Đã giao thành công' :
                                                shippingSteps[shippingSteps.length - 1]?.animationActive ?
                                                    '🔄 Đang giao hàng' : '⏳ Chờ giao hàng'
                                            }
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {/* Xe tải đang di chuyển */}
                            <Marker position={truckPosition} icon={truckIcon}>
                                <Popup>
                                    <div>
                                        <strong>🚚 Xe vận chuyển</strong><br />
                                        {isAnimating ? 'Đang di chuyển...' : 'Đã hoàn thành giao hàng'}<br />
                                        Trạng thái: {isAnimating ? 'Vận chuyển' : 'Đã giao'}
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
