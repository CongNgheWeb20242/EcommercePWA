// ShippingPage.tsx
import { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY = "AIzaSyDRYczTDT6kSz-bWGrLGh6WCaBgUSL-1Dk";

function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const [truckPosition, setTruckPosition] = useState<google.maps.LatLng>();

    // Khởi tạo Directions Service và Renderer
    useEffect(() => {
        if (!routesLibrary || !map) return;

        const directionsService = new routesLibrary.DirectionsService();
        const directionsRenderer = new routesLibrary.DirectionsRenderer({
            map,
            suppressMarkers: true
        });

        // Lấy thông tin tuyến đường
        directionsService.route({
            origin: '100 Front St, Toronto, ON', // Điểm xuất phát
            destination: '500 College St, Toronto, ON', // Điểm đến
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        }, (response, status) => {
            if (status === 'OK' && response) {
                console.log('Tuyến đường:', response);
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            }
        });

        // Animation xe tải
        let step = 0;
        const animateTruck = () => {
            if (!routes[routeIndex]?.overview_path) return;

            setTruckPosition(routes[routeIndex].overview_path[step]);
            step = (step + 1) % routes[routeIndex].overview_path.length;
            requestAnimationFrame(animateTruck);
        };

        animateTruck();

        return () => directionsRenderer.setMap(null);
    }, [routesLibrary, map, routeIndex]);

    if (!routes.length) return null;

    return (
        <div className="directions-controls">
            <h2>{routes[routeIndex].summary}</h2>

            {/* Hiển thị các tuyến đường thay thế */}
            <ul>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <button
                            onClick={() => setRouteIndex(index)}
                            className={index === routeIndex ? 'active' : ''}
                        >
                            {route.summary}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Marker xe tải */}
            {truckPosition && (
                <Marker
                    position={truckPosition}
                    icon={{
                        url: 'https://cdn-icons-png.flaticon.com/512/1995/1995476.png',
                        scaledSize: new google.maps.Size(40, 40)
                    }}
                />
            )}
        </div>
    );
}

export default function ShippingPage() {
    return (
        <APIProvider apiKey={API_KEY}>
            <div style={{ height: '100vh', width: '100%' }}>
                <Map
                    // mapId={process.env.NEXT_PUBLIC_MAP_ID}
                    defaultCenter={{ lat: 43.6532, lng: -79.3832 }}
                    defaultZoom={12}
                >
                    <Directions />
                </Map>
            </div>
        </APIProvider>
    );
}
