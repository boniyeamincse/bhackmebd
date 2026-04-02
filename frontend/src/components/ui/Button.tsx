import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
}

const variants = {
  primary: 'bg-terminal-green text-black hover:bg-green-400',
  outline: 'border border-terminal-green text-terminal-green hover:bg-green-900',
  danger: 'bg-red-600 text-white hover:bg-red-500',
};

export default function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  return (
    <button
      className={`font-bold px-4 py-2 rounded transition text-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
