import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";

export default function Terms() {
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
            Terms of Use
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Please read these terms carefully before using Cryphos services
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
                  "Acceptance",
                  "Use License",
                  "Disclaimer",
                  "Limitations",
                  "Accuracy of Content",
                  "External Links",
                  "Modifications",
                  "Governing Law",
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
            {/* Acceptance */}
            <section id="acceptance" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">1. Acceptance of Terms</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using Cryphos ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. We reserve the right to modify these terms at any time without notice. Your continued use of this Service following the posting of revised Terms means that you accept and agree to the changes. These terms of use are subject to change at any time, and it is your responsibility to review these terms regularly for updates.
              </p>
            </section>

            {/* Use License */}
            <section id="use-license" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">2. Use License</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on Cryphos for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <div className="border-l-2 border-white/20 pl-4 space-y-2 text-sm">
                  <p>• Modify or copy the materials</p>
                  <p>• Use the materials for any commercial purpose or for any public display</p>
                  <p>• Attempt to decompile or reverse engineer any software contained on Cryphos</p>
                  <p>• Remove any copyright or other proprietary notations from the materials</p>
                  <p>• Transfer the materials to another person or "mirror" the materials on any other server</p>
                  <p>• Violate any applicable laws or regulations</p>
                  <p>• Conduct any systematic or automated data collection, scraping, or monitoring</p>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section id="disclaimer" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">3. Disclaimer</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <div className="border border-white/10 rounded-xl p-6 bg-white/[0.03] backdrop-blur-sm space-y-4">
                <div>
                  <p className="font-semibold text-white mb-2">Financial Services Disclaimer</p>
                  <p className="text-slate-300 leading-relaxed">
                    Cryphos does not provide financial advice, investment recommendations, or professional financial services. All information, analytics, signals, and trading bots are provided for educational and informational purposes only. Past performance is not indicative of future results. Cryptocurrency trading is highly volatile and speculative.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">No Warranty</p>
                  <p className="text-slate-300 leading-relaxed">
                    The materials on Cryphos are provided "as is" and without warranties of any kind, either express or implied. Cryphos disclaims all warranties, express or implied, including but not limited to, implied warranties of merchantability and fitness for a particular purpose. Further, Cryphos does not warrant that the materials on its Service are correct, accurate, or timely.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section id="limitations" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">4. Limitations of Liability</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                In no event shall Cryphos or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Cryphos, even if Cryphos or an authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </section>

            {/* Accuracy */}
            <section id="accuracy-of-content" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">5. Accuracy of Materials</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The materials appearing on Cryphos could include technical, typographical, or photographic errors. Cryphos does not warrant that any of the materials on its Service are accurate, complete, or current. Cryphos may make changes to the materials contained on its Service at any time without notice. However, Cryphos does not commit to updating the materials. We do not represent that information provided through the Service is necessarily accurate or complete.
              </p>
            </section>

            {/* External Links */}
            <section id="external-links" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">6. External Links</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Cryphos has not reviewed all of the sites linked to its Service and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Cryphos of the site. Use of any such linked website is at the user's own risk. If you decide to leave our site and access third-party content, we disclaim any liability for such actions. We are not responsible for any content on external websites.
              </p>
            </section>

            {/* Modifications */}
            <section id="modifications" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">7. Modifications</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Cryphos may revise these terms of use at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of use. We may modify, suspend, or discontinue the Service or access to the Service at any time for any reason. If Cryphos discontinues the Service, your only remedy is to discontinue use of the Service.
              </p>
            </section>

            {/* User Responsibilities */}
            <section id="user-responsibilities" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">8. User Responsibilities</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>You are responsible for maintaining the confidentiality of any information you provide and for all activities that occur under your account. You agree to:</p>
                <div className="border-l-2 border-white/20 pl-4 space-y-2 text-sm">
                  <p>• Provide accurate and complete information</p>
                  <p>• Not engage in any illegal or unauthorized use of the Service</p>
                  <p>• Not violate any applicable laws or regulations</p>
                  <p>• Not attempt to gain unauthorized access to our systems</p>
                  <p>• Not transmit viruses or any code of a destructive nature</p>
                  <p>• Take sole responsibility for all decisions made based on information from Cryphos</p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">9. Governing Law</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of Germany, and you irrevocably submit to the exclusive jurisdiction of the courts located in Stuttgart, Germany. If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-24 pb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">10. Contact Information</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="border border-white/10 rounded-xl p-6 bg-white/[0.03] backdrop-blur-sm">
                <p className="font-semibold text-white mb-2">Cryphos Support</p>
                <p className="text-slate-300 mb-2">Email: <a href="mailto:support@cryphos.com" className="text-slate-200 hover:text-slate-100 transition-colors">support@cryphos.com</a></p>
                <p className="text-slate-300">Bernhauser Straße 21, 70599 Stuttgart, Germany</p>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </div>

    </div>
  );
}