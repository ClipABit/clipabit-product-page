'use client';

import React from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type InteractiveHoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  asChild?: boolean;
  overlayClassName?: string;
};

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = 'Button', className, asChild = false, overlayClassName, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(
        'group relative inline-flex w-auto cursor-pointer overflow-hidden rounded-xl bg-background px-4 py-2 sm:px-5 text-center font-semibold text-foreground',
        'items-center justify-center',
        className,
      )}
      {...props}
    >
      <span className="relative z-[1] inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
      </div>
      <div
        className={cn(
          'absolute z-0 left-[-10%] top-1/2 -translate-y-1/2 h-2 w-2 scale-[1] rounded-lg transition-all duration-300 group-hover:left-[-5%] group-hover:top-[0%] group-hover:h-[90%] group-hover:w-[110%] group-hover:scale-[1.2] group-hover:translate-y-0',
          // Default overlay color (brand accent). Override via overlayClassName.
          'bg-[#FAAF04]',
          overlayClassName,
        )}
      />
    </Comp>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

