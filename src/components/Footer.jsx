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
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8cc63f] transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8cc63f] transition-all cursor-pointer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8cc63f] transition-all cursor-pointer">
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
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
      </div>
    </footer>
  );
}
