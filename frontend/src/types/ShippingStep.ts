export interface ShippingStep {
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