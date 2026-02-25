"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, CheckCircle2, XCircle, Heart, Flame,
    Zap, RefreshCw, Star, ChevronRight, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import {
    getPronounExercises, PRONOUN_CATEGORY_INFO,
    type PronounCategory, type PronounExercise
} from "@/data/pronouns";

type Phase = "menu" | "playing" | "result";

export default function PronounGame() {
    const { t } = useLanguage();
    const { currentUser, addXP, recordAttempt } = useUser();

    const [phase, setPhase] = useState<Phase>("menu");
    const [selectedCategory, setSelectedCategory] = useState<PronounCategory | "all">("all");
    const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
    const [exercises, setExercises] = useState<PronounExercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [mistakeLog, setMistakeLog] = useState<PronounExercise[]>([]);
    // For "correct the error" mode
    const [userChoice, setUserChoice] = useState<"correct" | "wrong" | null>(null);

    const startGame = useCallback((cat: PronounCategory | "all", diff: 1 | 2 | 3) => {
        const exs = getPronounExercises(cat, diff, 6);
        setExercises(exs);
        setCurrentIndex(0);
        setLives(3);
        setStreak(0);
        setScore(0);
        setStatus("playing");
        setSelectedOption(null);
        setUserChoice(null);
        setTotalCorrect(0);
        setTotalAnswered(0);
        setMistakeLog([]);
        setPhase("playing");
    }, []);

    const handleChoiceAnswer = (option: string) => {
        if (status !== "playing") return;
        setSelectedOption(option);
        setTotalAnswered(prev => prev + 1);
        const exercise = exercises[currentIndex];

        if (option === exercise.correct) {
            setStatus("correct");
            const bonus = streak >= 3 ? 5 : 0;
            setScore(prev => prev + 10 + bonus);
            setStreak(prev => prev + 1);
            setTotalCorrect(prev => prev + 1);
            if (currentUser) { addXP(10 + bonus); recordAttempt("grammar", true); }
        } else {
            setStatus("wrong");
            setStreak(0);
            setLives(prev => Math.max(0, prev - 1));
            setMistakeLog(prev => [...prev, exercise]);
            if (currentUser) { recordAttempt("grammar", false); }
        }
    };

    const handleCorrectAnswer = (choice: "correct" | "wrong") => {
        if (status !== "playing") return;
        setUserChoice(choice);
        setTotalAnswered(prev => prev + 1);
        const exercise = exercises[currentIndex];

        // If the sentence shown is the wrongVersion, the sentence IS wrong
        // If user says "wrong" and it IS wrong, they are correct
        const sentenceIsWrong = !!exercise.wrongVersion;
        const userIsCorrect = (choice === "wrong" && sentenceIsWrong) || (choice === "correct" && !sentenceIsWrong);

        if (userIsCorrect) {
            setStatus("correct");
            const bonus = streak >= 3 ? 5 : 0;
            setScore(prev => prev + 10 + bonus);
            setStreak(prev => prev + 1);
            setTotalCorrect(prev => prev + 1);
            if (currentUser) { addXP(10 + bonus); recordAttempt("grammar", true); }
        } else {
            setStatus("wrong");
            setStreak(0);
            setLives(prev => Math.max(0, prev - 1));
            setMistakeLog(prev => [...prev, exercise]);
            if (currentUser) { recordAttempt("grammar", false); }
        }
    };

    const nextExercise = () => {
        if (lives <= 0 || currentIndex >= exercises.length - 1) {
            if (totalCorrect >= exercises.length - 1) {
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ["#ff8c42", "#3b82f6", "#22c55e"] });
            }
            setPhase("result");
            return;
        }
        setCurrentIndex(prev => prev + 1);
        setStatus("playing");
        setSelectedOption(null);
        setUserChoice(null);
    };

    // ======================== MENU ========================
    if (phase === "menu") {
        const categories = Object.keys(PRONOUN_CATEGORY_INFO) as PronounCategory[];
        return (
            <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm border-2 border-soft-blue text-joy-blue hover:text-joy-blue-hover transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800">👤 Pronombres</h1>
                </div>

                {/* Difficulty */}
                <div className="card-fancy mb-6">
                    <h2 className="font-bold text-slate-700 mb-3">Difficoltà</h2>
                    <div className="flex gap-3">
                        {([1, 2, 3] as const).map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`flex-1 py-3 rounded-2xl font-bold transition-all border-2 ${difficulty === d
                                    ? "bg-joy-blue text-white border-joy-blue shadow-lg scale-105"
                                    : "bg-white text-slate-500 border-soft-blue hover:border-joy-blue/40"
                                    }`}
                            >
                                {d === 1 ? "⭐ Fácil" : d === 2 ? "⭐⭐ Medio" : "⭐⭐⭐ Difícil"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category cards */}
                <div className="space-y-3">
                    <button
                        onClick={() => { setSelectedCategory("all"); startGame("all", difficulty); }}
                        className="w-full card-fancy border-b-8 border-game-orange hover:scale-[1.02] transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-800">Tutti i Pronomi (Mix)</h3>
                                    <p className="text-sm text-slate-400">Sfida con tutte le categorie mescolate</p>
                                </div>
                            </div>
                            <ChevronRight className="text-game-orange" />
                        </div>
                    </button>

                    {categories.map(key => {
                        const info = PRONOUN_CATEGORY_INFO[key];
                        return (
                            <button
                                key={key}
                                onClick={() => { setSelectedCategory(key); startGame(key, difficulty); }}
                                className="w-full card-fancy hover:scale-[1.02] transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{info.emoji}</span>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-800">{info.name}</h3>
                                            <p className="text-sm text-slate-400">{info.examples}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-slate-300" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </main>
        );
    }

    // ======================== RESULT ========================
    if (phase === "result") {
        const percentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
        const stars = percentage >= 90 ? 3 : percentage >= 60 ? 2 : percentage >= 30 ? 1 : 0;

        return (
            <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col items-center justify-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-fancy w-full text-center space-y-6">
                    <div className="text-6xl mb-2">
                        {stars === 3 ? "🏆" : stars === 2 ? "⭐" : stars === 1 ? "💪" : "😢"}
                    </div>
                    <h1 className="text-3xl font-black text-slate-800">
                        {stars === 3 ? "¡Perfecto!" : stars === 2 ? "¡Muy bien!" : stars === 1 ? "¡Buen intento!" : "¡Sigue practicando!"}
                    </h1>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-soft-blue rounded-2xl p-4">
                            <p className="text-2xl font-black text-joy-blue">{totalCorrect}/{totalAnswered}</p>
                            <p className="text-xs text-slate-400 font-medium">Corrette</p>
                        </div>
                        <div className="bg-game-orange/10 rounded-2xl p-4">
                            <p className="text-2xl font-black text-game-orange">{score}</p>
                            <p className="text-xs text-slate-400 font-medium">Punti XP</p>
                        </div>
                        <div className="bg-success-green/10 rounded-2xl p-4">
                            <p className="text-2xl font-black text-success-green">{percentage}%</p>
                            <p className="text-xs text-slate-400 font-medium">Precisione</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map(i => (
                            <Star key={i} size={40} className={i <= stars ? "text-game-orange fill-game-orange" : "text-slate-200"} />
                        ))}
                    </div>

                    {mistakeLog.length > 0 && (
                        <div className="text-left space-y-2">
                            <h3 className="font-bold text-red-500 flex items-center gap-2"><RefreshCw size={16} /> Ripassa:</h3>
                            {mistakeLog.map((m, i) => (
                                <div key={i} className="bg-red-50 rounded-xl p-3 border border-red-100">
                                    <p className="text-sm font-medium text-slate-700">{m.sentence}</p>
                                    <p className="text-xs text-slate-400 mt-1">✅ {m.correct} — {m.explanation}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => startGame(selectedCategory, difficulty)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            <RefreshCw size={18} /> Rigioca
                        </button>
                        <button onClick={() => setPhase("menu")} className="btn-secondary flex-1">
                            Menu
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    // ======================== PLAYING ========================
    const exercise = exercises[currentIndex];
    if (!exercise) return null;

    const catInfo = PRONOUN_CATEGORY_INFO[exercise.category];
    const progress = ((currentIndex) / exercises.length) * 100;
    const isCorrectType = exercise.type === "correct";

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col">
            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setPhase("menu")} className="p-2 bg-white rounded-xl border-2 border-soft-blue text-slate-400 hover:text-joy-blue transition-colors">
                    <XCircle size={20} />
                </button>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: catInfo?.color || "#3b82f6" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <Heart key={i} size={20} className={i <= lives ? "text-red-500 fill-red-500" : "text-slate-200"} />
                    ))}
                </div>
            </div>

            {/* Streak & Score */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    {streak >= 2 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 bg-game-orange/10 text-game-orange px-3 py-1 rounded-full font-bold text-sm">
                            <Flame size={16} fill="currentColor" /> {streak} streak!
                        </motion.div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-joy-blue font-bold text-sm">
                    <Zap size={16} /> {score} XP
                </div>
            </div>

            {/* Category badge */}
            <div className="flex justify-center mb-4">
                <span className="px-4 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: catInfo?.color }}>
                    {catInfo?.emoji} {catInfo?.name}
                </span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-6 flex-1"
                >
                    {isCorrectType ? (
                        /* "Correct the error" mode */
                        <>
                            <div className="card-fancy text-center">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <AlertTriangle size={20} className="text-game-orange" />
                                    <span className="font-bold text-game-orange text-sm">¿Esta frase es correcta?</span>
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                                    {exercise.wrongVersion || exercise.sentence}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {["correct", "wrong"].map(choice => {
                                    let style = "bg-white border-soft-blue hover:border-joy-blue cursor-pointer";
                                    if (status !== "playing" && userChoice) {
                                        const sentenceIsWrong = !!exercise.wrongVersion;
                                        const thisIsRight = (choice === "wrong" && sentenceIsWrong) || (choice === "correct" && !sentenceIsWrong);
                                        if (thisIsRight) style = "bg-success-green/10 border-success-green text-success-green";
                                        else if (choice === userChoice) style = "bg-red-50 border-red-400 text-red-500";
                                        else style = "bg-white border-soft-blue opacity-40";
                                    }
                                    return (
                                        <button
                                            key={choice}
                                            disabled={status !== "playing"}
                                            onClick={() => handleCorrectAnswer(choice as "correct" | "wrong")}
                                            className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all ${style}`}
                                        >
                                            {choice === "correct" ? "✅ Correcta" : "❌ Incorrecta"}
                                        </button>
                                    );
                                })}
                            </div>

                            {status !== "playing" && exercise.wrongVersion && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-fancy bg-success-green/5 border-success-green p-4">
                                    <p className="font-bold text-success-green text-sm mb-1">Frase corretta:</p>
                                    <p className="text-slate-700 font-medium">{exercise.correct}</p>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        /* Multiple choice mode */
                        <>
                            <div className="card-fancy text-center">
                                <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                                    {exercise.sentence.split("___").map((part, i, arr) => (
                                        <span key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <span className="inline-block min-w-[60px] mx-1 border-b-4 border-dashed text-center font-black"
                                                    style={{ borderColor: catInfo?.color, color: catInfo?.color }}>
                                                    {status !== "playing" ? exercise.correct : "..."}
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {exercise.options?.map(option => {
                                    let style = "bg-white border-soft-blue hover:border-joy-blue cursor-pointer";
                                    if (status !== "playing") {
                                        if (option === exercise.correct) style = "bg-success-green/10 border-success-green text-success-green";
                                        else if (option === selectedOption) style = "bg-red-50 border-red-400 text-red-500";
                                        else style = "bg-white border-soft-blue opacity-40";
                                    }
                                    return (
                                        <button
                                            key={option}
                                            disabled={status !== "playing"}
                                            onClick={() => handleChoiceAnswer(option)}
                                            className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all ${style}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Feedback */}
                    <AnimatePresence>
                        {status !== "playing" && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className={`card-fancy p-4 relative overflow-hidden ${status === "correct" ? "border-success-green" : "border-red-400"}`}>
                                    <div className={`absolute top-0 left-0 w-2 h-full ${status === "correct" ? "bg-success-green" : "bg-red-500"}`} />
                                    <div className="flex items-center gap-2 mb-2">
                                        {status === "correct" ? (
                                            <span className="flex items-center gap-2 text-success-green font-black">
                                                <CheckCircle2 size={20} /> ¡Correcto!
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-red-500 font-black">
                                                <XCircle size={20} /> Respuesta: <span className="text-success-green">{exercise.correct}</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{exercise.explanation}</p>
                                </div>
                                <button onClick={nextExercise} className="btn-primary w-full text-lg">
                                    {currentIndex >= exercises.length - 1 || lives <= 0 ? "Ver resultados" : "Siguiente →"}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
