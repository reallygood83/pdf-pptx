import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'white' | 'yellow' | 'green' | 'pink';
}

const Card = ({ children, className, variant = 'white' }: CardProps) => {
    const variants = {
        white: 'bg-white',
        yellow: 'bg-[#FFD046]',
        green: 'bg-[#A3FFAC]',
        pink: 'bg-[#FF90E8]',
    };

    return (
        <div className={cn(
            'border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
            variants[variant],
            className
        )}>
            {children}
        </div>
    );
};

export default Card;
