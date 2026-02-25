"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "it" | "es";

interface Translations {
    [key: string]: {
        [key in Language]: string;
    };
}

export const translations: Translations = {
    welcome: { it: "Benvenuto!", es: "¡Bienvenido!" },
    hola: { it: "Ciao", es: "¡Hola!" },
    estudiante: { it: "Studente", es: "Estudiante" },
    next_level: { it: "Prossimo livello in", es: "Próximo nivel en" },
    learn_spanish: { it: "Impara lo Spagnolo", es: "Aprende Español" },
    playing_alone: { it: "giocando.", es: "jugando solo." },
    subtitle: {
        it: "Domina la grammatica e preparati per i tuoi esami con sfide divertenti e colori vivaci.",
        es: "Domina la gramática y prepárate para tus exámenes con desafíos divertidos y colores vibrantes."
    },
    start_game: { it: "Inizia Gioco", es: "Empezar Juego" },
    grammar: { it: "Grammatica", es: "Gramática" },
    grammar_desc: { it: "Genere, numero e aggettivi.", es: "Género, número y adjetivos." },
    word_order: { it: "Ordine delle Parole", es: "Orden de Palabras" },
    word_order_desc: { it: "Costruisci frasi corrette.", es: "Construye frases correctas." },
    presentation: { it: "Presentazione", es: "Presentación" },
    presentation_desc: { it: "Preparati per i tuoi esami.", es: "Prepárate para tus exámenes." },
    loading: { it: "Caricamento...", es: "Cargando..." },
    check: { it: "Verifica", es: "Verificar" },
    excellent: { it: "Eccellente!", es: "¡Excelente!" },
    next: { it: "Successivo", es: "Siguiente" },
    retry: { it: "Riprova", es: "Reintentar" },
    almost: { it: "Quasi! Prova ancora.", es: "¡Casi! Inténtalo de nuevo." },
    your_presentation: { it: "La tua Presentazione", es: "Tu Presentación" },
    presentation_subtitle: {
        it: "Scrivi il tuo testo in spagnolo per presentarti agli esaminatori.",
        es: "Escribe tu texto en español para presentarte a los examinadores."
    },
    send_review: { it: "Invia per Revisione", es: "Enviar a Revisión" },
    verifying: { it: "Verificando...", es: "Verificando..." },
    completed: { it: "Completato!", es: "¡Completado!" },
    suggestions: { it: "Suggerimenti di miglioramento:", es: "Sugerencias de mejora:" },
    perfect: { it: "Perfetto!", es: "¡Perfecto!" },
    match_type: { it: "¿Che tipo di parola è?", es: "¿Qué tipo de palabra es?" },
    m_s: { it: "Maschile Singolare", es: "Masculino Singular" },
    f_s: { it: "Femminile Singolare", es: "Femenino Singular" },
    m_p: { it: "Maschile Plurale", es: "Masculino Plural" },
    f_p: { it: "Femminile Plurale", es: "Femenino Plural" },
    wrong: { it: "Sbagliato!", es: "¡Incorrecto!" },
    verbs: { it: "Coniugazioni", es: "Conjugaciones" },
    verbs_desc: { it: "Padroneggia i tempi verbali.", es: "Domina los tiempos verbales." },
    pronouns: { it: "Pronomi", es: "Pronombres" },
    pronouns_desc: { it: "Pronomi, complementi e indefiniti.", es: "Pronombres, complementos e indefinidos." },
    places: { it: "Aquí / Ahí / Allí", es: "Aquí / Ahí / Allí" },
    places_desc: { it: "Impara quando usare ciascuno.", es: "Aprende cuándo usar cada uno." },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("it");

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
