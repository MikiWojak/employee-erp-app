import { forwardRef } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';

interface CustomDateInputProps {
    value?: string;
    inputId: string;
    onClick?: () => void;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
    ({ inputId, value, onClick }, ref) => (
        <div className="flex items-center">
            <input
                id={inputId}
                value={value}
                className="block w-full p-2 border-2 border-slate-700 bg-slate-700 rounded focus:outline-none focus:border-sky-500"
                readOnly={true}
                onClick={onClick}
                ref={ref}
            />
            <CalendarDaysIcon className="h-6 w-6 -ml-8 text-white" />
        </div>
    )
);

CustomDateInput.displayName = 'CustomDateInput';

export default CustomDateInput;
