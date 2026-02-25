export interface VocabularyItem {
    word: string;
    gender: "m" | "f" | "both";
    plurality: "s" | "p";
    translation: string;
    difficulty: number;
    explanation?: string;
}

export interface SentenceItem {
    id: number;
    correct_order: string[];
    words: string[];
    translation: string;
    difficulty: number;
}

export const VOCABULARY: VocabularyItem[] = [
    // EASY (Nouns & Adjectives)
    { word: "niño", gender: "m", plurality: "s", translation: "bambino", difficulty: 1, explanation: "Finisce per '-o', tipico del maschile singolare." },
    { word: "niña", gender: "f", plurality: "s", translation: "bambina", difficulty: 1, explanation: "Finisce per '-a', tipico del femminile singolare." },
    { word: "casa", gender: "f", plurality: "s", translation: "casa", difficulty: 1, explanation: "Finisce per '-a', sostantivo femminile singolare." },
    { word: "perro", gender: "m", plurality: "s", translation: "cane", difficulty: 1, explanation: "Sostantivo maschile che termina in '-o'." },
    { word: "gato", gender: "m", plurality: "s", translation: "gatto", difficulty: 1, explanation: "Sostantivo maschile singolare (il gatto)." },
    { word: "rojo", gender: "m", plurality: "s", translation: "rosso", difficulty: 1, explanation: "Aggettivo maschile singolare riferito a un nome maschile." },
    { word: "azul", gender: "both", plurality: "s", translation: "blu", difficulty: 1, explanation: "Aggettivo invariabile: termina in consonante, quindi è uguale per maschile e femminile." },
    { word: "libro", gender: "m", plurality: "s", translation: "libro", difficulty: 1, explanation: "Sostantivo maschile che segue la regola della '-o'." },
    { word: "mesa", gender: "f", plurality: "s", translation: "tavolo", difficulty: 1, explanation: "In spagnolo 'mesa' è femminile ('la mesa')." },
    { word: "sol", gender: "m", plurality: "s", translation: "sole", difficulty: 1, explanation: "Nomi che terminano in '-l' sono solitamente maschili." },

    // MEDIUM (More complex concordances)
    { word: "árboles", gender: "m", plurality: "p", translation: "alberi", difficulty: 2, explanation: "Plurale di 'árbol'. Termina in '-es' perché il singolare finisce in consonante." },
    { word: "ciudades", gender: "f", plurality: "p", translation: "città", difficulty: 2, explanation: "Plurale di 'ciudad'. I nomi in '-dad' sono sempre femminili." },
    { word: "felices", gender: "both", plurality: "p", translation: "felici", difficulty: 2, explanation: "Plurale di 'feliz'. Gli aggettivi in '-z' sono invariabili nel genere." },
    { word: "difícil", gender: "both", plurality: "s", translation: "difficile", difficulty: 2, explanation: "Aggettivo invariabile: termina in consonante, uguale per entrambi i generi." },
    { word: "canción", gender: "f", plurality: "s", translation: "canzone", difficulty: 2, explanation: "Le parole che finiscono in '-ción' sono sempre femminili." },
    { word: "corazones", gender: "m", plurality: "p", translation: "cuori", difficulty: 2, explanation: "Plurale di 'corazón', maschile che termina in '-ón'." },
    { word: "hermosa", gender: "f", plurality: "s", translation: "bella", difficulty: 2, explanation: "Aggettivo femminile singolare (finisce in '-a')." },
    { word: "grandes", gender: "both", plurality: "p", translation: "grandi", difficulty: 2, explanation: "Plurale di 'grande', aggettivo invariabile nel genere." },
    { word: "luz", gender: "f", plurality: "s", translation: "luce", difficulty: 2, explanation: "Sostantivo femminile singolare ('la luz')." },
    { word: "papel", gender: "m", plurality: "s", translation: "carta", difficulty: 2, explanation: "Sostantivo maschile che termina in '-el'." },

    // HARD (Exceptions or irregulars)
    { word: "mano", gender: "f", plurality: "s", translation: "mano", difficulty: 3, explanation: "Eccezione: sebbene finisca in '-o', è femminile ('la mano')." },
    { word: "problema", gender: "m", plurality: "s", translation: "problema", difficulty: 3, explanation: "Eccezione: molte parole di origine greca in '-ma' sono maschili ('el problema')." },
    { word: "mapa", gender: "m", plurality: "s", translation: "mappa", difficulty: 3, explanation: "Eccezione: parola maschile nonostante termini in '-a' ('el mapa')." },
    { word: "día", gender: "m", plurality: "s", translation: "giorno", difficulty: 3, explanation: "Eccezione: 'giorno' è maschile in spagnolo ('el día')." },
    { word: "sofá", gender: "m", plurality: "s", translation: "divano", difficulty: 3, explanation: "Parole accentate alla fine possono essere maschili ('el sofá')." },
    { word: "agua", gender: "f", plurality: "s", translation: "acqua", difficulty: 3, explanation: "Femminile, ma usa l'articolo 'el' al singolare per eufonia ('el agua')." },
    { word: "hambre", gender: "f", plurality: "s", translation: "fame", difficulty: 3, explanation: "Femminile singolare, come 'agua' usa 'el' per eufonia ('el' hambre)." },
    { word: "programas", gender: "m", plurality: "p", translation: "programmi", difficulty: 3, explanation: "Plurale di 'programa', maschile in '-ma'." },
    { word: "planetas", gender: "m", plurality: "p", translation: "pianeti", difficulty: 3, explanation: "Maschile singolare 'el planeta', quindi maschile plurale." },
    { word: "sistema", gender: "m", plurality: "s", translation: "sistema", difficulty: 3, explanation: "Altro nome maschile di origine greca che termina in '-ma'." },
];


