import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-[#FFD046] text-black hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        secondary: 'bg-white text-black hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        accent: 'bg-[#A3FFAC] text-black hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        danger: 'bg-[#FF90E8] text-black hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-3 font-bold',
        lg: 'px-8 py-4 text-xl font-black',
    };

    return (
        <button
            className={cn(
                'border-2 border-black transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};

export default Button;
