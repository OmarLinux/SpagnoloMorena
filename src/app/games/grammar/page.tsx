"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowLeft, RefreshCw, Star, XCircle } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getGrammarMatch, VocabularyItem } from "@/data/dataset";

type GuessKey = `${string}-${string}`;

export default function GrammarMatchGame() {
    const [exercise, setExercise] = useState<{ exercise: VocabularyItem[] } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
    const [selectedGuess, setSelectedGuess] = useState<GuessKey | null>(null);
    const [difficulty, setDifficulty] = useState(1);
    const { t } = useLanguage();
    const { currentUser, addXP, recordAttempt } = useUser();

    const fetchExercise = (diff?: number) => {
        const targetDiff = (typeof diff === 'number') ? diff : difficulty;
        const data = getGrammarMatch(targetDiff);
        setExercise(data);
        setCurrentIndex(0);
        setStatus("playing");
        setSelectedGuess(null);
    };

    useEffect(() => {
        fetchExercise();
    }, []);

    const changeDifficulty = (newDiff: number) => {
        setDifficulty(newDiff);
        fetchExercise(newDiff);
    };

    const handleGuess = (gender: string, plurality: string) => {
        if (!exercise || status !== "playing") return;
        const currentWord = exercise.exercise[currentIndex];
        const guessKey: GuessKey = `${gender}-${plurality}`;
        setSelectedGuess(guessKey);

        const isCorrectGender = currentWord.gender === gender || currentWord.gender === "both";
        const isCorrectPlurality = currentWord.plurality === plurality;

        if (isCorrectGender && isCorrectPlurality) {
            setStatus("correct");

            if (currentUser) {
                addXP(10);
                recordAttempt("grammar", true);
            }

            if (currentIndex === exercise.exercise.length - 1) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#ff8c42", "#3b82f6", "#22c55e"],
                });
            }
        } else {
            setStatus("wrong");
            if (currentUser) {
                recordAttempt("grammar", false);
            }
        }
    };

    const nextWord = () => {
        if (currentIndex < (exercise?.exercise.length || 0) - 1) {
            setCurrentIndex(prev => prev + 1);
            setStatus("playing");
            setSelectedGuess(null);
        } else {
            fetchExercise();
        }
    };

    if (!exercise) return <div className="p-8 text-center font-bold text-slate-400">{t("loading")}</div>;

    const currentWord = exercise.exercise[currentIndex];

    const getButtonStyle = (gender: string, plurality: string): { className: string; style: React.CSSProperties } => {
        const key: GuessKey = `${gender}-${plurality}`;
        const base = "rounded-3xl p-6 shadow-xl border-4 transition-all duration-200";

        if (status === "playing") {
            return {
                className: `${base} bg-white border-soft-blue hover:border-joy-blue cursor-pointer`,
                style: {}
            };
        }

        if (selectedGuess === key) {
            if (status === "correct") {
                return {
                    className: `${base} border-transparent font-bold transform scale-105 shadow-2xl`,
                    style: { backgroundColor: "#22c55e", borderColor: "#16a34a", color: "white" }
                };
            }
            // wrong
            return {
                className: `${base} border-transparent font-bold`,
                style: { backgroundColor: "#ef4444", borderColor: "#dc2626", color: "white" }
            };
        }

        // Not selected, after answer
        return {
            className: `${base} bg-white border-soft-blue opacity-40`,
            style: {}
        };
    };

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm border-2 border-soft-blue text-joy-blue hover:text-joy-blue-hover transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="px-6 py-2 bg-joy-blue/10 text-joy-blue font-bold rounded-full border-2 border-joy-blue/20 flex items-center gap-2">
                        <Star size={18} fill="currentColor" /> {t("grammar")}
                    </div>
                </div>

                {/* Difficulty Selector */}
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border-2 border-soft-blue overflow-hidden">
                    {[1, 2, 3].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => changeDifficulty(lvl)}
                            className={`px-4 py-2 text-xs font-black transition-all ${difficulty === lvl
                                ? 'bg-joy-blue text-white shadow-inner'
                                : 'text-slate-400 hover:bg-soft-blue'
                                }`}
                        >
                            {lvl === 1 ? 'EASY' : lvl === 2 ? 'MED' : 'HARD'}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full text-center space-y-12"
            >
                <div className="space-y-4">
                    <h1 className="text-2xl font-black text-slate-400 uppercase tracking-widest">{t("match_type")}</h1>
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-b-[12px] border-soft-blue">
                        <span className="text-6xl font-black text-slate-800 capitalize leading-none">{currentWord.word}</span>
                        <p className="text-xl text-slate-400 mt-6 md:mt-4 font-medium italic">"{currentWord.translation}"</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {([["m", "s", "m_s"], ["f", "s", "f_s"], ["m", "p", "m_p"], ["f", "p", "f_p"]] as const).map(([g, p, label]) => {
                        const { className, style } = getButtonStyle(g, p);
                        return (
                            <button
                                key={`${g}-${p}`}
                                disabled={status !== "playing"}
                                onClick={() => handleGuess(g, p)}
                                className={className}
                                style={style}
                            >
                                <span className="block text-lg font-bold">{t(label)}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="min-h-[120px]">
                    <AnimatePresence mode="wait">
                        {status !== "playing" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="card-fancy bg-white border-soft-blue p-6 text-left relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-2 h-full ${status === 'correct' ? 'bg-success-green' : 'bg-red-500'}`} />

                                    <div className="flex items-center gap-3 mb-2">
                                        {status === "correct" ? (
                                            <div className="flex items-center gap-2 text-success-green font-black text-xl">
                                                <CheckCircle2 size={24} /> {t("excellent")} +10 XP
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 font-black text-xl">
                                                <XCircle size={24} /> {t("wrong")}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        {currentWord.explanation || "Questa parola segue le regole standard di genere e numero in spagnolo."}
                                    </p>
                                </div>

                                <button onClick={nextWord} className="btn-primary w-full max-w-xs mx-auto">
                                    {t("next")}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    );
}
