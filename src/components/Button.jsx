export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "font-semibold rounded-lg transition-colors duration-200 px-6 py-2.5 inline-flex justify-center items-center";
  const primaryStyle = "bg-[#8cc63f] hover:bg-[#7ab135] text-white";
  const secondaryStyle = "bg-transparent hover:text-[#8cc63f] text-[#8cc63f] hover:bg-gray-50";

  return (
    <button
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
