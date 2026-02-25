// Verb Conjugation Data for Spanish Learning App
// Focus: real-world usage in sentences, not just memorization tables

export type TenseKey =
    | "presente"
    | "preterito_perfecto"
    | "preterito_indefinido"
    | "imperfecto"
    | "futuro"
    | "condicional"
    | "subjuntivo";

export interface ConjugationEntry {
    infinitive: string;
    translation: string; // Italian
    tense: TenseKey;
    subject: string;
    correct: string;
    sentence: string; // Full sentence with ___ placeholder
    explanation: string; // Brief explanation in Italian
    difficulty: 1 | 2 | 3;
}

export interface MultipleChoiceExercise {
    id: number;
    sentence: string;
    correct: string;
    options: string[];
    tense: TenseKey;
    explanation: string;
    difficulty: 1 | 2 | 3;
}

export interface SentenceCompletionExercise {
    id: number;
    sentence: string; // with ___ blank
    correct: string;
    hint: string;
    tense: TenseKey;
    explanation: string;
    difficulty: 1 | 2 | 3;
}

export const TENSE_INFO: Record<TenseKey, { name: string; nameIt: string; color: string; emoji: string; description: string }> = {
    presente: { name: "Presente", nameIt: "Presente Indicativo", color: "#3b82f6", emoji: "🔵", description: "Azioni abituali e fatti attuali" },
    preterito_perfecto: { name: "Pretérito Perfecto", nameIt: "Passato Prossimo", color: "#8b5cf6", emoji: "🟣", description: "Azioni passate con rilevanza nel presente" },
    preterito_indefinido: { name: "Pretérito Indefinido", nameIt: "Passato Remoto", color: "#ef4444", emoji: "🔴", description: "Azioni concluse nel passato" },
    imperfecto: { name: "Imperfecto", nameIt: "Imperfetto", color: "#f59e0b", emoji: "🟡", description: "Azioni abituali o in corso nel passato" },
    futuro: { name: "Futuro Simple", nameIt: "Futuro Semplice", color: "#22c55e", emoji: "🟢", description: "Azioni future, previsioni, promesse" },
    condicional: { name: "Condicional", nameIt: "Condizionale", color: "#ec4899", emoji: "🩷", description: "Desideri, ipotesi, cortesia" },
    subjuntivo: { name: "Subjuntivo Presente", nameIt: "Congiuntivo Presente", color: "#14b8a6", emoji: "🩵", description: "Dubbi, desideri, emozioni, opinioni" },
};

