import { useId, forwardRef } from 'react';

const Input = forwardRef(({ label, icon, afterContent, ...props }, ref) => {
  const id = useId();
  return (
    <div className="flex flex-col mb-5 w-full">
      {label && <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)] mb-2 transition-colors">{label}</label>}
      <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-[var(--border-primary)] focus-within:border-[var(--accent-green)] focus-within:bg-[var(--input-focus-bg)] transition-all overflow-hidden group">
        {icon && (
          <span className="pl-4 text-[var(--text-secondary)] transition-colors">
            {icon}
          </span>
        )}
        <input
          id={id}
          ref={ref}
          className="w-full bg-transparent px-4 py-3.5 outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm transition-all"
          {...props}
        />
      </div>
      {afterContent}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
