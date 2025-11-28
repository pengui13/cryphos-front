import Link from "next/link";
import { ChevronRight, Mail, MapPin, ExternalLink } from "lucide-react";

export default function Impressum() {
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
            Legal Notice
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Transparency and compliance information for Cryphos services
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
                  "Provider",
                  "Responsibility",
                  "Liability",
                  "External Links",
                  "Copyright",
                  "Disclaimer",
                  "Dispute Resolution"
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
            {/* Provider */}
            <section id="provider" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">Service Provider</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="border border-white/10 rounded-xl p-6 bg-white/[0.03] backdrop-blur-sm">
                  <p className="font-semibold text-white mb-4">Cryphos – Automated Crypto Analytics & Trading Tools</p>
                  <div className="space-y-3 text-slate-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Daniel Sklyarov</p>
                        <p>Bernhauser Straße 21</p>
                        <p>70599 Stuttgart, Germany</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <a
                        href="mailto:support@cryphos.com"
                        className="text-slate-300 hover:text-slate-100 transition-colors"
                      >
                        support@cryphos.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Responsibility */}
            <section id="responsibility" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">Responsible for Content</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <span className="font-medium text-white">Daniel Sklyarov</span>
                <br />
                Bernhauser Straße 21, 70599 Stuttgart, Germany
                <br />
                <span className="text-xs text-slate-500 mt-2 block">(pursuant to § 18 (2) MStV)</span>
              </p>
            </section>

            {/* Liability */}
            <section id="liability" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">Liability for Content</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                As a service provider, we are responsible for our own content on these pages in accordance with general laws (§ 7 para.1 TMG). However, according to §§ 8–10 TMG, we are not obligated to monitor transmitted or stored third-party information or investigate circumstances indicating illegal activity.
              </p>
            </section>

            {/* External Links */}
            <section id="external-links" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">Liability for External Links</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Our website contains links to external third-party websites. We have no control over their content. Therefore, we assume no liability for the content of external sites. The respective provider or operator of the linked pages is always responsible.
              </p>
            </section>

            {/* Copyright */}
            <section id="copyright" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">Copyright</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                All content, graphics, logos, and software components provided by Cryphos are protected by copyright. Any reproduction, distribution, or modification outside the limits of copyright law requires prior written permission.
              </p>
            </section>

            {/* Financial Disclaimer */}
            <section id="disclaimer" className="scroll-mt-24">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">Financial Disclaimer</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <div className="border border-white/10 rounded-xl p-6 bg-white/[0.03] backdrop-blur-sm">
                <p className="text-slate-300 leading-relaxed">
                  Cryphos does not provide financial advice. All analytics, signals, and trading bots are for informational and educational purposes only. Cryptocurrency trading involves significant risk, and users trade at their own responsibility. We do not accept liability for financial losses.
                </p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section id="dispute-resolution" className="scroll-mt-24 pb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-white">EU Online Dispute Resolution</h2>
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                The European Commission provides a platform for online dispute resolution:
              </p>
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-slate-100 transition-all"
              >
                EU Dispute Resolution Platform
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-slate-400 text-sm mt-4">
                We are not obliged or willing to participate in dispute resolution procedures before a consumer arbitration board.
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