import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { ShippingStep } from '@/types/ShippingStep';
import { MapInitializerProps } from '@/types/MapInitializer';
import { ShippingMapProps } from '@/types/ShippingMap';
import { deliveredIcon, hubIcon, truckIcon } from '@/lib/icons';

const MapInitializer: React.FC<MapInitializerProps> = ({ bounds, onInitialized }) => {
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

const ShippingMap: React.FC<ShippingMapProps> = ({
    fullRoute,
    shippingSteps,
    truckPosition,
    isAnimating,
    isLoadingRoute,
    bounds,
    onAnimationStart
}) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative z-10">
            <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    🗺️ Hành trình vận chuyển
                </h2>
                <p className="text-gray-600">
                    {isLoadingRoute
                        ? 'Đang tải tuyến đường từ API...'
                        : isAnimating
                            ? 'Đang mô phỏng quá trình vận chuyển...'
                            : 'Đơn hàng đã được giao thành công - Bạn có thể zoom/di chuyển bản đồ'
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

                    <MapInitializer bounds={bounds} onInitialized={onAnimationStart} />

                    {fullRoute.length > 0 && (
                        <Polyline
                            positions={fullRoute}
                            color="blue"
                            weight={4}
                            opacity={0.6}
                        />
                    )}

                    {shippingSteps.slice(0, -1).map((step: ShippingStep) => (
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

                    {shippingSteps.length > 0 && (
                        <Marker
                            position={shippingSteps[shippingSteps.length - 1].coordinates}
                            icon={deliveredIcon}
                        >
                            <Popup>
                                <div>
                                    <strong>🏠 Điểm giao hàng</strong><br />
                                    📍 {shippingSteps[shippingSteps.length - 1].location}<br />
                                    🕒 {shippingSteps[shippingSteps.length - 1].timestamp}<br />
                                    {shippingSteps[shippingSteps.length - 1].completed
                                        ? '✅ Đã giao thành công'
                                        : '⏳ Chờ giao hàng'}
                                </div>
                            </Popup>
                        </Marker>
                    )}

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
    );
};

export default ShippingMap;
