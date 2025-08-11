import Input from "./Input";

export default function ConfigureTg({
  tgNickname,
  setTgNickname,
  step,
  setStep,
  onCreateBot,
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Connect Telegram</h2>
        <p className="text-white/60 text-sm">
          Add your Telegram username for notifications
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <div className="space-y-6">
          {/* Input Section */}
          <div>
            <label className="text-white font-medium text-sm mb-3 block">
              Telegram Username
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-white/60 text-lg">@</span>
              </div>
              <Input
                type="text"
                value={tgNickname}
                onChange={(e) => setTgNickname(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#e3b8ff]/50 transition-colors"
              />
            </div>

            <p className="text-white/50 text-xs mt-2">
              Don't include the @ symbol - just your username (e.g. "johndoe")
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 text-sm">🚀</span>
                </div>
                <div>
                  <p className="text-green-400 font-medium text-sm">
                    Trade Alerts
                  </p>
                  <p className="text-white/60 text-xs">
                    Real-time notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-sm">📊</span>
                </div>
                <div>
                  <p className="text-blue-400 font-medium text-sm">
                    Market Updates
                  </p>
                  <p className="text-white/60 text-xs">Performance reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {tgNickname && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#e3b8ff] rounded-full animate-pulse"></div>
            <p className="text-white/80 text-sm">
              Bot will send notifications to{" "}
              <span className="text-[#e3b8ff] font-medium">@{tgNickname}</span>
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(step - 1)}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
        >
          ← Back
        </button>

        {tgNickname && (
          <button
            onClick={onCreateBot}
            className="px-8 py-3 bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black font-medium rounded-lg hover:scale-105 transition-transform"
          >
            Create Bot →
          </button>
        )}
      </div>
    </div>
  );
}
