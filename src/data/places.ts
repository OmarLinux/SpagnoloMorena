// Aquí / Ahí / Allí exercises for Spanish Learning App
// Focus: demonstrative adverbs of place, proximity context

export interface PlaceExercise {
    id: number;
    type: "choice" | "scenario" | "correct";
    context: string; // Description of the scenario
    sentence: string;
    correct: string;
    options?: string[];
    wrongVersion?: string;
    explanation: string;
    difficulty: 1 | 2 | 3;
}

export const PLACE_INFO = {
    aquí: {
        name: "Aquí",
        meaning: "Qui (vicino a chi parla)",
        color: "#22c55e",
        emoji: "📍",
        rule: "Si usa quando l'oggetto o la persona è vicino a chi parla. Corrisponde a 'este/esta/esto'.",
        examples: ["Ven aquí.", "Aquí está mi casa.", "Yo estoy aquí."],
    },
    ahí: {
        name: "Ahí",
        meaning: "Lì (vicino a chi ascolta)",
        color: "#f59e0b",
        emoji: "👉",
        rule: "Si usa quando l'oggetto è vicino a chi ascolta, a media distanza. Corrisponde a 'ese/esa/eso'.",
        examples: ["Ponlo ahí.", "¿Qué hay ahí?", "Ahí está tu libro."],
    },
    allí: {
        name: "Allí",
        meaning: "Là (lontano da entrambi)",
        color: "#8b5cf6",
        emoji: "🏔️",
        rule: "Si usa quando l'oggetto è lontano da entrambi gli interlocutori. Corrisponde a 'aquel/aquella/aquello'.",
        examples: ["Allí está la montaña.", "Fuimos allí el año pasado.", "Allí viven mis abuelos."],
    },
};