const COMMON_NOUNS: [string, "m" | "f", "s" | "p", string, string][] = [
    ["ventana", "f", "s", "finestra", "Termina in '-a', femminile singolare."],
    ["puerta", "f", "s", "porta", "Termina in '-a', tipico del femminile."],
    ["auto", "m", "s", "auto", "Termina in '-o', maschile singolare."],
    ["bicicleta", "f", "s", "bicicletta", "Sostantivo femminile singolare."],
    ["escuela", "f", "s", "scuola", "Termina in '-a', femminile singolare."],
    ["maestro", "m", "s", "maestro", "Riferito a persona maschile singolare."],
    ["madre", "f", "s", "madre", "Femminile naturale."],
    ["padre", "m", "s", "padre", "Maschile naturale."],
    ["hermano", "m", "s", "fratello", "Termina in '-o', maschile singolare."],
    ["comida", "f", "s", "cibo", "In spagnolo 'comida' è femminile."],
    ["leche", "f", "s", "latte", "In spagnolo 'leche' è femminile ('la leche')."],
    ["pan", "m", "s", "pane", "Maschile singolare."],
    ["fruta", "f", "s", "frutta", "Femminile singolare."],
    ["manzana", "f", "s", "mela", "Termina in '-a', femminile."],
    ["naranja", "f", "s", "arancia", "Termina in '-a', femminile."],
    ["viaje", "m", "s", "viaggio", "I nomi in '-aje' sono sempre maschili."],
    ["playa", "f", "s", "spiaggia", "Termina in '-a', femminile."],
    ["montaña", "f", "s", "montagna", "Femminile singolare."],
    ["mar", "m", "s", "mare", "Solitamente maschile ('el mar'), a volte femminile nel linguaggio poetico."],
    ["cielo", "m", "s", "cielo", "Sostantivo maschile singolare."],
    ["nube", "f", "s", "nuvola", "Sostantivo femminile singolare ('la nube')."],
    ["lluvia", "f", "s", "pioggia", "Termina in '-a', femminile."],
    ["tiempo", "m", "s", "tempo", "Maschile singolare."],
    ["mundo", "m", "s", "mondo", "Maschile singolare."],
    ["gente", "f", "s", "gente", "Nome collettivo femminile singolare ('la gente')."],
    ["persona", "f", "s", "persona", "Sempre femminile, anche se riferito a uomini."],
    ["trabajo", "m", "s", "lavoro", "Maschile singolare."],
    ["vida", "f", "s", "vita", "Termina in '-a', femminile."],
    ["noche", "f", "s", "notte", "Parola femminile ('la noche')."],
    ["mañana", "f", "s", "mattina", "Parola femminile ('la mañana')."],
    ["tarde", "f", "s", "pomeriggio", "Parola femminile ('la tarde')."],
    ["semana", "f", "s", "settimana", "Femminile singolare."],
    ["mes", "m", "s", "mese", "I nomi dei mesi e 'mes' sono maschili."],
    ["año", "m", "s", "anno", "Termina in '-o', maschile."],
    ["hora", "f", "s", "ora", "Femminile singolare."],
    ["camino", "m", "s", "strada", "Maschile singolare."],
    ["lugar", "m", "s", "luogo", "Maschile singolare."],
    ["clase", "f", "s", "classe", "Femminile singolare ('la clase')."],
    ["parte", "f", "s", "parte", "Femminile singolare ('la parte')."],
    ["verdad", "f", "s", "verità", "I nomi in '-dad' sono femminili."],
    ["paz", "f", "s", "pace", "Femminile singolare ('la paz')."],
    ["guerra", "f", "s", "guerra", "Femminile singolare."]
];

