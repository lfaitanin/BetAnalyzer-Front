import React from 'react';
import { Glimmer } from './Glimmer';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
}) => {
    const baseStyles = "bg-white/5 backdrop-blur-sm border border-white/5";

    const variantStyles = {
        rectangular: "rounded-xl",
        circular: "rounded-full",
        text: "rounded-md",
    };

    const style = {
        width: width,
        height: height,
    };

    return (
        <Glimmer className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
            <div style={style} className="w-full h-full" />
        </Glimmer>
    );
};
