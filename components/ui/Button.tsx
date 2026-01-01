import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'correct' | 'locked' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {

        const variants = {
            primary: "bg-duo-green-face border-duo-green-side text-white active:border-b-0",
            correct: "bg-duo-green-face border-duo-green-side text-white active:border-b-0",
            secondary: "bg-duo-blue-face border-duo-blue-side text-white active:border-b-0",
            danger: "bg-duo-red-face border-duo-red-side text-white active:border-b-0",
            ghost: "bg-transparent border-transparent text-duo-blue-face shadow-none border-b-0 top-0 active:bg-duo-gray-face/20",
            locked: "bg-duo-gray-face border-duo-gray-side text-duo-gray-side cursor-not-allowed",
            outline: "bg-white border-duo-gray-side text-duo-text active:border-b-0 hover:bg-gray-50",
        };

        const baseStyles = "btn-3d relative inline-flex items-center justify-center font-bold tracking-wide border-b-4 rounded-xl active:translate-y-[4px]";

        const sizeStyles = {
            sm: "h-10 px-4 text-sm",
            md: "h-12 px-6 text-base",
            lg: "h-14 px-8 text-lg",
            icon: "h-12 w-12 p-0",
        };

        // Helper for specific variant styles
        const getVariantStyle = (v: string) => {
            if (v === 'outline') return "bg-white border-2 border-b-4 border-duo-gray-side text-duo-text active:border-b-0";
            return variants[v as keyof typeof variants] || variants.primary;
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    getVariantStyle(variant),
                    sizeStyles[size],
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
