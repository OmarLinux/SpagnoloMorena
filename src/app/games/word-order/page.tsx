"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowLeft, RefreshCw, Star } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getWordOrder, validateWordOrder, SentenceItem } from "@/data/dataset";

export default function WordOrderGame() {
    const [exercise, setExercise] = useState<SentenceItem | null>(null);
    const [pool, setPool] = useState<string[]>([]);
    const [sentence, setSentence] = useState<string[]>([]);
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
    const [difficulty, setDifficulty] = useState(1);
    const [xpEarned, setXpEarned] = useState(0);
    const { t } = useLanguage();
    const { currentUser, addXP, recordAttempt } = useUser();

    const fetchExercise = useCallback((diff?: number) => {
        setStatus("playing");
        setXpEarned(0);
        setSentence([]);
        const targetDiff = (typeof diff === 'number') ? diff : difficulty;

        const data = getWordOrder(targetDiff);
        setExercise(data);
        setPool(data.words);
        setSentence([]);
    }, [difficulty]);

    useEffect(() => {
        fetchExercise();
    }, [fetchExercise]);

    const changeDifficulty = (newDiff: number) => {
        setDifficulty(newDiff);
        fetchExercise(newDiff);
    };

    const addWord = (word: string, index: number) => {
        if (status !== "playing") return;
        setPool(prev => prev.filter((_, i) => i !== index));
        setSentence(prev => [...prev, word]);
    };

    const removeWord = (word: string, index: number) => {
        if (status !== "playing") return;
        setSentence(prev => prev.filter((_, i) => i !== index));
        setPool(prev => [...prev, word]);
    };

    const handleCheck = () => {
        if (!exercise || sentence.length === 0) return;

        const result = validateWordOrder(exercise.id, sentence);

        if (result.correct) {
            setStatus("correct");
            setXpEarned(10);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#ff8c42", "#3b82f6", "#22c55e"],
            });

            if (currentUser) {
                addXP(10);
                recordAttempt("word_order", true);
            }
        } else {
            setStatus("wrong");
            if (currentUser) {
                recordAttempt("word_order", false);
            }
        }
    };

    if (!exercise) return <div className="p-8 text-center font-bold text-slate-400">{t("loading")}</div>;

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm border-2 border-soft-blue text-joy-blue hover:text-joy-blue-hover transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="px-6 py-2 bg-success-green/10 text-success-green font-bold rounded-full border-2 border-success-green/20 flex items-center gap-2">
                        <Star size={18} fill="currentColor" /> {t("word_order")}
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
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-center space-y-8"
            >
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-800">{t("start_game")}!</h1>
                    <p className="text-lg text-slate-400 font-medium italic">"{exercise.translation}"</p>
                </div>

                {/* Built sentence area */}
                <div className="card-fancy min-h-[80px] flex flex-wrap justify-center items-center gap-2 relative">
                    {sentence.length === 0 && (
                        <span className="text-slate-300 font-medium italic text-sm">Clicca le parole per costruire la frase...</span>
                    )}
                    <AnimatePresence>
                        {sentence.map((word, i) => (
                            <motion.button
                                key={`s-${word}-${i}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                onClick={() => removeWord(word, i)}
                                className="px-5 py-2.5 bg-joy-blue text-white font-bold rounded-2xl shadow-md cursor-pointer hover:bg-joy-blue-hover active:scale-95 transition-all duration-100 border-2 border-joy-blue/50"
                            >
                                {word}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Word pool */}
                <div className="flex flex-wrap justify-center gap-2 min-h-[60px]">
                    <AnimatePresence>
                        {pool.map((word, i) => (
                            <motion.button
                                key={`p-${word}-${i}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                onClick={() => addWord(word, i)}
                                className="px-5 py-2.5 bg-[var(--soft-blue)] text-joy-blue font-bold rounded-2xl shadow-sm cursor-pointer border-2 border-joy-blue/10 hover:border-joy-blue/40 hover:shadow-md active:scale-95 transition-all duration-100"
                            >
                                {word}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="pt-4 flex flex-col items-center gap-6">
                    <AnimatePresence mode="wait">
                        {status === "playing" ? (
                            <motion.button
                                key="check"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={handleCheck}
                                disabled={sentence.length === 0}
                                className={`btn-primary w-full max-w-xs text-xl ${sentence.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                {t("check")}
                            </motion.button>
                        ) : status === "correct" ? (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="flex items-center gap-2 text-success-green font-black text-2xl">
                                    <CheckCircle2 size={32} /> {t("excellent")} +10 XP
                                </div>
                                <button onClick={() => fetchExercise()} className="btn-secondary w-full max-w-xs flex items-center justify-center gap-2">
                                    {t("next")} <RefreshCw size={20} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="error"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="text-game-orange font-black text-2xl">
                                    {t("almost")}
                                </div>
                                <button onClick={() => {
                                    setStatus("playing");
                                    // Reset: put all words back to pool
                                    if (exercise) {
                                        setPool(exercise.words);
                                        setSentence([]);
                                    }
                                }} className="btn-secondary w-full max-w-xs">
                                    {t("retry")}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    );
}
