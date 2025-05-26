import { ShippingStep } from "./ShippingStep";

export type ShippingTimelineProps = {
    steps: ShippingStep[];
    isAnimating: boolean;
    isLoadingRoute: boolean;
    isConfirmed: boolean;
    onConfirm: () => void;
};