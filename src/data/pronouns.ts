// Pronoun exercises for Spanish Learning App
// Covers: subject, direct/indirect object, combinations, indefinite pronouns

export interface PronounExercise {
    id: number;
    type: "fill" | "correct" | "drag" | "choice";
    sentence: string;
    correct: string;
    options?: string[];
    wrongVersion?: string; // for "correct the error" mode
    category: PronounCategory;
    explanation: string;
    difficulty: 1 | 2 | 3;
}

export type PronounCategory =
    | "sujeto"
    | "directo"
    | "indirecto"
    | "combinado"
    | "indefinido";

export const PRONOUN_CATEGORY_INFO: Record<PronounCategory, { name: string; nameIt: string; color: string; emoji: string; examples: string }> = {
    sujeto: { name: "Pronombres Sujeto", nameIt: "Pronomi Soggetto", color: "#3b82f6", emoji: "👤", examples: "yo, tú, él, ella, nosotros, vosotros, ellos" },
    directo: { name: "Complemento Directo", nameIt: "Complemento Diretto", color: "#22c55e", emoji: "🎯", examples: "me, te, lo, la, nos, os, los, las" },
    indirecto: { name: "Complemento Indirecto", nameIt: "Complemento Indiretto", color: "#f59e0b", emoji: "📩", examples: "me, te, le, nos, os, les" },
    combinado: { name: "Combinación de Pronombres", nameIt: "Combinazione Pronomi", color: "#ec4899", emoji: "🔗", examples: "se lo, se la, me lo, te los" },
    indefinido: { name: "Pronombres Indefinidos", nameIt: "Pronomi Indefiniti", color: "#8b5cf6", emoji: "❓", examples: "alguien, nadie, algo, nada, alguno/a" },
};

