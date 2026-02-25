"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Star, Heart, Flame, CheckCircle2, XCircle,
    Timer, Trophy, Zap, RefreshCw, Lock, ChevronRight
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import {
    getVerbExercises, TENSE_INFO,
    type TenseKey, type MultipleChoiceExercise
} from "@/data/verbs";

type GamePhase = "menu" | "playing" | "result";

export default function VerbConjugationGame() {
    const { t } = useLanguage();
    const { currentUser, addXP, recordAttempt } = useUser();

    // Game state
    const [phase, setPhase] = useState<GamePhase>("menu");
    const [selectedTense, setSelectedTense] = useState<TenseKey | "all">("all");
    const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
    const [exercises, setExercises] = useState<MultipleChoiceExercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [mistakeLog, setMistakeLog] = useState<MultipleChoiceExercise[]>([]);

    // Timer effect
    useEffect(() => {
        if (!timerActive || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // Time's up = wrong
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const handleTimeUp = () => {
        if (status !== "playing") return;
        setStatus("wrong");
        setTimerActive(false);
        setLives(prev => Math.max(0, prev - 1));
        setStreak(0);
        setTotalAnswered(prev => prev + 1);
        if (exercises[currentIndex]) {
            setMistakeLog(prev => [...prev, exercises[currentIndex]]);
        }
    };

    const startGame = useCallback((tense: TenseKey | "all", diff: 1 | 2 | 3, timer: boolean) => {
        const count = diff === 3 ? 8 : diff === 2 ? 6 : 5;
        const exs = getVerbExercises(tense, diff, count);
        setExercises(exs);
        setCurrentIndex(0);
        setLives(3);
        setStreak(0);
        setScore(0);
        setStatus("playing");
        setSelectedOption(null);
        setTotalCorrect(0);
        setTotalAnswered(0);
        setMistakeLog([]);
        setShowTimer(timer);
        if (timer) {
            setTimeLeft(diff === 3 ? 10 : diff === 2 ? 15 : 20);
            setTimerActive(true);
        }
        setPhase("playing");
    }, []);

    const handleAnswer = (option: string) => {
        if (status !== "playing") return;
        setSelectedOption(option);
        setTimerActive(false);
        setTotalAnswered(prev => prev + 1);
        const exercise = exercises[currentIndex];

        if (option === exercise.correct) {
            setStatus("correct");
            const bonus = streak >= 3 ? 5 : 0;
            const points = 10 + bonus;
            setScore(prev => prev + points);
            setStreak(prev => prev + 1);
            setTotalCorrect(prev => prev + 1);
            if (currentUser) {
                addXP(points);
                recordAttempt("grammar", true);
            }
        } else {
            setStatus("wrong");
            setStreak(0);
            setLives(prev => Math.max(0, prev - 1));
            setMistakeLog(prev => [...prev, exercise]);
            if (currentUser) {
                recordAttempt("grammar", false);
            }
        }
    };

    const nextExercise = () => {
        if (lives <= 0 || currentIndex >= exercises.length - 1) {
            // End game
            if (totalCorrect === exercises.length) {
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ["#ff8c42", "#3b82f6", "#22c55e"] });
            }
            setPhase("result");
            return;
        }
        setCurrentIndex(prev => prev + 1);
        setStatus("playing");
        setSelectedOption(null);
        if (showTimer) {
            setTimeLeft(difficulty === 3 ? 10 : difficulty === 2 ? 15 : 20);
            setTimerActive(true);
        }
    };

    // ======================== MENU ========================
    if (phase === "menu") {
        const tenseKeys = Object.keys(TENSE_INFO) as TenseKey[];
        return (
            <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm border-2 border-soft-blue text-joy-blue hover:text-joy-blue-hover transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800">🇪🇸 Tiempos Verbales</h1>
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

                {/* Timer toggle */}
                <div className="card-fancy mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-slate-700">⏱️ Timer Challenge</h2>
                        <p className="text-sm text-slate-400">Rispondi prima che scada il tempo!</p>
                    </div>
                    <button
                        onClick={() => setShowTimer(!showTimer)}
                        className={`w-14 h-8 rounded-full transition-all duration-200 ${showTimer ? "bg-game-orange" : "bg-slate-200"}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${showTimer ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                </div>

                {/* Tense selection */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => { setSelectedTense("all"); startGame("all", difficulty, showTimer); }}
                        className="w-full card-fancy border-b-8 border-game-orange hover:scale-[1.02] transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-800">Tutti i Tempi (Mix)</h3>
                                    <p className="text-sm text-slate-400">Sfida con tutti i tempi verbali mescolati</p>
                                </div>
                            </div>
                            <ChevronRight className="text-game-orange" />
                        </div>
                    </button>

                    {tenseKeys.map(key => {
                        const info = TENSE_INFO[key];
                        return (
                            <button
                                key={key}
                                onClick={() => { setSelectedTense(key); startGame(key, difficulty, showTimer); }}
                                className="w-full card-fancy hover:scale-[1.02] transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{info.emoji}</span>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-800">{info.name}</h3>
                                            <p className="text-sm text-slate-400">{info.description}</p>
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

                    {/* Stars */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map(i => (
                            <Star key={i} size={40} className={i <= stars ? "text-game-orange fill-game-orange" : "text-slate-200"} />
                        ))}
                    </div>

                    {/* Mistake review */}
                    {mistakeLog.length > 0 && (
                        <div className="text-left space-y-2">
                            <h3 className="font-bold text-red-500 flex items-center gap-2"><RefreshCw size={16} /> Ripassa questi:</h3>
                            {mistakeLog.map((m, i) => (
                                <div key={i} className="bg-red-50 rounded-xl p-3 border border-red-100">
                                    <p className="text-sm font-medium text-slate-700">{m.sentence.replace("___", `<strong>${m.correct}</strong>`)}</p>
                                    <p className="text-xs text-slate-400 mt-1">{m.explanation}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => startGame(selectedTense, difficulty, showTimer)} className="btn-primary flex-1 flex items-center justify-center gap-2">
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

    const tenseColor = TENSE_INFO[exercise.tense]?.color || "#3b82f6";
    const tenseName = TENSE_INFO[exercise.tense]?.name || exercise.tense;
    const progress = ((currentIndex) / exercises.length) * 100;

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col">
            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setPhase("menu")} className="p-2 bg-white rounded-xl border-2 border-soft-blue text-slate-400 hover:text-joy-blue transition-colors">
                    <XCircle size={20} />
                </button>

                {/* Progress bar */}
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: tenseColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Lives */}
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <Heart key={i} size={20} className={i <= lives ? "text-red-500 fill-red-500" : "text-slate-200"} />
                    ))}
                </div>
            </div>

            {/* Streak & Score */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
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

            {/* Timer */}
            {showTimer && status === "playing" && (
                <div className="mb-4">
                    <div className={`h-2 rounded-full overflow-hidden ${timeLeft <= 5 ? "bg-red-100" : "bg-slate-100"}`}>
                        <motion.div
                            className={`h-full rounded-full ${timeLeft <= 5 ? "bg-red-500" : "bg-joy-blue"}`}
                            initial={{ width: "100%" }}
                            animate={{ width: `${(timeLeft / (difficulty === 3 ? 10 : difficulty === 2 ? 15 : 20)) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className={`text-center text-sm font-bold mt-1 ${timeLeft <= 5 ? "text-red-500" : "text-slate-400"}`}>
                        <Timer size={14} className="inline mr-1" />{timeLeft}s
                    </p>
                </div>
            )}

            {/* Tense badge */}
            <div className="flex justify-center mb-4">
                <span className="px-4 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: tenseColor }}>
                    {TENSE_INFO[exercise.tense]?.emoji} {tenseName}
                </span>
            </div>

            {/* Exercise */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-6 flex-1"
                >
                    {/* Sentence card */}
                    <div className="card-fancy text-center">
                        <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                            {exercise.sentence.split("___").map((part, i, arr) => (
                                <span key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                        <span className="inline-block min-w-[80px] mx-1 border-b-4 border-dashed text-center font-black"
                                            style={{ borderColor: tenseColor, color: tenseColor }}>
                                            {status !== "playing" ? exercise.correct : "..."}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-3">
                        {exercise.options.map((option) => {
                            let optionStyle = "bg-white border-soft-blue hover:border-joy-blue cursor-pointer";
                            if (status !== "playing") {
                                if (option === exercise.correct) {
                                    optionStyle = "bg-success-green/10 border-success-green text-success-green";
                                } else if (option === selectedOption) {
                                    optionStyle = "bg-red-50 border-red-400 text-red-500";
                                } else {
                                    optionStyle = "bg-white border-soft-blue opacity-40";
                                }
                            }
                            return (
                                <button
                                    key={option}
                                    disabled={status !== "playing"}
                                    onClick={() => handleAnswer(option)}
                                    className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all ${optionStyle}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    <AnimatePresence>
                        {status !== "playing" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className={`card-fancy p-4 relative overflow-hidden ${status === "correct" ? "border-success-green" : "border-red-400"}`}>
                                    <div className={`absolute top-0 left-0 w-2 h-full ${status === "correct" ? "bg-success-green" : "bg-red-500"}`} />
                                    <div className="flex items-center gap-2 mb-2">
                                        {status === "correct" ? (
                                            <span className="flex items-center gap-2 text-success-green font-black">
                                                <CheckCircle2 size={20} /> ¡Correcto! {streak >= 3 && `+5 bonus`}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-red-500 font-black">
                                                <XCircle size={20} /> La respuesta era: <span className="text-success-green">{exercise.correct}</span>
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
