/**
 * Vigenere Cipher Engine
 */

export const VigenereEngine = {
    encrypt: (text, key) => {
        let result = "";
        let cleanText = text.toUpperCase().replace(/[^A-Z]/g, "");
        let cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");

        if (cleanKey.length === 0) return cleanText;

        for (let i = 0, j = 0; i < cleanText.length; i++) {
            let c = cleanText.charCodeAt(i) - 65;
            let k = cleanKey.charCodeAt(j % cleanKey.length) - 65;
            result += String.fromCharCode(((c + k) % 26) + 65);
            j++;
        }
        return result;
    },

    decrypt: (text, key) => {
        let result = "";
        let cleanText = text.toUpperCase().replace(/[^A-Z]/g, "");
        let cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");

        if (cleanKey.length === 0) return cleanText;

        for (let i = 0, j = 0; i < cleanText.length; i++) {
            let c = cleanText.charCodeAt(i) - 65;
            let k = cleanKey.charCodeAt(j % cleanKey.length) - 65;
            result += String.fromCharCode(((c - k + 26) % 26) + 65);
            j++;
        }
        return result;
    }
};