COMMON_NOUNS.forEach(([word, gender, plurality, translation, explanation]) => {
    VOCABULARY.push({ word, gender, plurality, translation, difficulty: 1, explanation });
});


export const SENTENCES: SentenceItem[] = [
    // EASY
    { id: 1, correct_order: ["El", "coche", "es", "rojo"], words: ["rojo", "El", "es", "coche"], translation: "L'auto è rossa", difficulty: 1 },
    { id: 2, correct_order: ["La", "casa", "es", "grande"], words: ["grande", "casa", "es", "La"], translation: "La casa è grande", difficulty: 1 },
    { id: 3, correct_order: ["Yo", "soy", "un", "niño"], words: ["niño", "Yo", "un", "soy"], translation: "Io sono un bambino", difficulty: 1 },
    { id: 4, correct_order: ["Ella", "come", "una", "manzana"], words: ["manzana", "come", "Ella", "una"], translation: "Lei mangia una mela", difficulty: 1 },
    { id: 5, correct_order: ["Nosotros", "vivimos", "en", "Madrid"], words: ["en", "vivimos", "Madrid", "Nosotros"], translation: "Noi viviamo a Madrid", difficulty: 1 },
    { id: 6, correct_order: ["El", "perro", "corre", "rápido"], words: ["perro", "rápido", "corre", "El"], translation: "Il cane corre veloce", difficulty: 1 },
    { id: 7, correct_order: ["Mi", "amigo", "es", "italiano"], words: ["italiano", "es", "amigo", "Mi"], translation: "Il mio amico è italiano", difficulty: 1 },
    { id: 8, correct_order: ["¿Cómo", "te", "llamas", "tú?"], words: ["llamas", "tú?", "¿Cómo", "te"], translation: "Come ti chiami tu?", difficulty: 1 },
    { id: 9, correct_order: ["Tengo", "dos", "hermanos", "menores"], words: ["dos", "menores", "Tengo", "hermanos"], translation: "Ho due fratelli minori", difficulty: 1 },
    { id: 10, correct_order: ["Me", "gusta", "mucho", "el", "chocolate"], words: ["mucho", "el", "gusta", "chocolate", "Me"], translation: "Mi piace molto il cioccolato", difficulty: 1 },

    // MEDIUM
    { id: 11, correct_order: ["Ayer", "fuimos", "al", "cine", "con", "María"], words: ["cine", "fuimos", "al", "María", "con", "Ayer"], translation: "Ieri siamo andati al cinema con Maria", difficulty: 2 },
    { id: 12, correct_order: ["Mañana", "tengo", "que", "estudiar", "para", "el", "examen"], words: ["examen", "tengo", "que", "estudiar", "Mañana", "el", "para"], translation: "Domani devo studiare per l'esame", difficulty: 2 },
    { id: 13, correct_order: ["No", "puedo", "ir", "a", "la", "fiesta", "esta", "noche"], words: ["fiesta", "ir", "puedo", "esta", "No", "noche", "la", "a"], translation: "Non posso andare alla festa stasera", difficulty: 2 },
    { id: 14, correct_order: ["El", "libro", "que", "estoy", "leyendo", "es", "muy", "interesante"], words: ["leyendo", "estoy", "que", "muy", "interesante", "El", "es", "libro"], translation: "Il libro che sto leggendo è molto interessante", difficulty: 2 },
    { id: 15, correct_order: ["¿A", "qué", "hora", "empieza", "la", "película?"], words: ["hora", "la", "empieza", "película?", "¿A", "qué"], translation: "A che ora inizia il film?", difficulty: 2 },

    // HARD
    { id: 16, correct_order: ["Si", "tuviera", "dinero,", "viajaría", "por", "todo", "el", "mundo"], words: ["viajaría", "mundo", "dinero,", "todo", "tuviera", "Si", "por", "el"], translation: "Se avessi soldi, viaggerei per tutto il mondo", difficulty: 3 },
    { id: 17, correct_order: ["Espero", "que", "tengas", "un", "buen", "fin", "de", "semana"], words: ["buen", "tengas", "examen", "que", "un", "semana", "de", "Espero", "fin"], translation: "Spero che tu abbia un buon fine settimana", difficulty: 3 },
    { id: 18, correct_order: ["Aunque", "estaba", "cansado,", "siguió", "trabajando", "hasta", "muy", "tarde"], words: ["trabajando", "estaba", "cansado,", "tarde", "hasta", "Aunque", "siguió", "muy"], translation: "Sebbene fosse stanco, continuò a lavorare fino a molto tardi", difficulty: 3 },
];

