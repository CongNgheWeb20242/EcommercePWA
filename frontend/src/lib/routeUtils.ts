import { RouteSegment } from '@/types/RouteSegment';

export const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371;
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const clusterRouteIntoHubs = (route: [number, number][]): RouteSegment[] => {
    if (route.length < 4) return [];

    const segments: RouteSegment[] = [];
    const segmentSize = Math.floor(route.length / 3);

    for (let i = 0; i < 3; i++) {
        const startIndex = i * segmentSize;
        const endIndex = i === 2 ? route.length - 1 : (i + 1) * segmentSize;

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
