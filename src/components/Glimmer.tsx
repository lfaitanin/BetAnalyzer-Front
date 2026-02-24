import React from 'react';

interface GlimmerProps {
    children?: React.ReactNode;
    className?: string;
    duration?: number;
}

export const Glimmer: React.FC<GlimmerProps> = ({
    children,
    className = '',
}) => {
    return (
        <div
            className={`relative overflow-hidden ${className}`}
        >
            {/* Glimmer overlay */}
            <div
                className="absolute inset-0 -translate-x-full animate-glimmer pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                }}
            />
            {children}
        </div>
    );
};
