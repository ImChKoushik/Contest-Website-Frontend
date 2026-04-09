import logo from '../assets/images/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#0066b2] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="mb-6">
              <img src={logo} alt="Desun Academy" className="h-12 w-auto bg-white p-2 rounded-lg" />
            </div>
            <p className="text-blue-50/80 text-sm leading-relaxed mb-8">
              Empowering the next generation of specialists through high-stakes competition and elite academic training.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/desun.academy22/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8cc63f] hover:scale-110 transition-all cursor-pointer shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a 
                href="https://www.instagram.com/desun_academy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8cc63f] hover:scale-110 transition-all cursor-pointer shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.397-.2 6.78-2.645 6.98-6.98.058-1.28.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.2-4.349-2.645-6.78-6.98-6.98-1.28-.058-1.689-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a 
                href="https://www.youtube.com/@DesunAcademy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8cc63f] hover:scale-110 transition-all cursor-pointer shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/desun-academy/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8cc63f] hover:scale-110 transition-all cursor-pointer shadow-lg"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="md:col-span-2 lg:col-span-2 md:ml-auto">
            <h3 className="font-bold text-white mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Explore Contests</a></li>
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Leaderboard</a></li>
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Mentor Program</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="font-bold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">FAQ</a></li>
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Support Center</a></li>
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="font-bold text-white mb-6">Newsletter</h3>
            <p className="text-blue-50/70 text-sm mb-6">Stay updated with the latest contests and academy news.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-5 py-3 rounded-lg bg-white text-gray-900 text-sm outline-none"
              />
              <button className="w-full bg-[#8cc63f] hover:bg-[#7ab033] text-white py-3 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#8cc63f]/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-blue-50/40 text-[11px] max-w-md text-center md:text-left">
            Empowering the next generation of specialists through high-stakes competition and elite academic training.
          </p>
          <div className="flex items-center gap-8 text-[11px] text-blue-50/40">
            <span>language English (US)</span>
            <span className="flex items-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              security Secure Platform
            </span>
          </div>
        </div>

        {/* Credits Section */}
        <div className="pt-8 mt-8 border-t border-white/5 text-center">
          <p className="text-[10px] md:text-[11px] text-blue-50/20 font-medium tracking-wide leading-relaxed">
            Created and developed by <span className="text-[#8cc63f]/50">MERN Stack Trainees</span> of Desun Academy<br />
            <span className="text-blue-50/40 font-bold">Mr. Koushik Chakraborty</span> & <span className="text-blue-50/40 font-bold">Mr. Arupriya Mondal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
