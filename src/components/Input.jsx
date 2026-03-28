import { useId } from 'react';

export default function Input({ label, icon, ...props }) {
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
        <input
          id={id}
          className="w-full bg-transparent px-4 py-3.5 outline-none text-gray-700 placeholder:text-gray-400 text-sm"
          {...props}
        />
      </div>
    </div>
  );
}
