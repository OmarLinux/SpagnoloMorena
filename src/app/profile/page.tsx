"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, User, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, Gender } from "@/context/UserContext";

export default function ProfileManager() {
    const { users, currentUser, addUser, selectUser, deleteUser } = useUser();
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newGender, setNewGender] = useState<Gender>("o");
    const router = useRouter();

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        addUser(newName.trim(), newGender);
        setNewName("");
        setIsCreating(false);
        router.push("/");
    };

    const handleSelect = (id: string) => {
        selectUser(id);
        router.push("/");
    };

    return (
        <main className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-background">
            <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-4 border-soft-blue relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-joy-blue/5 -z-10" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-slate-800 text-center mb-2">¡Hola!</h1>
                    <p className="text-center text-slate-500 mb-8 font-medium">Chi sta giocando o imparando oggi?</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {users.map((u) => {
                            const isCurrent = currentUser?.id === u.id;
                            const emoji = u.gender === "m" ? "👦" : u.gender === "f" ? "👧" : "🧑";

                            return (
                                <motion.div
                                    key={u.id}
                                    layout
                                    className={`relative cursor-pointer p-6 rounded-3xl border-4 transition-all ${isCurrent
                                            ? "border-success-green bg-success-green/5 shadow-lg scale-105"
                                            : "border-soft-blue bg-white hover:border-joy-blue/40"
                                        }`}
                                    onClick={() => handleSelect(u.id)}
                                    whileHover={!isCurrent ? { scale: 1.02 } : {}}
                                >
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteUser(u.id); }}
                                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                                        title="Elimina"
                                    >
                                        <Trash2 size={20} />
                                    </button>

                                    <div className="text-5xl mb-4 text-center">{emoji}</div>
                                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-1">{u.username}</h2>
                                    <p className="text-sm text-slate-400 font-medium text-center">
                                        Lvl {u.level} • {u.xp} XP
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {!isCreating ? (
                            users.length < 3 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="pt-4 border-t-2 border-slate-100 flex justify-center"
                                >
                                    <button
                                        onClick={() => setIsCreating(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-soft-blue text-joy-blue font-bold rounded-2xl hover:bg-joy-blue hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus size={20} /> Aggiungi Nuovo Utente
                                    </button>
                                </motion.div>
                            )
                        ) : (
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleCreate}
                                className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-soft-blue focus:border-joy-blue outline-none transition-colors text-lg font-bold text-slate-700 bg-white"
                                        placeholder="Il tuo nome..."
                                        maxLength={15}
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Io sono...</label>
                                    <div className="flex gap-2 p-1 bg-white rounded-2xl border-2 border-soft-blue">
                                        {(["m", "f", "o"] as const).map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setNewGender(g)}
                                                className={`flex-1 py-3 px-2 rounded-xl text-center font-bold text-sm transition-colors ${newGender === g
                                                        ? "bg-joy-blue text-white shadow-sm"
                                                        : "text-slate-500 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {g === 'm' ? "Un Niño 👦" : g === 'f' ? "Una Niña 👧" : "Altro 🧑"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 px-6 py-3 bg-white text-slate-400 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-100 transition-colors"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newName.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-game-orange text-white font-bold rounded-2xl shadow-[0_4px_0_0_#d97706] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#d97706] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Inizia <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {users.length === 3 && !isCreating && (
                        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                            Hai raggiunto il limite massimo di 3 utenti.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
