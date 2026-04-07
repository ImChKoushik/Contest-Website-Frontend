import React from 'react';
import { useToast } from '../context/ToastContext';

export default function ContestCard({ 
  id,
  image, 
  category, 
  title, 
  description, 
  daysLeft, 
  entries,
  onApply,
  status,
  projectType,
  teamSize
}) {
  const { showToast } = useToast();

  const handleApply = () => {
    if (!id) {
      showToast("Contest ID missing. Cannot apply.", "error");
      return;
    }

    if (onApply) onApply();
  };

  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Top Image / Graphic Area */}
      <div className="relative h-48 w-full bg-slate-900 p-2">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover rounded-[16px]"
        />
        {/* Category Pill Tag */}
        <div className="absolute top-5 left-5 bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-sm flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${projectType === 'Team' ? 'bg-blue-500' : 'bg-[#8cc63f]'}`}></span>
          {projectType || 'Individual'}
        </div>
        <div className="absolute top-5 right-5 bg-pink-100/90 backdrop-blur text-pink-500 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-sm">
          {category}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-extrabold text-[#1f2937] mb-2 tracking-tight line-clamp-1">{title}</h3>
        <p className="text-[#6b7280] text-sm mb-5 leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-6 pb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
            {daysLeft}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {entries}
          </div>
          {projectType === 'Team' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.971 5.971 0 00-.941 3.197m0 0l.001.031c0 .225.012.447.038.666M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 6.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              Max {teamSize}
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-3 mt-auto">
          {/* Status badge based on backend enum */}
          {status === 'Upcoming' ? (
            <button
              disabled
              className="flex-1 bg-[#fcb900]/10 text-[#e6a800] border border-[#fcb900]/30 py-2.5 rounded-full font-bold text-[13px] tracking-wide cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#fcb900] inline-block"></span>
              Upcoming
            </button>
          ) : status === 'On-Going' ? (
            <button 
              onClick={handleApply}
              className="flex-1 bg-[#8cc63f] hover:bg-[#7db435] text-white py-2.5 rounded-full font-bold text-[13px] tracking-wide transition-colors shadow-sm"
            >
              Apply
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-100 text-gray-400 border border-gray-200 py-2.5 rounded-full font-bold text-[13px] tracking-wide cursor-not-allowed"
            >
              Closed
            </button>
          )}
          <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 py-2.5 rounded-full font-bold text-[13px] tracking-wide transition-colors shadow-sm">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
