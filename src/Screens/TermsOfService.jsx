import React, { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfcfb] py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-[#fcb900] to-orange-600 p-10 md:p-14 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">Terms and Conditions</h1>
          <p className="text-lg font-bold opacity-90 uppercase tracking-widest">Welcome to DESUN Academy</p>
        </div>

        {/* Content Area */}
        <div className="p-10 md:p-16 prose prose-lg max-w-none text-gray-700 leading-relaxed font-medium">
          <p className="mb-8">
            These terms and conditions outline the rules and regulations for the use of DESUN Academy’s Website, located at <a href="https://www.desunacademy.in" className="text-orange-600 hover:underline font-bold">www.desunacademy.in</a>
          </p>
          <p className="mb-8">
            By accessing this website we assume you accept these terms and conditions. Do not continue to use DESUN Academy if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p className="mb-12 pb-8 border-b border-gray-100 italic text-gray-500">
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: “Client”, “You” and “Your” refers to you, the person log on this website and compliant to the Company’s terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#fcb900] rounded-full"></span>
            Cookies
          </h2>
          <p className="mb-6">
            We employ the use of cookies. By accessing DESUN Academy, you agreed to use cookies in agreement with the Desun Academy’s Privacy Policy.
          </p>
          <p className="mb-10 text-gray-600">
            Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#fcb900] rounded-full"></span>
            License
          </h2>
          <p className="mb-6">
            Unless otherwise stated, DESUN Academy and/or its licensors own the intellectual property rights for all material on DESUN Academy. All intellectual property rights are reserved. You may access this from DESUN Academy for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p className="mb-4 font-bold text-gray-900">You must not:</p>
          <ul className="list-disc pl-6 space-y-3 mb-10 text-gray-600">
            <li>Republish material from DESUN Academy</li>
            <li>Sell, rent or sub-license material from DESUN Academy</li>
            <li>Reproduce, duplicate or copy material from DESUN Academy</li>
            <li>Redistribute content from DESUN Academy</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#fcb900] rounded-full"></span>
            User Comments
          </h2>
          <p className="mb-6">
            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. DESUN Academy does not filter, edit, publish or review Comments prior to their presence on the website.
          </p>
          <p className="mb-6">
            DESUN Academy reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
          </p>
          <p className="mb-4 font-bold text-gray-900">You warrant and represent that:</p>
          <ul className="list-disc pl-6 space-y-3 mb-10 text-gray-600 text-sm">
            <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
            <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
            <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;</li>
            <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#fcb900] rounded-full"></span>
            Hyperlinking to our Content
          </h2>
          <p className="mb-6">
            The following organizations may link to our Website without prior written approval: Government agencies, Search engines, News organizations, and Online directory distributors.
          </p>
          <p className="mb-10 text-gray-600 text-sm italic">
            No use of DESUN Academy’s logo or other artwork will be allowed for linking absent a trademark license agreement.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#fcb900] rounded-full"></span>
            iFrames
          </h2>
          <p className="mb-10">
            Without prior approval and written permission, you may not create frames around our Web Pages that alter in any way the visual presentation or appearance of our Website.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#fcb900] rounded-full"></span>
            Content Liability
          </h2>
          <p className="mb-10">
            We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#fcb900] rounded-full"></span>
            Disclaimer
          </h2>
          <p className="mb-6 font-bold">To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.</p>
          <p className="mb-0 text-gray-500 text-sm italic">
            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
          </p>
        </div>
        
        {/* Footer Accent */}
        <div className="bg-gray-50 p-10 text-center border-t border-gray-100">
          <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Desun Academy Legal Documentation</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