const ADDITIONAL_SENTENCES: [string, string, number][] = [
    ["¿Dónde está el baño, por favor?", "Dov'è il bagno, per favore?", 1],
    ["Quisiera un café con leche y azúcar.", "Vorrei un caffè con latte e zucchero.", 1],
    ["Hace mucho calor en este lugar.", "Fa molto caldo in questo posto.", 1],
    ["El cielo está despejado hoy.", "Il cielo è sereno oggi.", 1],
    ["¿Cuál es tu color favorito?", "Qual è il tuo colore preferito?", 1],
    ["Estamos muy contentos de verte.", "Siamo molto contenti di vederti.", 1],
    ["Necesito comprar pan para la cena.", "Devo comprare il pane per la cena.", 1],
    ["El gato duerme sobre el sofá.", "Il gatto dorme sul divano.", 1],
    ["Ella toca la guitarra muy bien.", "Lei suona la chitarra molto bene.", 1],
    ["¿Vienes con nosotros al parque?", "Vieni con noi al parco?", 1],
    ["Me olvidé las llaves en casa.", "Ho dimenticato le chiavi a casa.", 2],
    ["¿Puedes hablar más despacio, por favor?", "Puoi parlare più lentamente, per favore?", 2],
    ["Este verano iré de vacaciones a España.", "Quest'estate andrò in vacanza in Spagna.", 2],
    ["No sé qué hacer este fin de semana.", "Non so cosa fare questo fine settimana.", 2],
    ["El restaurante cierra a las once de la noche.", "Il ristorante chiude alle undici di sera.", 2],
    ["Me gustaría aprender a cocinar platos típicos.", "Mi piacerebbe imparare a cucinare piatti tipici.", 2],
    ["Es importante beber mucha agua cada día.", "È importante bere molta acqua ogni giorno.", 2],
    ["Busco un hotel que no sea muy caro.", "Cerco un hotel che non sia molto caro.", 2],
    ["¿Has visto mi teléfono por alguna parte?", "Hai visto il mio telefono da qualche parte?", 2],
    ["Todavía no me he acostumbrado a este clima.", "Non mi sono ancora abituato a questo clima.", 3],
    ["Ojalá pudiera hablar español con fluidez.", "Magari potessi parlare spagnolo con scioltezza.", 3],
    ["No me importa lo que digan los demás.", "Non mi importa quello che dicono gli altri.", 3],
    ["A pesar de los problemas, seguimos adelante.", "Nonostante i problemi, andiamo avanti.", 3],
    ["Dudo que él venga a la reunión hoy.", "Dubito che lui venga alla riunione oggi.", 3],
    ["Para cuando llegues, ya habremos terminado.", "Per quando arriverai, avremo già finito.", 3],
];

ADDITIONAL_SENTENCES.forEach(([text, translation, difficulty], i) => {
    const clean_text = text.replace(/,/g, "").replace(/\./g, "").replace(/\?/g, "").replace(/!/g, "").replace(/¿/g, "").replace(/¡/g, "");
    const words = clean_text.split(" ");

    // Shuffle words deterministically or semi-randomly if needed, 
    // but a real random shuffle per session is better. We just prep it here.
    const shuffled = [...words].sort(() => Math.random() - 0.5);

    SENTENCES.push({
        id: 20 + i,
        correct_order: words,
        words: shuffled,
        translation,
        difficulty
    });
});

export function getGrammarMatch(difficulty: number): { exercise: VocabularyItem[] } {
    let available = VOCABULARY.filter(v => v.difficulty === difficulty);
    if (available.length === 0) available = VOCABULARY;

    // Randomly pick 5 items
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return { exercise: shuffled.slice(0, 5) };
}

export function getWordOrder(difficulty: number): SentenceItem {
    let available = SENTENCES.filter(s => s.difficulty === difficulty);
    if (available.length === 0) available = SENTENCES;

    const randomItem = available[Math.floor(Math.random() * available.length)];
    // Return a copy so words don't get permanently broken
    return {
        ...randomItem,
        words: [...randomItem.correct_order].sort(() => Math.random() - 0.5)
    };
}

export function validateWordOrder(id: number, user_order: string[]): { correct: boolean } {
    const exercise = SENTENCES.find(s => s.id === id);
    if (!exercise) return { correct: false };

    // Arrays must match exactly
    const is_correct = exercise.correct_order.length === user_order.length &&
        exercise.correct_order.every((val, index) => val === user_order[index]);

    return { correct: is_correct };
}
