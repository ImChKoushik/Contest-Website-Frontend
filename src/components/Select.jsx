import { useId } from 'react';

export default function Select({ label, icon, options = [], ...props }) {
  const id = useId();
  return (
    <div className="flex flex-col mb-5 w-full">
      {label && <label htmlFor={id} className="text-sm font-semibold text-gray-800 mb-2">{label}</label>}
      <div className="relative flex items-center bg-[#f7f7f7] rounded-xl border border-transparent focus-within:border-[#8cc63f] focus-within:bg-white transition-all overflow-hidden">
        {icon && (
          <span className="pl-4 text-gray-400">
            {icon}
          </span>
        )}
        <select
          id={id}
          className="w-full bg-transparent px-4 py-3.5 outline-none text-gray-700 text-sm appearance-none cursor-pointer"
          {...props}
        >
          <option value="" disabled>Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