export const PLACE_EXERCISES: PlaceExercise[] = [
    // === LEVEL 1: Basic proximity ===
    {
        id: 1, type: "choice",
        context: "🧑 Estás en tu habitación señalando tu cama.",
        sentence: "Mi cama está ___.",
        correct: "aquí",
        options: ["aquí", "ahí", "allí"],
        explanation: "La cama è vicina a te (chi parla) → aquí.",
        difficulty: 1,
    },
    {
        id: 2, type: "choice",
        context: "🧑 Señalas el libro que tu amigo tiene en las manos.",
        sentence: "Tu libro está ___.",
        correct: "ahí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Il libro è vicino al tuo amico (chi ascolta) → ahí.",
        difficulty: 1,
    },
    {
        id: 3, type: "choice",
        context: "🧑 Miras una montaña muy lejana desde la ventana.",
        sentence: "La montaña está ___.",
        correct: "allí",
        options: ["aquí", "ahí", "allí"],
        explanation: "La montagna è lontana da entrambi → allí.",
        difficulty: 1,
    },
    {
        id: 4, type: "choice",
        context: "🧑 Invitas a un amigo a venir donde estás tú.",
        sentence: "¡Ven ___!",
        correct: "aquí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Lo inviti a venire dove sei tu → aquí.",
        difficulty: 1,
    },
    {
        id: 5, type: "choice",
        context: "🧑 Le dices a tu amigo que deje su mochila al lado de él.",
        sentence: "Deja tu mochila ___.",
        correct: "ahí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Accanto al tuo amico (chi ascolta) → ahí.",
        difficulty: 1,
    },

    // === LEVEL 2: Context-dependent ===
    {
        id: 6, type: "choice",
        context: "📞 Estás hablando por teléfono con tu madre que está en otra ciudad.",
        sentence: "¿Hace frío ___?",
        correct: "ahí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Al telefono, la posizione dell'interlocutore è 'ahí' (vicino a chi ascolta).",
        difficulty: 2,
    },
    {
        id: 7, type: "choice",
        context: "🧑 Cuentas una historia de un viaje a Japón que hiciste.",
        sentence: "___ la comida era increíble.",
        correct: "Allí",
        options: ["Aquí", "Ahí", "Allí"],
        explanation: "Luogo lontano dove si è stati in passato → allí.",
        difficulty: 2,
    },
    {
        id: 8, type: "correct",
        context: "🧑 Estás en tu cocina y señalas el plato delante de ti.",
        sentence: "El plato está aquí.",
        correct: "El plato está aquí.",
        wrongVersion: "El plato está allí.",
        explanation: "Il piatto è davanti a te → aquí, non allí (che indica lontananza).",
        difficulty: 2,
    },
    {
        id: 9, type: "choice",
        context: "🧑 Tu amigo te pregunta dónde vives. Le dices señalando tu edificio cercano.",
        sentence: "Vivo ___, en ese edificio.",
        correct: "ahí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Indichi un edificio a vista ma non proprio dove sei → ahí. 'Ese' confirma la media distanza.",
        difficulty: 2,
    },
    {
        id: 10, type: "choice",
        context: "🧑 Estás en Roma y hablas de tu ciudad natal en Japón.",
        sentence: "Nací ___,  en Tokio.",
        correct: "allí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Tokyo è un luogo lontano da dove sei ora → allí.",
        difficulty: 2,
    },

    // === LEVEL 3: Tricky / omission / implicit ===
    {
        id: 11, type: "choice",
        context: "🧑 Tu amigo señala un punto en el mapa que está entre vosotros dos.",
        sentence: "La tienda está justo ___.",
        correct: "ahí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Il punto è tra voi, ma indicato dall'amico → ahí (media distanza).",
        difficulty: 3,
    },
    {
        id: 12, type: "correct",
        context: "🧑 Un turista pregunta dónde está el museo. Está al otro lado de la ciudad.",
        sentence: "El museo está allí, muy lejos.",
        correct: "El museo está allí, muy lejos.",
        wrongVersion: "El museo está aquí, muy lejos.",
        explanation: "'Aquí' contradice 'muy lejos'. Il posto è lontano → allí.",
        difficulty: 3,
    },
    {
        id: 13, type: "choice",
        context: "🧑 Hablas de este mismo restaurante donde estáis sentados.",
        sentence: "___ se come muy bien.",
        correct: "Aquí",
        options: ["Aquí", "Ahí", "Allí"],
        explanation: "State parlando del ristorante in cui vi trovate → aquí.",
        difficulty: 2,
    },
    {
        id: 14, type: "choice",
        context: "🧑 Señalas la silla que está justo al lado de tu amigo.",
        sentence: "Siéntate ___.",
        correct: "ahí",
        options: ["aquí", "ahí", "allí"],
        explanation: "La sedia è vicina alla persona a cui parli → ahí.",
        difficulty: 2,
    },
    {
        id: 15, type: "correct",
        context: "🧑 Tu amigo te dice que el supermercado está en la calle donde estáis caminando.",
        sentence: "El supermercado está por aquí.",
        correct: "El supermercado está por aquí.",
        wrongVersion: "El supermercado está por allí.",
        explanation: "'Por aquí' = nelle vicinanze di dove siete. 'Por allí' indicherebbe un posto lontano.",
        difficulty: 3,
    },
    {
        id: 16, type: "choice",
        context: "🧑 A tu madre le dices que pongas la compra donde tú estás: la cocina.",
        sentence: "Pon la compra ___.",
        correct: "aquí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Dove sei tu (la cucina) → aquí.",
        difficulty: 1,
    },
    {
        id: 17, type: "choice",
        context: "🏫 El profesor señala una fecha en el calendario al fondo de la clase.",
        sentence: "Mirad ___, la fecha del examen.",
        correct: "allí",
        options: ["aquí", "ahí", "allí"],
        explanation: "Il calendario è lontano da entrambi (in fondo alla classe) → allí.",
        difficulty: 3,
    },
    {
        id: 18, type: "correct",
        context: "🧑 Estás en el parque y tu perro viene corriendo hacia ti.",
        sentence: "¡Ven aquí, Toby!",
        correct: "¡Ven aquí, Toby!",
        wrongVersion: "¡Ven ahí, Toby!",
        explanation: "Chiami il cane verso di te → aquí. 'Ahí' sarebbe verso un'altra persona.",
        difficulty: 2,
    },
];

export function getPlaceExercises(difficulty: 1 | 2 | 3 | "all", count: number = 5): PlaceExercise[] {
    let pool = [...PLACE_EXERCISES];

    if (difficulty !== "all") {
        pool = pool.filter(e => e.difficulty <= difficulty);
    }
    if (pool.length === 0) pool = [...PLACE_EXERCISES];

    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}
