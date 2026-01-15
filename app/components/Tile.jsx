import { Lock, Plus } from "lucide-react";
export default function CreateTile({ locked, onCreate }) {
  return (
    <article
      className={[
        "group relative rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-white/[0.015] p-4 backdrop-blur",
        "transition-all hover:border-white/10 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
        "overflow-hidden",
      ].join(" ")}
      role="button"
      tabIndex={0}
      aria-disabled={locked}
      onClick={() => { if (!locked && typeof onCreate === "function") onCreate(); }}
      onKeyDown={(e) => {
        if (!locked && typeof onCreate === "function" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault(); onCreate();
        }
      }}
    >
      {/* shimmer */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -inset-x-10 -top-10 h-24 rotate-6 bg-gradient-to-r from-indigo-400/10 via-white/15 to-violet-400/10 blur-2xl" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl ring-1 ring-white/10 grid place-items-center bg-white/5">
            {locked ? <Lock className="h-4 w-4 text-slate-300" /> : <Plus className="h-4 w-4 text-indigo-300" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              {locked ? "Create new bot (locked)" : "Create new bot"}
            </h3>
            <p className="text-[11px] text-slate-500">
              {locked ? "This feature is currently locked. One bot per user." : "Start a new RSI strategy in seconds."}
            </p>
          </div>
        </div>

        <span className={[
          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ring-1",
          locked ? "bg-slate-600/10 text-slate-300 ring-white/10" : "bg-indigo-500/10 text-indigo-300 ring-indigo-400/20",
        ].join(" ")}>
          {locked ? "locked" : "available"}
        </span>
      </div>

      <div className="mt-4 border-t border-white/5 pt-3">
        <button
          disabled={locked}
          className={[
            "inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] ring-1 transition",
            locked ? "cursor-not-allowed bg-white/[0.02] ring-white/10 text-slate-400"
                   : "bg-white/[0.02] hover:bg-white/[0.06] ring-white/10",
          ].join(" ")}
        >
          {locked ? (<><Lock className="h-3.5 w-3.5" /> Locked</>) : (<><Plus className="h-3.5 w-3.5" /> Create</>)}
        </button>
      </div>
    </article>
  );
}
