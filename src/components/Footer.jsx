import { Link } from 'react-router-dom';
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
              <li><Link to="/contests" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Explore Contests</Link></li>
              <li><Link to="/leaderboard" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Leaderboard</Link></li>
              <li><Link to="/success-stories" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Success Stories</Link></li>
              <li><Link to="/contact" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Support Center</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="font-bold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-blue-50/70 hover:text-[#8cc63f] text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-6">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Ambuja Neotia Eco Station Sector V Salt Lake Kolkata")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8cc63f] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-50/70 text-xs font-black uppercase tracking-widest mb-1 group-hover:text-[#8cc63f] transition-colors">Find Us</p>
                  <p className="text-white text-sm leading-relaxed font-medium">
                    11th Floor, Room No - 1104, Ambuja Neotia Eco Station, BP Block, Sector V, Salt lake, Kolkata, West Bengal 700091
                  </p>
                </div>
              </a>

              <a 
                href="tel:+919429691888"
                className="flex gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8cc63f] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-50/70 text-xs font-black uppercase tracking-widest mb-1 group-hover:text-[#8cc63f] transition-colors">Call Support</p>
                  <p className="text-white text-sm font-black">+91 942 969 1888</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-blue-50/50 text-[10px] md:text-[11px] text-center md:text-left space-y-1.5">
            <p className="font-semibold tracking-wide">© 2026 Desun Academy. All Rights Reserved. A unit of DESUN Tech Foundation. All Rights Reserved.</p>
            <p className="font-bold text-blue-50/40">Powered by DESUN Technology PVT LTD.</p>
          </div>
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
