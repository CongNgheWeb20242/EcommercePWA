import { clusterRouteIntoHubs } from '@/lib/routeUtils';
import { ShippingStep } from '@/types/ShippingStep';
import { useState, useEffect, useRef } from 'react';
import ShippingHeader from './ShippingHeader';
import ShippingTimeline from './ShippingTimeline';
import ShippingMap from './ShippingMap';
import L from 'leaflet';


const ORS_API_KEY = '5b3ce3597851110001cf62483cc278a7cf7d45e297e6151f1c4ba9d5';

const ShippingPage: React.FC = () => {
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [fullRoute, setFullRoute] = useState<[number, number][]>([]);
    const [shippingSteps, setShippingSteps] = useState<ShippingStep[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [truckPosition, setTruckPosition] = useState<[number, number]>([10.7500, 106.6667]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [_shouldStartAnimation, setShouldStartAnimation] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const animationRef = useRef<NodeJS.Timeout>(null);

    const startPoint = { lat: 21.0285, lng: 105.8542, name: 'Hà Nội' };
    const endPoint = { lat: 10.7500, lng: 106.6667, name: 'Địa chỉ nhận hàng' };

    const animateTruckAndTimeline = () => {
        if (fullRoute.length === 0 || isAnimating) return;

        setIsAnimating(true);
        const totalSteps = fullRoute.length;
        const startTime = Date.now();

        const moveStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / 4000, 1);

            const targetIndex = Math.floor(progress * (totalSteps - 1));

            if (targetIndex < totalSteps) {
                setTruckPosition(fullRoute[targetIndex]);

                const timelineProgress = Math.floor(progress * 4);
                setShippingSteps(prev =>
                    prev.map((step, idx) => ({
                        ...step,
                        completed: idx < timelineProgress,
                        current: idx === timelineProgress,
                        animationActive: idx === timelineProgress
                    }))
                );

                if (progress < 1) {
                    animationRef.current = setTimeout(moveStep, 50);
                } else {
                    setIsAnimating(false);
                    setTruckPosition([endPoint.lat, endPoint.lng]);
                    setShippingSteps(prev =>
                        prev.map(step => ({
                            ...step,
                            completed: true,
                            current: step.id === 4,
                            animationActive: false
                        }))
                    );
                }
            }
        };

        moveStep();
    };

    const fetchRouteAndCreateHubs = async () => {
        setIsLoadingRoute(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${startPoint.lng},${startPoint.lat}&end=${endPoint.lng},${endPoint.lat}&format=geojson`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            const data = await response.json();
            const routeCoordinates: [number, number][] = data.features[0].geometry.coordinates
                .map((coord: [number, number]) => [coord[1], coord[0]]);

            const segments = clusterRouteIntoHubs(routeCoordinates);
            const steps: ShippingStep[] = [];

            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                const response = await fetch(
                    `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${segment.representativePoint[1]}&point.lat=${segment.representativePoint[0]}&layers=locality`
                );
                const data = await response.json();
                const locationName = data.features?.[0]?.properties?.label || 'Unknown';

                steps.push({
                    id: i + 1,
                    title: `Điểm tập kết ${i + 1}`,
                    description: `Đã qua khu vực này (${segment.distance}km)`,
                    location: locationName,
                    coordinates: segment.representativePoint,
                    completed: false,
                    current: false,
                    animationActive: false,
                    timestamp: new Date(Date.now() + i * 8 * 60 * 60 * 1000).toLocaleString('vi-VN')
                });
            }

            steps.push({
                id: 4,
                title: "Đơn hàng đã đến tay bạn",
                description: "Giao hàng thành công",
                location: endPoint.name,
                coordinates: [endPoint.lat, endPoint.lng],
                completed: false,
                current: false,
                animationActive: false,
                timestamp: new Date().toLocaleString('vi-VN')
            });

            setFullRoute(routeCoordinates);
            setShippingSteps(steps);
            setShouldStartAnimation(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            console.error('Error:', err);
        } finally {
            setIsLoadingRoute(false);
        }
    };

    const handleConfirmDelivery = () => {
        if (isLoadingRoute || isAnimating) return;
        setIsConfirmed(true);
    };

    useEffect(() => {
        fetchRouteAndCreateHubs();
    }, []);

    useEffect(() => {
        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, []);

    const calculateMapBounds = (): L.LatLngBounds | null => {
        if (shippingSteps.length === 0) return null;
        const bounds = new L.LatLngBounds(shippingSteps.map(step => step.coordinates));
        return bounds.pad(0.1);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <ShippingHeader
                startPoint={startPoint}
                endPoint={endPoint}
                isLoadingRoute={isLoadingRoute}
                isAnimating={isAnimating}
            />

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">⚠️ {error}</p>
                    <p className="text-red-600 text-sm">Đang sử dụng dữ liệu demo</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ShippingTimeline
                    steps={shippingSteps}
                    isAnimating={isAnimating}
                    isLoadingRoute={isLoadingRoute}
                    isConfirmed={isConfirmed}
                    onConfirm={handleConfirmDelivery}
                />

                <ShippingMap
                    fullRoute={fullRoute}
                    shippingSteps={shippingSteps}
                    truckPosition={truckPosition}
                    isAnimating={isAnimating}
                    isLoadingRoute={isLoadingRoute}
                    bounds={calculateMapBounds()}
                    onAnimationStart={animateTruckAndTimeline}
                />
            </div>
        </div>
    );
};

export default ShippingPage;
