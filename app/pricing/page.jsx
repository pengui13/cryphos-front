import Link from "next/link";
import { Check, ArrowRight, Zap } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#0B0B12] text-slate-100">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 bg-[#0B0B12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            Cryphos
          </Link>
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
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
            Simple Pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start trading with Cryphos today. Get your first bot and advanced analytics.
          </p>
        </div>

        {/* Current Plan */}
        <div className="max-w-md mx-auto mb-20">
          <div className="border border-white/10 rounded-xl bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all">
            {/* Header */}
            <div className="px-8 pt-8 pb-4">
              <h3 className="text-2xl font-semibold text-white">Cryphos Bot</h3>
              <p className="text-slate-400 text-sm mt-1">Current offering</p>
            </div>

            {/* Price */}
            <div className="px-8 py-6 border-y border-white/10">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold text-white">$5.99</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Billed monthly</p>
            </div>


            {/* Features */}
            <div className="px-8 pb-8 space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">1 Trading Bot</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Real-time market data</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Automated trading signals</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Email support</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">Performance tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Coming Soon
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Expanded Plans</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We're building more powerful plans with additional bots, advanced analytics, and premium features to scale your trading strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Pro",
                description: "For active traders",
                icon: "🚀"
              },
              {
                name: "Enterprise",
                description: "For institutions",
                icon: "⚡"
              },
              {
                name: "Custom",
                description: "Tailored solutions",
                icon: "🎯"
              }
            ].map((plan, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-xl p-8 bg-white/[0.03] backdrop-blur-sm hover:border-white/20 transition-all text-center opacity-60"
              >
                <span className="text-4xl mb-4 block">{plan.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.description}</p>
                <p className="text-slate-500 text-xs mt-4">Coming Q1 2025</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your subscription at any time. Your bot will be disabled at the end of your billing cycle."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards and cryptocurrency payments (Bitcoin, Ethereum, USDC)."
              },
              {
                q: "Is there a free trial?",
                a: "Yes, we offer a 7-day free trial so you can test Cryphos Bot risk-free before committing."
              },
              {
                q: "How does the bot work?",
                a: "Our bot uses real-time market data and customizable trading signals to execute automated trades based on your strategy."
              },
              {
                q: "Is my data secure?",
                a: "Your data is protected with bank-level encryption and complies with GDPR standards."
              },
              {
                q: "Can I run multiple bots?",
                a: "Currently, the $5.99 plan includes 1 bot. We're developing higher-tier plans with multiple bot support coming soon."
              }
            ].map((item, index) => (
              <details
                key={index}
                className="group border border-white/10 rounded-lg p-6 bg-white/[0.03] hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <summary className="flex items-center justify-between text-white font-medium">
                  <span>{item.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-slate-400 mt-4 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="border border-white/10 rounded-xl p-12 bg-white/[0.03] backdrop-blur-sm text-center mb-20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to automate your trading?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Start with Cryphos Bot today. Get 7 days free, no credit card required.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-all inline-flex items-center gap-2">
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-[#0B0B12]">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Cryphos. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}