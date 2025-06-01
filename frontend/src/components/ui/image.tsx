import React, { useState } from "react";

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const CustomImage: React.FC<CustomImageProps> = ({
    src,
    alt,
    className,
    onLoad,
    onError,
    ...rest
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setLoading(false);
        if (onLoad) onLoad(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setLoading(false);
        setError(true);
        if (onError) onError(e);
    };

    return (
        <div className={`relative ${className || ""}`}>
            {loading && !error && (
                <div className="skeleton-shimmer w-full h-full"></div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Error</span>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                {...rest}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"
                    }`}
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};

export default CustomImage;
