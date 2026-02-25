"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Gender = "m" | "f" | "o";

export interface UserProfile {
    id: string;
    username: string;
    gender: Gender;
    xp: number;
    level: number;
    grammar_attempts: number;
    grammar_successes: number;
    word_order_attempts: number;
    word_order_successes: number;
}

interface UserContextType {
    users: UserProfile[];
    currentUser: UserProfile | null;
    addUser: (username: string, gender: Gender) => void;
    selectUser: (id: string) => void;
    deleteUser: (id: string) => void;
    addXP: (points: number) => void;
    recordAttempt: (category: "grammar" | "word_order", isCorrect: boolean) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const storedUsers = localStorage.getItem("spanish_app_users");
        const storedCurrent = localStorage.getItem("spanish_app_current_user");
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
        if (storedCurrent) {
            setCurrentUserId(storedCurrent);
        }
    }, []);

    // Save to local storage whenever users or currentUserId change
    useEffect(() => {
        localStorage.setItem("spanish_app_users", JSON.stringify(users));
        if (currentUserId) {
            localStorage.setItem("spanish_app_current_user", currentUserId);
        } else {
            localStorage.removeItem("spanish_app_current_user");
        }
    }, [users, currentUserId]);

    const addUser = (username: string, gender: Gender) => {
        if (users.length >= 3) {
            alert("Puoi creare massimo 3 utenti. Eliminane uno per continuare.");
            return;
        }
        const newUser: UserProfile = {
            id: Date.now().toString(),
            username,
            gender,
            xp: 0,
            level: 1,
            grammar_attempts: 0,
            grammar_successes: 0,
            word_order_attempts: 0,
            word_order_successes: 0,
        };
        setUsers([...users, newUser]);
        setCurrentUserId(newUser.id);
    };

    const selectUser = (id: string) => {
        setCurrentUserId(id);
    };

    const deleteUser = (id: string) => {
        setUsers(users.filter((u) => u.id !== id));
        if (currentUserId === id) {
            setCurrentUserId(null);
        }
    };

    const logout = () => {
        setCurrentUserId(null);
    };

    const addXP = (points: number) => {
        if (!currentUserId) return;
        setUsers((prevUsers) =>
            prevUsers.map((u) => {
                if (u.id === currentUserId) {
                    const newXp = u.xp + points;
                    return {
                        ...u,
                        xp: newXp,
                        level: 1 + Math.floor(newXp / 100),
                    };
                }
                return u;
            })
        );
    };

    const recordAttempt = (category: "grammar" | "word_order", isCorrect: boolean) => {
        if (!currentUserId) return;
        setUsers((prevUsers) =>
            prevUsers.map((u) => {
                if (u.id === currentUserId) {
                    const updated = { ...u };
                    if (category === "grammar") {
                        updated.grammar_attempts += 1;
                        if (isCorrect) updated.grammar_successes += 1;
                    } else if (category === "word_order") {
                        updated.word_order_attempts += 1;
                        if (isCorrect) updated.word_order_successes += 1;
                    }
                    return updated;
                }
                return u;
            })
        );
    };

    const currentUser = users.find((u) => u.id === currentUserId) || null;

    return (
        <UserContext.Provider
            value={{
                users,
                currentUser,
                addUser,
                selectUser,
                deleteUser,
                addXP,
                recordAttempt,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
