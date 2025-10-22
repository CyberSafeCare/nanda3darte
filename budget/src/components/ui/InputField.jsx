
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InputField = React.forwardRef(({ id, label, unit, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id} className="text-gray-300">{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          className={cn(
            'bg-gray-800/50 border-gray-700 text-white h-12 text-lg',
            { 'pr-12': unit },
            className
          )}
          {...props}
        />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{unit}</span>}
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';

// Helper function to combine class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};


export { InputField };
