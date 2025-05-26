export type ShippingHeaderProps = {
    startPoint: { name: string };
    endPoint: { name: string };
    isLoadingRoute: boolean;
    isAnimating: boolean;
};