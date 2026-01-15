import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0B0B12] text-slate-100">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 bg-[#0B0B12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-20">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            How we collect, use, and protect your personal information
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                Sections
              </p>
              <nav className="space-y-1">
                {[
                  "Introduction",
                  "Information Collection",
                  "Use of Information",
                  "Data Security",
                  "Cookies",
                  "Third-Party Services",
                  "User Rights",
                  "Data Retention",
                  "GDPR Compliance",
                  "Changes to Policy",
                  "Contact"
                ].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{item}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">1. Introduction</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Cryphos ("we," "us," "our," or the "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with our policies and practices, please do not use our Service. We will notify you of any changes to this Privacy Policy by updating the "Last Updated" date of this Privacy Policy.
              </p>
            </section>

            {/* Information Collection */}
            <section id="information-collection" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">2. Information We Collect</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-white mb-2">Personal Information You Provide</p>
                  <p className="text-slate-300 leading-relaxed mb-3">
                    We collect information you provide directly, including:
                  </p>
                  <div className="border-l-2 border-white/20 pl-4 space-y-2 text-sm text-slate-300">
                    <p>• Email address and contact information</p>
                    <p>• Account registration details</p>
                    <p>• Payment and billing information</p>
                    <p>• User profile information</p>
                    <p>• Communication preferences</p>
                    <p>• Support tickets and inquiries</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-semibold text-white mb-2">Automatically Collected Information</p>
                  <p className="text-slate-300 leading-relaxed mb-3">
                    When you use our Service, we automatically collect certain information:
                  </p>
                  <div className="border-l-2 border-white/20 pl-4 space-y-2 text-sm text-slate-300">
                    <p>• IP address and device information</p>
                    <p>• Browser type and version</p>
                    <p>• Operating system</p>
                    <p>• Pages visited and time spent</p>
                    <p>• Referral source</p>
                    <p>• Usage patterns and analytics</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">Trading Data</p>
                  <p className="text-slate-300 leading-relaxed">
                    If you use our trading tools and analytics, we collect data about your trading activities, preferences, and bot configurations. This information is used to provide and improve our services.
                  </p>
                </div>
              </div>
            </section>

            {/* Use of Information */}
            <section id="use-of-information" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">3. How We Use Your Information</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-3">
                We use the information we collect for various purposes:
              </p>
              <div className="border-l-2 border-white/20 pl-4 space-y-2 text-sm text-slate-300">
                <p>• To provide and maintain our Service</p>
                <p>• To process transactions and send related information</p>
                <p>• To send promotional communications and updates</p>
                <p>• To analyze usage patterns and improve user experience</p>
                <p>• To respond to your inquiries and support requests</p>
                <p>• To detect and prevent fraudulent activity and misuse</p>
                <p>• To comply with legal obligations</p>
                <p>• To develop new features and services</p>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">4. Data Security</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <div className="border border-white/10 rounded-xl p-6 bg-white/[0.03] backdrop-blur-sm">
                <p className="text-slate-300 leading-relaxed">
                  We implement appropriate technical and organizational measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit and at rest, secure password practices, and regular security audits. However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">5. Cookies and Tracking Technologies</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with small amounts of data that may include a unique identifier.
              </p>
              <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
                <p>
                  <span className="font-semibold text-white">Session Cookies:</span> Temporary cookies used to maintain your session during your visit.
                </p>
                <p>
                  <span className="font-semibold text-white">Persistent Cookies:</span> Cookies that remain on your device to remember your preferences and login information.
                </p>
                <p>
                  <span className="font-semibold text-white">Analytics Cookies:</span> Used to understand how users interact with our Service.
                </p>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm mt-4">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you refuse cookies, you may not be able to use portions of our Service.
              </p>
            </section>

            {/* Third-Party Services */}
            <section id="third-party-services" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">6. Third-Party Services</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Our Service may contain links to third-party websites and services that are not operated by Cryphos. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review their privacy policies before providing your information or using their services.
              </p>
              <p className="text-slate-300 leading-relaxed">
                We may use third-party service providers to perform functions on our behalf, including hosting, analytics, and payment processing. These providers are contractually obligated to use your information only as necessary to provide services to us.
              </p>
            </section>

            {/* User Rights */}
            <section id="user-rights" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">7. Your Rights and Choices</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <div className="border-l-2 border-white/20 pl-4 space-y-2 text-sm text-slate-300">
                <p>• Right to access your personal data</p>
                <p>• Right to correct inaccurate or incomplete information</p>
                <p>• Right to request deletion of your data</p>
                <p>• Right to restrict processing of your information</p>
                <p>• Right to data portability</p>
                <p>• Right to object to marketing communications</p>
                <p>• Right to withdraw consent at any time</p>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm mt-4">
                To exercise any of these rights, please contact us at support@cryphos.com with your request.
              </p>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">8. Data Retention</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. The retention period may vary depending on the context of processing and our legal obligations. If you request deletion of your account, we will remove your personal information within a reasonable timeframe, except where we are required to retain it for legal or compliance purposes.
              </p>
            </section>

            {/* GDPR Compliance */}
            <section id="gdpr-compliance" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">9. GDPR Compliance</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                For users in the European Union, we comply with the General Data Protection Regulation (GDPR). We process personal data only with a lawful basis, such as:
              </p>
              <div className="border-l-2 border-white/20 pl-4 space-y-2 text-sm text-slate-300">
                <p>• Your explicit consent</p>
                <p>• Performance of a contract with you</p>
                <p>• Compliance with legal obligations</p>
                <p>• Protection of vital interests</p>
                <p>• Our legitimate interests</p>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm mt-4">
                You have the right to lodge a complaint with your local data protection authority if you believe we have violated your rights.
              </p>
            </section>

            {/* Changes to Policy */}
            <section id="changes-to-policy" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">10. Changes to This Privacy Policy</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by updating the "Last Updated" date of this Privacy Policy. Your continued use of our Service following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-24 pb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">11. Contact Us</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="border border-white/10 rounded-xl p-6 bg-white/[0.03] backdrop-blur-sm">
                <p className="font-semibold text-white mb-2">Cryphos Privacy Team</p>
                <p className="text-slate-300 mb-2">Email: <a href="mailto:privacy@cryphos.com" className="text-slate-200 hover:text-slate-100 transition-colors">privacy@cryphos.com</a></p>
                <p className="text-slate-300 mb-2">Support: <a href="mailto:support@cryphos.com" className="text-slate-200 hover:text-slate-100 transition-colors">support@cryphos.com</a></p>
                <p className="text-slate-300">Bernhauser Straße 21, 70599 Stuttgart, Germany</p>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-[#0B0B12] mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Cryphos. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}