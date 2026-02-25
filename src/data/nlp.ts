export interface GrammarError {
    word: string;
    position: number;
    suggestion: string;
    rule: string;
}

// A simple local NLP mock since we are moving to fully serverless and can't use a heavy Python NLP layer
// In a real app, this might call a serverless API endpoint connecting to LanguageTool or OpenAI
export function validatePresentationLocally(text: string): { is_valid: boolean; errors: GrammarError[] } {
    const errors: GrammarError[] = [];
    const lowerText = text.toLowerCase();

    // Mock rule 1: "Yo se" -> "Yo sé"
    if (/\byo se\b/i.test(lowerText)) {
        errors.push({
            word: "Yo se",
            position: lowerText.indexOf("yo se"),
            suggestion: "Yo sé",
            rule: "Falta tilde en el verbo 'saber'."
        });
    }

    // Mock rule 2: "el agua es muy lindo" -> "el agua es muy linda" (agua is feminine despite using 'el')
    if (/\bel agua es muy lindo\b/i.test(lowerText)) {
        errors.push({
            word: "lindo",
            position: lowerText.indexOf("lindo"),
            suggestion: "linda",
            rule: "'Agua' es un sustantivo femenino."
        });
    }

    // Mock rule 3: "la problema" -> "el problema"
    const objProblemaRegex = /\bla problema\b/ig;
    let match;
    while ((match = objProblemaRegex.exec(lowerText)) !== null) {
        errors.push({
            word: text.substr(match.index, 11),
            position: match.index,
            suggestion: "el problema",
            rule: "Se dice 'el problema' (excepción de género)."
        });
    }

    // Require minimum length for a valid presentation
    if (text.split(" ").length < 5) {
        errors.push({
            word: text.trim(),
            position: 0,
            suggestion: text + " ...",
            rule: "El texto es muy corto. ¡Escribe un poco más!"
        });
    }

    return {
        is_valid: errors.length === 0,
        errors
    };
}
