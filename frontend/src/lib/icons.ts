import L from 'leaflet';

export const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995476.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

export const hubIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2902/2902134.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

export const deliveredIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2343/2343627.png',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
});
