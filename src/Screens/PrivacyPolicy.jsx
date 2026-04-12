import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfcfb] py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-[#8cc63f] to-[#7ab033] p-10 md:p-14 text-white text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">Privacy Policy</h1>
          <p className="text-lg font-bold opacity-90 uppercase tracking-widest">Effective Date: 2022-12-01</p>
        </div>

        {/* Content Area */}
        <div className="p-10 md:p-16 prose prose-lg max-w-none text-gray-700 leading-relaxed font-medium">
          <p className="mb-8">
            At DESUN Academy, accessible from <a href="https://www.desunacademy.in" className="text-[#8cc63f] hover:underline font-bold">www.desunacademy.in</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Desun Academy and how we use it.
          </p>
          <p className="mb-8">
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
          <p className="mb-12 pb-8 border-b border-gray-100">
            This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in DESUN Academy. This policy is not applicable to any information collected offline or via channels other than this website.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            Consent
          </h2>
          <p className="mb-10">
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            Information we collect
          </h2>
          <p className="mb-6">
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p className="mb-6">
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>
          <p className="mb-10">
            When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            How we use your information
          </h2>
          <p className="mb-6 font-bold text-gray-900">We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-6 space-y-3 mb-10 text-gray-600">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyse how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            Log Files
          </h2>
          <p className="mb-10">
            DESUN Academy follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services’ analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analysing trends, administering the site, tracking users’ movement on the website, and gathering demographic information.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            Advertising Partners Privacy Policies
          </h2>
          <p className="mb-6">
            You may consult this list to find the Privacy Policy for each of the advertising partners of DESUN Academy.
          </p>
          <p className="mb-6 text-gray-600">
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on DESUN Academy, which are sent directly to users’ browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="mb-10 italic text-gray-500 bg-gray-50 p-6 rounded-2xl border-l-4 border-gray-200 font-bold">
            Note that DESUN Academy has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            Third Party Privacy Policies
          </h2>
          <p className="mb-6 text-gray-600">
            DESUN Academy’s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p className="mb-10">
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers’ respective websites.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            CCPA Privacy Rights
          </h2>
          <p className="mb-6 font-bold">Under the CCPA, California consumers have the right to:</p>
          <ul className="list-disc pl-6 space-y-3 mb-10 text-gray-600">
            <li>Request disclosure of the categories and specific pieces of personal data collected.</li>
            <li>Request deletion of any personal data collected.</li>
            <li>Request that a business does not sell their personal data.</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            GDPR Data Protection Rights
          </h2>
          <p className="mb-6 font-bold">We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul className="list-disc pl-6 space-y-3 mb-10 text-gray-600">
            <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data.</li>
            <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data.</li>
            <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected.</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-8 h-1 bg-[#8cc63f] rounded-full"></span>
            Children’s Information
          </h2>
          <p className="mb-6">
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p className="mb-0">
            DESUN Academy does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
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

export default PrivacyPolicy;
