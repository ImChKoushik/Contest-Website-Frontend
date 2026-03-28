export default function Form({ children, onSubmit, className = '', ...props }) {
  return (
    <form 
      onSubmit={onSubmit} 
      className={`bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full max-w-[500px] ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}
