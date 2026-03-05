/**
 * Columnar Transposition Cipher Engine
 */

export const ColumnarEngine = {
    encrypt: (text, key) => {
        let cleanText = text.toUpperCase().replace(/[^A-Z]/g, "");
        let cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
        if (cleanKey.length === 0 || cleanText.length === 0) return cleanText;

        let colCount = cleanKey.length;
        let rowCount = Math.floor(cleanText.length / colCount);
        let extra = cleanText.length % colCount;

        // Create a representation of columns
        let columns = Array.from({ length: colCount }, (_, i) => ({
            index: i,
            char: cleanKey[i],
            data: []
        }));

        // Fill data row by row (irregular)
        let k = 0;
        for (let r = 0; r < rowCount + 1; r++) {
            for (let c = 0; c < colCount; c++) {
                if (k < cleanText.length) {
                    columns[c].data.push(cleanText[k++]);
                }
            }
        }

        // Sort columns by key character
        let sortedCols = [...columns].sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index);

        let result = "";
        for (let col of sortedCols) {
            result += col.data.join('');
        }
        return result;
    },

    decrypt: (text, key) => {
        let cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
        if (cleanKey.length === 0 || text.length === 0) return text;

        let colCount = cleanKey.length;
        let rowCount = Math.floor(text.length / colCount);
        let extra = text.length % colCount;

        // Determine number of characters per column in original order
        let colLengths = new Array(colCount).fill(rowCount);
        for (let i = 0; i < extra; i++) {
            colLengths[i]++;
        }

        // Sort to know order of characters in the ciphertext
        let keyArr = cleanKey.split('').map((char, index) => ({ char, index, length: colLengths[index] }));
        let sortedKey = [...keyArr].sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index);

        let colData = new Array(colCount);
        let curr = 0;
        for (let item of sortedKey) {
            colData[item.index] = text.substring(curr, curr + item.length).split('');
            curr += item.length;
        }

        let result = "";
        for (let r = 0; r < rowCount + 1; r++) {
            for (let c = 0; c < colCount; c++) {
                if (colData[c] && colData[c].length > 0) {
                    result += colData[c].shift();
                }
            }
        }
        return result;
    }
};
