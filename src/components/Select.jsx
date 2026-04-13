import { useId } from 'react';

export default function Select({ label, icon, options = [], ...props }) {
  const id = useId();
  return (
    <div className="flex flex-col mb-5 w-full">
      {label && <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)] mb-2 transition-colors">{label}</label>}
      <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-[var(--border-primary)] focus-within:border-[var(--accent-green)] focus-within:bg-[var(--input-focus-bg)] transition-all overflow-hidden">
        {icon && (
          <span className="pl-4 text-[var(--text-secondary)] transition-colors">
            {icon}
          </span>
        )}
        <select
          id={id}
          className="w-full bg-transparent px-4 py-3.5 outline-none text-[var(--text-primary)] text-sm appearance-none cursor-pointer transition-all"
          {...props}
        >
          <option value="" disabled className="bg-[var(--card-bg)]">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[var(--card-bg)] text-[var(--text-primary)]">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 pointer-events-none text-[var(--text-secondary)] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
