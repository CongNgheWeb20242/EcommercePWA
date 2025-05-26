import { ShippingStep } from "./ShippingStep";

export type ShippingMapProps = {
    fullRoute: [number, number][];
    shippingSteps: ShippingStep[];
    truckPosition: [number, number];
    isAnimating: boolean;
    isLoadingRoute: boolean;
    bounds: L.LatLngBounds | null;
    onAnimationStart: () => void;
};