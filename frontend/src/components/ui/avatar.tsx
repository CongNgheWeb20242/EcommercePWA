import React, { useState } from "react";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const Avatar: React.FC<AvatarProps> = ({
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
        onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setLoading(false);
        setError(true);
        onError?.(e);
    };

    return (
        <div className={`relative overflow-hidden w-full h-full ${className || ""}`}>
            {loading && !error && (
                <div className="skeleton-shimmer absolute inset-0" />
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
                className={`
                    w-full h-full 
                    object-cover 
                    transition-opacity duration-300 
                    ${loading ? "opacity-0" : "opacity-100"}
                    ${className?.includes('rounded-') ? '' : 'rounded-inherit'}
                `}
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};

export default Avatar;
