import React from 'react';

const ContactUs = () => {
  const contactInfo = {
    address: "11th Floor, Room No - 1104, Ambuja Neotia Eco Station, BP Block, Sector V, Salt lake, Kolkata, India. West Bengal 700091",
    phone: "+91 9429691888",
    whatsapp: "+91 8759872761",
    email: "admin@desunacademy.in",
    tagline: "Enroll now and elevate your career with the finest IT training Institute in Kolkata."
  };

  const contactItems = [
    {
      label: "ADDRESS",
      value: contactInfo.address,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    },
    {
      label: "PHONE NO.",
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone.replace(/\s+/g, '')}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      )
    },
    {
      label: "WHATSAPP NO.",
      value: contactInfo.whatsapp,
      link: `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      )
    },
    {
      label: "EMAIL ID",
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Background Doodles (Subtle) */}
      <div className="absolute top-[10%] -left-[5%] w-64 h-64 bg-[var(--accent-green)]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-[5%] w-64 h-64 bg-[var(--accent-yellow)]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Clickable Header Section */}
        <a
          href={`mailto:${contactInfo.email}`}
          className="group mb-8 block w-full bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--border-primary)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow)]/50 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-2 transition-colors">Have Questions?</h1>
              <p className="text-lg text-[var(--accent-green)] font-bold tracking-tight transition-colors">Click here to send us an email directly</p>
            </div>
            <div className="flex items-center gap-3 bg-[var(--accent-green)] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest group-hover:bg-[#7ab033] transition-all shadow-lg shadow-[var(--accent-green)]/30">
              {contactInfo.email}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8cc63f]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#fca311]/5 rounded-full -ml-12 -mb-12"></div>
        </a>

        {/* Contact Info Card */}
        <div className="bg-[var(--card-bg)] rounded-[2.5rem] p-10 md:p-14 shadow-[var(--card-shadow)] border border-[var(--border-primary)] relative overflow-hidden transition-all">
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-[var(--text-primary)] mb-4 tracking-tight uppercase border-b-4 border-[var(--accent-green)] inline-block pb-1 transition-colors">Contact Info</h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed mb-12 max-w-2xl transition-colors">
              {contactInfo.tagline}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {contactItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target={item.label === "ADDRESS" || item.label === "WHATSAPP NO." ? "_blank" : undefined}
                  rel={item.label === "ADDRESS" || item.label === "WHATSAPP NO." ? "noopener noreferrer" : undefined}
                  className="flex gap-5 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-green)]/10 text-[var(--accent-green)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent-green)] group-hover:text-white transition-all duration-500 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[var(--accent-green)] uppercase tracking-[0.2em] mb-2 transition-colors">{item.label}</h3>
                    <p className="text-base font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-green)] transition-all">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Large background logo/icon watermarked */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-64 h-64">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
