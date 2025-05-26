import React, { useEffect, useRef } from "react";
import CustomImage from "../ui/image";

interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface FlyImageProps {
    src: string;
    start: Position;
    end: Position;
}

const FlyImage: React.FC<FlyImageProps> = ({ src, start, end }) => {
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        // Reset trạng thái
        img.style.transition = "none";
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
        img.style.left = `${start.x}px`;
        img.style.top = `${start.y}px`;
        img.style.width = `${start.w}px`;
        img.style.height = `${start.h}px`;


        requestAnimationFrame(() => {
            // Thiết lập transition
            img.style.transition = `
      all 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55),
      opacity 1.2s ease-out,
      transform 1.2s ease-out
    `;

            // Thiết lập vị trí đích
            img.style.left = `${end.x}px`;
            img.style.top = `${end.y}px`;
            img.style.width = `${end.w}px`;
            img.style.height = `${end.h}px`;
            img.style.opacity = "0.5";
            img.style.transform = `scale(0.4) rotate(${Math.random() * 20 - 10}deg)`;


        });

        return () => {
            img.style.transition = "none";
        };
    }, [start, end]);


    return (
        <div ref={imgRef} style={{
            position: "fixed",
            zIndex: 9999,
            pointerEvents: "none",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
            <CustomImage
                src={src}
                className="object-cover w-full h-full"
            />
        </div>
    );
};

export default FlyImage;