export const VERB_EXERCISES: MultipleChoiceExercise[] = [
    // === PRESENTE ===
    { id: 1, sentence: "Yo ___ español todos los días.", correct: "hablo", options: ["hablo", "hablas", "habló", "hable"], tense: "presente", explanation: "Presente indicativo di 'hablar': yo hablo. Azione abituale.", difficulty: 1 },
    { id: 2, sentence: "Ella ___ en Madrid.", correct: "vive", options: ["vive", "vivió", "vivirá", "viva"], tense: "presente", explanation: "Presente di 'vivir': ella vive. Fatto attuale.", difficulty: 1 },
    { id: 3, sentence: "Nosotros ___ mucha agua.", correct: "bebemos", options: ["bebemos", "bebimos", "beberemos", "bebamos"], tense: "presente", explanation: "Presente di 'beber': nosotros bebemos.", difficulty: 1 },
    { id: 4, sentence: "¿Tú ___ italiano?", correct: "hablas", options: ["hablas", "habla", "hablaste", "hablarás"], tense: "presente", explanation: "Presente di 'hablar': tú hablas. Domanda su capacità attuale.", difficulty: 1 },
    { id: 5, sentence: "Ellos ___ al fútbol los domingos.", correct: "juegan", options: ["juegan", "jugaron", "jugarán", "jueguen"], tense: "presente", explanation: "'Jugar' è irregolare: ellos juegan (dittongo u→ue).", difficulty: 2 },
    { id: 6, sentence: "Yo no ___ nada.", correct: "sé", options: ["sé", "sabe", "sepa", "sabía"], tense: "presente", explanation: "'Saber' è irregolare nella prima persona: yo sé.", difficulty: 2 },

    // === PRETÉRITO PERFECTO ===
    { id: 7, sentence: "Hoy yo ___ al gimnasio.", correct: "he ido", options: ["he ido", "fui", "iré", "iba"], tense: "preterito_perfecto", explanation: "Pretérito perfecto: he + participio. 'Hoy' indica connessione col presente.", difficulty: 1 },
    { id: 8, sentence: "¿Ya ___ la película?", correct: "has visto", options: ["has visto", "viste", "verás", "veías"], tense: "preterito_perfecto", explanation: "'Ya' spesso accompagna il pretérito perfecto: has visto.", difficulty: 1 },
    { id: 9, sentence: "Nosotros ___ mucho este año.", correct: "hemos viajado", options: ["hemos viajado", "viajamos", "viajaremos", "viajábamos"], tense: "preterito_perfecto", explanation: "'Este año' indica tempo non concluso → pretérito perfecto.", difficulty: 2 },
    { id: 10, sentence: "Ella nunca ___ sushi.", correct: "ha comido", options: ["ha comido", "comió", "comerá", "comía"], tense: "preterito_perfecto", explanation: "'Nunca' + pretérito perfecto per esperienze di vita.", difficulty: 2 },

    // === PRETÉRITO INDEFINIDO ===
    { id: 11, sentence: "Ayer yo ___ al cine.", correct: "fui", options: ["fui", "he ido", "iré", "iba"], tense: "preterito_indefinido", explanation: "'Ayer' indica azione conclusa → indefinido. 'Ir': yo fui.", difficulty: 1 },
    { id: 12, sentence: "El año pasado ellos ___ a España.", correct: "viajaron", options: ["viajaron", "han viajado", "viajan", "viajaban"], tense: "preterito_indefinido", explanation: "'El año pasado' indica tempo concluso → indefinido.", difficulty: 1 },
    { id: 13, sentence: "Colón ___ América en 1492.", correct: "descubrió", options: ["descubrió", "ha descubierto", "descubría", "descubre"], tense: "preterito_indefinido", explanation: "Fatto storico con data precisa → indefinido.", difficulty: 2 },
    { id: 14, sentence: "¿Quién te ___ eso?", correct: "dijo", options: ["dijo", "ha dicho", "dice", "decía"], tense: "preterito_indefinido", explanation: "'Decir' è irregolare all'indefinido: dijo.", difficulty: 2 },

    // === IMPERFECTO ===
    { id: 15, sentence: "Cuando era niño, yo ___ mucho.", correct: "jugaba", options: ["jugaba", "jugué", "juego", "jugaré"], tense: "imperfecto", explanation: "Imperfetto per azioni abituali nel passato: 'cuando era niño' → jugaba.", difficulty: 1 },
    { id: 16, sentence: "Antes nosotros ___ en el campo.", correct: "vivíamos", options: ["vivíamos", "vivimos", "vivimos", "viviremos"], tense: "imperfecto", explanation: "'Antes' + azione abituale passata → imperfetto.", difficulty: 1 },
    { id: 17, sentence: "Mientras yo ___, empezó a llover.", correct: "caminaba", options: ["caminaba", "caminé", "camino", "camine"], tense: "imperfecto", explanation: "'Mientras' → azione in corso nel passato → imperfetto.", difficulty: 2 },
    { id: 18, sentence: "Mi abuela siempre ___ galletas.", correct: "hacía", options: ["hacía", "hizo", "hace", "hará"], tense: "imperfecto", explanation: "'Siempre' + attività ripetuta nel passato → imperfetto.", difficulty: 2 },

    // === FUTURO ===
    { id: 19, sentence: "Mañana yo ___ a tu casa.", correct: "iré", options: ["iré", "fui", "voy", "iba"], tense: "futuro", explanation: "Futuro semplice di 'ir': yo iré. 'Mañana' indica futuro.", difficulty: 1 },
    { id: 20, sentence: "El próximo año nosotros ___ a Italia.", correct: "viajaremos", options: ["viajaremos", "viajamos", "viajamos", "viajábamos"], tense: "futuro", explanation: "Futuro di 'viajar': viajaremos. Piano futuro.", difficulty: 1 },
    { id: 21, sentence: "¿Tú ___ a la fiesta?", correct: "vendrás", options: ["vendrás", "vienes", "viniste", "venías"], tense: "futuro", explanation: "'Venir' è irregolare al futuro: vendrás (non *venirás).", difficulty: 2 },
    { id: 22, sentence: "Ella ___ médica algún día.", correct: "será", options: ["será", "es", "fue", "sea"], tense: "futuro", explanation: "'Ser' al futuro: será. Previsione.", difficulty: 2 },

    // === CONDICIONAL ===
    { id: 23, sentence: "Yo ___ un café, por favor.", correct: "querría", options: ["querría", "quiero", "quise", "quiera"], tense: "condicional", explanation: "Condizionale di cortesia: 'querría' è più gentile di 'quiero'.", difficulty: 1 },
    { id: 24, sentence: "Si tuviera dinero, ___ por el mundo.", correct: "viajaría", options: ["viajaría", "viajo", "viajé", "viaje"], tense: "condicional", explanation: "Si + imperfetto subjuntivo → condizionale. Ipotesi irreale.", difficulty: 2 },
    { id: 25, sentence: "¿Qué ___ tú en mi lugar?", correct: "harías", options: ["harías", "haces", "hiciste", "hagas"], tense: "condicional", explanation: "'Hacer' al condizionale: harías. Situazione ipotetica.", difficulty: 2 },
    { id: 26, sentence: "Ella ___ que está enferma.", correct: "diría", options: ["diría", "dice", "dijo", "diga"], tense: "condicional", explanation: "'Decir' al condizionale: diría. Congettura.", difficulty: 3 },

    // === SUBJUNTIVO ===
    { id: 27, sentence: "Espero que tú ___ bien.", correct: "estés", options: ["estés", "estás", "estuviste", "estarás"], tense: "subjuntivo", explanation: "'Espero que' richiede il congiuntivo: estés.", difficulty: 2 },
    { id: 28, sentence: "No creo que él ___ la verdad.", correct: "diga", options: ["diga", "dice", "dijo", "dirá"], tense: "subjuntivo", explanation: "'No creo que' esprime dubbio → congiuntivo: diga.", difficulty: 2 },
    { id: 29, sentence: "Ojalá ___ buen tiempo mañana.", correct: "haga", options: ["haga", "hace", "hizo", "hará"], tense: "subjuntivo", explanation: "'Ojalá' richiede sempre il congiuntivo: haga.", difficulty: 2 },
    { id: 30, sentence: "Quiero que ___ a mi fiesta.", correct: "vengas", options: ["vengas", "vienes", "viniste", "vendrás"], tense: "subjuntivo", explanation: "'Quiero que' + congiuntivo: vengas.", difficulty: 3 },

    // === BOSS LEVEL: Mixed tenses ===
    { id: 31, sentence: "Cuando ___ pequeño, siempre ___ al parque.", correct: "era", options: ["era", "fui", "soy", "seré"], tense: "imperfecto", explanation: "Due azioni abituali nel passato → imperfetto per entrambe.", difficulty: 3 },
    { id: 32, sentence: "Si yo ___ tú, no lo haría.", correct: "fuera", options: ["fuera", "fui", "soy", "seré"], tense: "subjuntivo", explanation: "'Si yo fuera tú' → imperfetto del congiuntivo, ipotesi irreale.", difficulty: 3 },
    { id: 33, sentence: "Ayer ___ a un restaurante que nunca ___.", correct: "fui", options: ["fui", "he ido", "iba", "iré"], tense: "preterito_indefinido", explanation: "'Ayer' → indefinido. Azione puntuale nel passato.", difficulty: 3 },
    { id: 34, sentence: "Cuando llegué, ella ya ___.", correct: "había salido", options: ["había salido", "ha salido", "salió", "salía"], tense: "preterito_perfecto", explanation: "Azione anteriore a un'altra nel passato → passato perfetto.", difficulty: 3 },
];

export function getVerbExercises(tense: TenseKey | "all", difficulty: 1 | 2 | 3 | "all", count: number = 5): MultipleChoiceExercise[] {
    let pool = [...VERB_EXERCISES];

    if (tense !== "all") {
        pool = pool.filter(e => e.tense === tense);
    }
    if (difficulty !== "all") {
        pool = pool.filter(e => e.difficulty <= difficulty);
    }
    if (pool.length === 0) pool = [...VERB_EXERCISES];

    // Shuffle
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(e => ({
        ...e,
        options: [...e.options].sort(() => Math.random() - 0.5),
    }));
}
