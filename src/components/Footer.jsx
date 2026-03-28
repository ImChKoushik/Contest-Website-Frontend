export default function Footer() {
  return (
    <footer className="bg-[#1070c7] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-4 lg:col-span-5 pr-8">
            <div className="flex items-center gap-2 mb-6 bg-white p-3 pr-6 w-max rounded-md shadow-sm">
               <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15Z" fill="#ffefb3"/>
                <path d="M50 30C38.95 30 30 38.95 30 50C30 61.05 38.95 70 50 70C61.05 70 70 61.05 70 50C70 38.95 61.05 30 50 30Z" fill="#8cc63f"/>
                <path d="M50 40A10 10 0 1 0 50 60A10 10 0 1 0 50 40Z" fill="#FFA500"/>
              </svg>
               <div className="font-bold text-xl tracking-tight flex flex-col uppercase leading-tight">
                <span className="text-gray-900">Desun Academy</span>
                <span className="text-gray-900 text-[0.55rem] tracking-wider bg-[#fcb900] w-max px-1.5 py-0.5 rounded font-bold">Get Placed by Skills</span>
              </div>
            </div>
            <p className="text-blue-100/90 text-[15px] leading-relaxed">
              Empowering the next generation of specialists through rigorous training and high-stakes competition.
            </p>
          </div>
          
          {/* Links 1 */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="font-semibold text-white mb-5 text-base">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">Home</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">Contests</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">About Us</a></li>
            </ul>
          </div>
          
          {/* Links 2 */}
          <div className="col-span-1 md:col-span-3 lg:col-span-3">
            <h3 className="font-semibold text-white mb-5 text-base">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">FAQ</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">Support</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
          
          {/* Links 3 */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h3 className="font-semibold text-white mb-5 text-base">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-400/30 pt-8 text-center">
          <p className="text-blue-100/80 text-sm">
            &copy; 2024 Desun Academy. Empowering the next generation of specialists.
          </p>
        </div>
      </div>
    </footer>
  );
}
