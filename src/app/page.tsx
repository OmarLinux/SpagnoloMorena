"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, BookOpen, MessageSquare, Play, Users, Languages, UserCircle, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const { currentUser, users } = useUser();
  const router = useRouter();

  // Redirect to profile if no active profile
  useEffect(() => {
    if (users.length === 0 || !currentUser) {
      router.push("/profile");
    }
  }, [users, currentUser, router]);

  if (!currentUser) return null;

  const genderEmoji = currentUser.gender === "m" ? "👦" : currentUser.gender === "f" ? "👧" : "🧑";

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header / XP Bar */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-3xl shadow-sm border-2 border-soft-blue">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-game-orange rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {currentUser.level}
          </div>
          <div>
            <h2 className="font-bold text-slate-700">
              {t("hola")}, {genderEmoji} {currentUser.username}!
            </h2>
            <div className="w-48 h-3 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-success-green"
                initial={{ width: 0 }}
                animate={{ width: `${currentUser.xp % 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">{currentUser.xp} XP • {t("next_level")} {100 - (currentUser.xp % 100)} XP</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile Switcher */}
          <Link
            href="/profile"
            className="p-2 bg-soft-blue rounded-xl border border-joy-blue/10 text-joy-blue hover:bg-joy-blue hover:text-white transition-all"
            title={language === "it" ? "Profili" : "Perfiles"}
          >
            <Users size={20} />
          </Link>

          {/* Language Toggle */}
          <div className="flex bg-soft-blue p-1 rounded-xl border border-joy-blue/10">
            <button
              onClick={() => setLanguage("it")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'it' ? 'bg-joy-blue text-white shadow-md' : 'text-joy-blue opacity-50'}`}
            >
              ITA
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'es' ? 'bg-joy-blue text-white shadow-md' : 'text-joy-blue opacity-50'}`}
            >
              ESP
            </button>
          </div>
          <Trophy className="text-game-orange w-8 h-8" />
        </div>
      </header>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 leading-tight">
            {t("learn_spanish")} <br />
            <span className="text-game-orange">{t("playing_alone")}</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {t("subtitle")}
          </p>
          <div className="flex gap-4">
            <Link href="/games/word-order" className="btn-primary flex items-center gap-2">
              <Play fill="currentColor" size={20} />
              {t("start_game")}
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute inset-0 bg-soft-blue rounded-full filter blur-3xl opacity-30 -z-10 animate-pulse" />
          <div className="animate-mascot">
            <Image
              src="/assets/mascot.png"
              alt="Mascot"
              width={400}
              height={400}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          title={t("grammar")}
          desc={t("grammar_desc")}
          icon={<BookOpen className="text-joy-blue" size={32} />}
          color="border-joy-blue"
          href="/games/grammar"
        />
        <GameCard
          title={t("word_order")}
          desc={t("word_order_desc")}
          icon={<MessageSquare className="text-game-orange" size={32} />}
          color="border-game-orange"
          href="/games/word-order"
        />
        <GameCard
          title={t("verbs")}
          desc={t("verbs_desc")}
          icon={<Languages className="text-purple-500" size={32} />}
          color="border-purple-500"
          href="/games/verbs"
        />
        <GameCard
          title={t("pronouns")}
          desc={t("pronouns_desc")}
          icon={<UserCircle className="text-pink-500" size={32} />}
          color="border-pink-500"
          href="/games/pronouns"
        />
        <GameCard
          title={t("places")}
          desc={t("places_desc")}
          icon={<MapPin className="text-teal-500" size={32} />}
          color="border-teal-500"
          href="/games/places"
        />
        <GameCard
          title={t("presentation")}
          desc={t("presentation_desc")}
          icon={<Trophy className="text-success-green" size={32} />}
          color="border-success-green"
          href="/presentation"
        />
      </div>
    </main>
  );
}

function GameCard({ title, desc, icon, color, href }: { title: string, desc: string, icon: any, color: string, href: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`card-fancy cursor-pointer border-b-8 ${color} flex flex-col items-center text-center h-full`}
      >
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-400 mt-2">{desc}</p>
      </motion.div>
    </Link>
  );
}
