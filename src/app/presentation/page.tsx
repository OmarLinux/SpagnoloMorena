"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { validatePresentationLocally, GrammarError } from "@/data/nlp";

export default function PresentationPrep() {
    const [text, setText] = useState("");
    const [errors, setErrors] = useState<GrammarError[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [activeTopic, setActiveTopic] = useState<number | null>(null);
    const { t } = useLanguage();
    const { currentUser, addXP, recordAttempt } = useUser();

    const TOPICS = [
        { id: 1, title: "Presentación Personal", prompt: "Hola, me llamo... Tengo... años..." },
        { id: 2, title: "Mis Aficiones", prompt: "En mi tiempo libre, me gusta... Mi deporte favorito es..." },
        { id: 3, title: "Mi Ciudad", prompt: "Vivo en... Es una ciudad... Lo que más me gusta es..." },
    ];

    const handleSelectTopic = (topic: any) => {
        setActiveTopic(topic.id);
        if (!text) setText(topic.prompt);
    };

    const handleValidate = () => {
        if (!text.trim()) return;
        setIsSubmitting(true);
        setErrors([]);
        setIsComplete(false);

        // Simulate network delay for effect
        setTimeout(() => {
            const result = validatePresentationLocally(text);

            if (result.is_valid) {
                setIsComplete(true);
                setErrors([]);
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ["#ff8c42", "#3b82f6", "#22c55e"],
                });

                if (currentUser) {
                    addXP(50);
                    // Just log it in grammar stats or a new category if you prefer
                    recordAttempt("grammar", true);
                }
            } else {
                setErrors(result.errors || []);
            }
            setIsSubmitting(false);
        }, 800);
    };

    // Build highlighted text with errors marked in red
    const renderHighlightedText = () => {
        if (errors.length === 0) return null;

        let highlightedText = text;
        // Sort errors by position in text (descending) to replace from end to start
        const sortedErrors = [...errors].sort((a, b) => {
            const posA = highlightedText.toLowerCase().indexOf(a.word.toLowerCase());
            const posB = highlightedText.toLowerCase().indexOf(b.word.toLowerCase());
            return posB - posA;
        });

        const segments: { text: string; isError: boolean; error?: GrammarError }[] = [];
        let remaining = text;
        let errorPositions: { start: number; end: number; error: GrammarError }[] = [];

        for (const error of errors) {
            const idx = text.toLowerCase().indexOf(error.word.toLowerCase());
            if (idx !== -1) {
                errorPositions.push({ start: idx, end: idx + error.word.length, error });
            }
        }

        // Sort by start position
        errorPositions.sort((a, b) => a.start - b.start);

        // Remove overlapping
        const filtered: typeof errorPositions = [];
        for (const ep of errorPositions) {
            if (filtered.length === 0 || ep.start >= filtered[filtered.length - 1].end) {
                filtered.push(ep);
            }
        }

        let lastEnd = 0;
        for (const ep of filtered) {
            if (ep.start > lastEnd) {
                segments.push({ text: text.slice(lastEnd, ep.start), isError: false });
            }
            segments.push({ text: text.slice(ep.start, ep.end), isError: true, error: ep.error });
            lastEnd = ep.end;
        }
        if (lastEnd < text.length) {
            segments.push({ text: text.slice(lastEnd), isError: false });
        }

        return (
            <div className="card-fancy bg-white p-6 text-lg leading-relaxed font-medium text-slate-700">
                {segments.map((seg, i) =>
                    seg.isError ? (
                        <span
                            key={i}
                            className="bg-red-100 text-red-600 font-bold border-b-2 border-red-400 px-0.5 rounded cursor-help"
                            title={`${seg.error?.rule}\n→ ${seg.error?.suggestion}`}
                        >
                            {seg.text}
                        </span>
                    ) : (
                        <span key={i}>{seg.text}</span>
                    )
                )}
            </div>
        );
    };

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto flex flex-col">
            <div className="w-full flex justify-between items-center mb-8">
                <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm border-2 border-soft-blue text-joy-blue hover:text-joy-blue-hover transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div className="px-6 py-2 bg-success-green/10 text-success-green font-bold rounded-full border-2 border-success-green/20 flex items-center gap-2">
                    <Sparkles size={18} fill="currentColor" /> {t("presentation")}
                </div>
            </div>

            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-slate-800">{t("your_presentation")}</h1>
                    <p className="text-slate-500 font-medium italic">{t("presentation_subtitle")}</p>
                </div>

                {/* Topic Selector */}
                <div className="flex flex-wrap gap-3 justify-center">
                    {TOPICS.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => handleSelectTopic(topic)}
                            className={`px-4 py-2 rounded-2xl border-2 font-bold transition-all ${activeTopic === topic.id
                                ? 'bg-joy-blue border-joy-blue text-white shadow-lg scale-105'
                                : 'bg-white border-soft-blue text-joy-blue hover:bg-soft-blue'
                                }`}
                        >
                            {topic.title}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            // Reset state when user edits
                            if (isComplete) setIsComplete(false);
                            if (errors.length > 0) setErrors([]);
                        }}
                        placeholder="Hola, me llamo... Tengo ... años y vivo en ..."
                        className="w-full h-80 card-fancy text-lg p-8 outline-none focus:border-joy-blue transition-all resize-none font-medium text-slate-700 bg-white placeholder:text-slate-200"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        disabled={isSubmitting || !text.trim()}
                        onClick={handleValidate}
                        className={`btn-primary w-full max-w-xs flex items-center justify-center gap-3 text-xl ${isSubmitting || !text.trim() ? 'opacity-50' : ''}`}
                    >
                        {isSubmitting ? t("verifying") : t("send_review")}
                        {!isSubmitting && <Send size={24} />}
                    </button>
                </div>

                <div className="space-y-4 pt-4">
                    {/* Show highlighted text with errors */}
                    {errors.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <h3 className="flex items-center gap-2 font-bold text-red-500 text-lg">
                                <AlertTriangle size={20} /> Errori trovati nel tuo testo:
                            </h3>
                            {renderHighlightedText()}

                            <div className="space-y-2 mt-4">
                                {errors.map((error, i) => (
                                    <div key={i} className="card-fancy bg-red-50 border-red-200 p-4">
                                        <div className="flex items-start gap-3">
                                            <span className="text-red-500 font-black text-lg">×</span>
                                            <div>
                                                <p className="font-bold text-red-600">
                                                    "<span className="line-through">{error.word}</span>" → "<span className="text-success-green">{error.suggestion}</span>"
                                                </p>
                                                <p className="text-slate-500 text-sm mt-1">{error.rule}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {isComplete && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-fancy bg-success-green/10 border-success-green">
                            <div className="flex items-center gap-4">
                                <div className="bg-success-green p-3 rounded-2xl text-white shadow-lg">
                                    <CheckCircle size={32} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-xl">{t("perfect")}, {currentUser?.username || "Estudiante"}!</h3>
                                    <p className="text-slate-500 font-medium">{t("completed")} +50 XP!</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}
