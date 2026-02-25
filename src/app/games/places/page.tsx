"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, CheckCircle2, XCircle, Heart, Flame,
    Zap, RefreshCw, Star, MapPin
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getPlaceExercises, PLACE_INFO, type PlaceExercise } from "@/data/places";

type Phase = "intro" | "playing" | "result";

export default function PlaceGame() {
    const { t } = useLanguage();
    const { currentUser, addXP, recordAttempt } = useUser();

    const [phase, setPhase] = useState<Phase>("intro");
    const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
    const [exercises, setExercises] = useState<PlaceExercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [mistakeLog, setMistakeLog] = useState<PlaceExercise[]>([]);
    // For "correct" type exercises
    const [userChoice, setUserChoice] = useState<"correct" | "wrong" | null>(null);

    const startGame = useCallback((diff: 1 | 2 | 3) => {
        const count = diff === 3 ? 8 : diff === 2 ? 7 : 5;
        const exs = getPlaceExercises(diff, count);
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

        if (option.toLowerCase() === exercise.correct.toLowerCase()) {
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
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ["#22c55e", "#f59e0b", "#8b5cf6"] });
            }
            setPhase("result");
            return;
        }
        setCurrentIndex(prev => prev + 1);
        setStatus("playing");
        setSelectedOption(null);
        setUserChoice(null);
    };

    // ======================== INTRO ========================
    if (phase === "intro") {
        return (
            <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm border-2 border-soft-blue text-joy-blue hover:text-joy-blue-hover transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800">📍 Aquí, Ahí, Allí</h1>
                </div>

                {/* Visual explanation cards */}
                <div className="space-y-4 mb-8">
                    {(["aquí", "ahí", "allí"] as const).map(key => {
                        const info = PLACE_INFO[key];
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: key === "aquí" ? 0 : key === "ahí" ? 0.1 : 0.2 }}
                                className="card-fancy relative overflow-hidden"
                                style={{ borderLeftWidth: "6px", borderLeftColor: info.color }}
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{info.emoji}</span>
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl text-slate-800">{info.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium mb-2">{info.meaning}</p>
                                        <p className="text-sm text-slate-600">{info.rule}</p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {info.examples.map((ex, i) => (
                                                <span key={i} className="text-xs px-3 py-1 rounded-full font-bold text-white" style={{ backgroundColor: info.color }}>
                                                    {ex}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Visual distance diagram */}
                <div className="card-fancy mb-8">
                    <h3 className="font-bold text-slate-700 mb-4 text-center">Distanza visiva</h3>
                    <div className="flex items-end justify-between px-4">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🧑</div>
                            <div className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: PLACE_INFO.aquí.color }}>
                                AQUÍ
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Vicino a me</p>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2 mt-4" />
                        <div className="text-center">
                            <div className="text-4xl mb-2">👤</div>
                            <div className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: PLACE_INFO.ahí.color }}>
                                AHÍ
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Vicino a te</p>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2 mt-4" />
                        <div className="text-center">
                            <div className="text-4xl mb-2">🏔️</div>
                            <div className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: PLACE_INFO.allí.color }}>
                                ALLÍ
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Lontano</p>
                        </div>
                    </div>
                </div>

                {/* Difficulty & Start */}
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
                                {d === 1 ? "⭐" : d === 2 ? "⭐⭐" : "⭐⭐⭐"}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={() => startGame(difficulty)} className="btn-primary w-full text-xl flex items-center justify-center gap-3">
                    <MapPin size={24} /> ¡Empezar!
                </button>
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
                        {stars === 3 ? "🗺️" : stars === 2 ? "📍" : stars === 1 ? "🧭" : "😢"}
                    </div>
                    <h1 className="text-3xl font-black text-slate-800">
                        {stars === 3 ? "¡Experto en ubicación!" : stars === 2 ? "¡Muy bien!" : stars === 1 ? "¡Buen intento!" : "¡Sigue practicando!"}
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
                                    <p className="text-xs text-slate-500 italic mb-1">{m.context}</p>
                                    <p className="text-sm font-medium text-slate-700">{m.sentence}</p>
                                    <p className="text-xs text-slate-400 mt-1">✅ {m.correct} — {m.explanation}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => startGame(difficulty)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            <RefreshCw size={18} /> Rigioca
                        </button>
                        <button onClick={() => setPhase("intro")} className="btn-secondary flex-1">
                            Guida
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    // ======================== PLAYING ========================
    const exercise = exercises[currentIndex];
    if (!exercise) return null;

    const progress = ((currentIndex) / exercises.length) * 100;
    const isCorrectType = exercise.type === "correct";

    // Determine color for the scenario
    const correctWord = exercise.correct.toLowerCase();
    const scenarioColor = correctWord === "aquí" ? PLACE_INFO.aquí.color
        : correctWord === "ahí" ? PLACE_INFO.ahí.color
            : PLACE_INFO.allí.color;

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col">
            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setPhase("intro")} className="p-2 bg-white rounded-xl border-2 border-soft-blue text-slate-400 hover:text-joy-blue transition-colors">
                    <XCircle size={20} />
                </button>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-joy-blue" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
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

            <AnimatePresence mode="wait">
                <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-6 flex-1"
                >
                    {/* Scenario card */}
                    <div className="card-fancy text-center bg-gradient-to-br from-white to-slate-50/50">
                        <p className="text-sm text-slate-500 font-medium mb-4">{exercise.context}</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                            {isCorrectType ? (
                                exercise.wrongVersion || exercise.sentence
                            ) : (
                                exercise.sentence.split("___").map((part, i, arr) => (
                                    <span key={i}>
                                        {part}
                                        {i < arr.length - 1 && (
                                            <span className="inline-block min-w-[60px] mx-1 border-b-4 border-dashed text-center font-black"
                                                style={{ borderColor: scenarioColor, color: status !== "playing" ? scenarioColor : "#94a3b8" }}>
                                                {status !== "playing" ? exercise.correct : "___"}
                                            </span>
                                        )}
                                    </span>
                                ))
                            )}
                        </p>
                    </div>

                    {isCorrectType ? (
                        /* Correct/Incorrect buttons */
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
                                        className={`p-5 rounded-2xl border-2 font-bold text-lg transition-all ${style}`}
                                    >
                                        {choice === "correct" ? "✅ Correcta" : "❌ Incorrecta"}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        /* Three option buttons: aquí, ahí, allí */
                        <div className="grid grid-cols-3 gap-3">
                            {(exercise.options || ["aquí", "ahí", "allí"]).map(option => {
                                const optionInfo = PLACE_INFO[option.toLowerCase() as keyof typeof PLACE_INFO];
                                let style = "bg-white border-soft-blue hover:shadow-lg cursor-pointer";
                                if (status !== "playing") {
                                    if (option.toLowerCase() === exercise.correct.toLowerCase()) style = "border-transparent text-white shadow-xl scale-105";
                                    else if (option === selectedOption) style = "bg-red-50 border-red-400 text-red-500";
                                    else style = "bg-white border-soft-blue opacity-30";
                                }
                                return (
                                    <button
                                        key={option}
                                        disabled={status !== "playing"}
                                        onClick={() => handleChoiceAnswer(option)}
                                        className={`p-5 rounded-2xl border-2 font-bold text-lg transition-all ${style}`}
                                        style={status !== "playing" && option.toLowerCase() === exercise.correct.toLowerCase() ? { backgroundColor: optionInfo?.color } : {}}
                                    >
                                        <span className="block text-2xl mb-1">{optionInfo?.emoji || "📍"}</span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
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
                                                <XCircle size={20} /> La respuesta era: <span className="text-success-green font-bold">{exercise.correct}</span>
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