export const PRONOUN_EXERCISES: PronounExercise[] = [
    // === PRONOMI SOGGETTO ===
    { id: 1, type: "choice", sentence: "___ soy estudiante.", correct: "Yo", options: ["Yo", "Tú", "Él", "Nosotros"], category: "sujeto", explanation: "Prima persona singolare: yo soy = io sono.", difficulty: 1 },
    { id: 2, type: "choice", sentence: "___ vives en Roma, ¿verdad?", correct: "Tú", options: ["Yo", "Tú", "Él", "Ellos"], category: "sujeto", explanation: "Seconda persona singolare: tú vives = tu vivi.", difficulty: 1 },
    { id: 3, type: "choice", sentence: "___ trabajan en un hospital.", correct: "Ellos", options: ["Él", "Ella", "Nosotros", "Ellos"], category: "sujeto", explanation: "'Trabajan' è terza persona plurale: ellos/ellas trabajan.", difficulty: 1 },
    { id: 4, type: "choice", sentence: "___ somos amigos desde niños.", correct: "Nosotros", options: ["Yo", "Tú", "Nosotros", "Vosotros"], category: "sujeto", explanation: "'Somos' = prima persona plurale → nosotros.", difficulty: 1 },
    { id: 5, type: "correct", sentence: "Él vive en Madrid.", correct: "Él vive en Madrid.", wrongVersion: "Yo vive en Madrid.", category: "sujeto", explanation: "'Vive' corrisponde a él/ella, non a yo (yo vivo).", difficulty: 1 },

    // === COMPLEMENTO DIRECTO ===
    { id: 6, type: "choice", sentence: "¿El libro? ___ tengo en casa.", correct: "Lo", options: ["Lo", "La", "Le", "Los"], category: "directo", explanation: "'Libro' è maschile singolare → lo.", difficulty: 1 },
    { id: 7, type: "choice", sentence: "¿Las llaves? No ___ encuentro.", correct: "las", options: ["lo", "la", "los", "las"], category: "directo", explanation: "'Llaves' è femminile plurale → las.", difficulty: 1 },
    { id: 8, type: "choice", sentence: "A María, ___ veo todos los días.", correct: "la", options: ["lo", "la", "le", "les"], category: "directo", explanation: "María = persona femminile, complemento diretto → la.", difficulty: 2 },
    { id: 9, type: "correct", sentence: "La película, la vi ayer.", correct: "La película, la vi ayer.", wrongVersion: "La película, lo vi ayer.", category: "directo", explanation: "'Película' è femminile → la, non lo.", difficulty: 2 },
    { id: 10, type: "choice", sentence: "¿Los niños? ___ llevo al parque.", correct: "Los", options: ["Lo", "La", "Los", "Las"], category: "directo", explanation: "'Niños' è maschile plurale → los.", difficulty: 1 },

    // === COMPLEMENTO INDIRETTO ===
    { id: 11, type: "choice", sentence: "A ti ___ gusta el chocolate.", correct: "te", options: ["me", "te", "le", "nos"], category: "indirecto", explanation: "'A ti' → complemento indiretto di 2ª persona: te.", difficulty: 1 },
    { id: 12, type: "choice", sentence: "A Juan ___ duele la cabeza.", correct: "le", options: ["lo", "la", "le", "les"], category: "indirecto", explanation: "A Juan → 3ª persona, complemento indiretto: le.", difficulty: 1 },
    { id: 13, type: "choice", sentence: "A nosotros ___ encanta la pizza.", correct: "nos", options: ["me", "te", "nos", "les"], category: "indirecto", explanation: "'A nosotros' → complemento indiretto: nos.", difficulty: 1 },
    { id: 14, type: "correct", sentence: "A ellos les gusta viajar.", correct: "A ellos les gusta viajar.", wrongVersion: "A ellos le gusta viajar.", category: "indirecto", explanation: "Plurale 'ellos' richiede 'les', non 'le'.", difficulty: 2 },
    { id: 15, type: "choice", sentence: "___ dije la verdad a mis padres.", correct: "Les", options: ["Le", "Les", "Lo", "Los"], category: "indirecto", explanation: "'Mis padres' è plurale → les (complemento indiretto).", difficulty: 2 },

    // === COMBINAZIONE PRONOMI ===
    { id: 16, type: "choice", sentence: "El regalo, ___ ___ di ayer. (a ella)", correct: "se lo", options: ["se lo", "le lo", "la lo", "lo le"], category: "combinado", explanation: "Le + lo → se lo. 'Le' diventa 'se' davanti a lo/la/los/las.", difficulty: 2 },
    { id: 17, type: "choice", sentence: "¿La carta? ___ ___ envié esta mañana. (a él)", correct: "Se la", options: ["Se la", "Le la", "La le", "Lo se"], category: "combinado", explanation: "Le + la → se la. Stessa regola: le → se prima di la.", difficulty: 2 },
    { id: 18, type: "choice", sentence: "¿Los libros? ___ ___ presté. (a ti)", correct: "Te los", options: ["Te los", "Se los", "Los te", "Te las"], category: "combinado", explanation: "Ti + li = te los. 'Te' non cambia in 'se'.", difficulty: 2 },
    { id: 19, type: "correct", sentence: "Se lo dije ayer.", correct: "Se lo dije ayer.", wrongVersion: "Le lo dije ayer.", category: "combinado", explanation: "'Le lo' non esiste in spagnolo. Si dice sempre 'se lo'.", difficulty: 3 },
    { id: 20, type: "choice", sentence: "Las fotos, ___ ___ mostré. (a ellos)", correct: "se las", options: ["se las", "les las", "las les", "se los"], category: "combinado", explanation: "Les + las → se las. 'Les' → 'se' prima di 'las'.", difficulty: 3 },

    // === PRONOMI INDEFINITI ===
    { id: 21, type: "choice", sentence: "¿Hay ___ en la puerta?", correct: "alguien", options: ["alguien", "nadie", "algo", "nada"], category: "indefinido", explanation: "'Alguien' = qualcuno (persona). Domanda: c'è qualcuno?", difficulty: 1 },
    { id: 22, type: "choice", sentence: "No hay ___ en casa.", correct: "nadie", options: ["alguien", "nadie", "alguno", "ninguno"], category: "indefinido", explanation: "Negazione + nadie = nessuno. 'No hay nadie'.", difficulty: 1 },
    { id: 23, type: "choice", sentence: "¿Quieres ___ de beber?", correct: "algo", options: ["algo", "nada", "alguien", "nadie"], category: "indefinido", explanation: "'Algo' = qualcosa (oggetto/bevanda). Offerta.", difficulty: 1 },
    { id: 24, type: "choice", sentence: "No tengo ___ problema.", correct: "ningún", options: ["ningún", "algún", "nadie", "algo"], category: "indefinido", explanation: "'Ningún' + sostantivo maschile = nessun. Negazione.", difficulty: 2 },
    { id: 25, type: "choice", sentence: "¿___ de vosotros habla francés?", correct: "Alguno", options: ["Alguno", "Alguien", "Nadie", "Algo"], category: "indefinido", explanation: "'Alguno de vosotros' = qualcuno di voi (del gruppo).", difficulty: 2 },
    { id: 26, type: "correct", sentence: "Alguien llamó a la puerta.", correct: "Alguien llamó a la puerta.", wrongVersion: "Alguno llamó a la puerta.", category: "indefinido", explanation: "'Alguien' per persona sconosciuta. 'Alguno' si usa con un gruppo specifico.", difficulty: 2 },
    { id: 27, type: "choice", sentence: "___ de las chicas quiere ir.", correct: "Ninguna", options: ["Ninguna", "Nadie", "Nada", "Alguna"], category: "indefinido", explanation: "'Ninguna' + de las chicas. Femminile perché 'chicas' è femminile.", difficulty: 3 },
    { id: 28, type: "choice", sentence: "No quiero ___ .", correct: "nada", options: ["nada", "nadie", "algo", "ninguno"], category: "indefinido", explanation: "'Nada' = niente (cose). 'No quiero nada' = non voglio niente.", difficulty: 1 },
];

export function getPronounExercises(category: PronounCategory | "all", difficulty: 1 | 2 | 3 | "all", count: number = 5): PronounExercise[] {
    let pool = [...PRONOUN_EXERCISES];

    if (category !== "all") {
        pool = pool.filter(e => e.category === category);
    }
    if (difficulty !== "all") {
        pool = pool.filter(e => e.difficulty <= difficulty);
    }
    if (pool.length === 0) pool = [...PRONOUN_EXERCISES];

    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(e => ({
        ...e,
        options: e.options ? [...e.options].sort(() => Math.random() - 0.5) : undefined,
    }));
}
