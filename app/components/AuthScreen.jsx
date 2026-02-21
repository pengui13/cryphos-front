import { motion } from "framer-motion"
import Link from "next/link"
import { useLang } from "../LanguageContext";
import Image from "next/image"
export default function AuthScreen(){
  const { t } = useLang();

    return(
     <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-white">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative text-center">
          <Image src="/padlock.png" alt="Locked" width={140} height={140} className="mx-auto mb-6 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]" />
          <h1 className="mb-3 bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl sm:text-4xl font-bold tracking-tight text-transparent">
            {t("bots.authRequired")}
          </h1>
          <p className="mx-auto max-w-md text-white/60 text-sm sm:text-base">{t("bots.loginToAccess")}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="rounded-2xl bg-white px-6 sm:px-8 py-3 font-semibold text-black shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition">
                {t("auth.login")}
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="rounded-2xl border border-white/10 bg-white/5 px-6 sm:px-8 py-3 font-semibold transition hover:bg-white/10">
                {t("auth.signup")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
}