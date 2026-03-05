/**
 * Playfair Cipher Engine
 */

export const PlayfairEngine = {
  generateMatrix: (key) => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // 'J' is excluded, replaced by 'I'
    let matrix = [];
    let seen = new Set();
    let cleanKey = key.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");

    for (let char of cleanKey) {
      if (!seen.has(char)) {
        matrix.push(char);
        seen.add(char);
      }
    }

    for (let char of alphabet) {
      if (!seen.has(char)) {
        matrix.push(char);
        seen.add(char);
      }
    }

    let grid = [];
    for (let i = 0; i < 25; i += 5) {
      grid.push(matrix.slice(i, i + 5));
    }
    return grid;
  },

  findPosition: (matrix, char) => {
    if (!char) return null;
    let searchChar = char.toUpperCase() === 'J' ? 'I' : char.toUpperCase();
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (matrix[row][col] === searchChar) return { row, col };
      }
    }
    return null;
  },

  prepareText: (text) => {
    let clean = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let prepared = "";
    for (let i = 0; i < clean.length; i++) {
      prepared += clean[i];
      if (i < clean.length - 1 && clean[i] === clean[i + 1] && prepared.length % 2 !== 0) {
        prepared += "X";
      }
    }
    if (prepared.length % 2 !== 0) prepared += "X";
    return prepared;
  },

  encrypt: (text, key) => {
    const matrix = PlayfairEngine.generateMatrix(key);
    const prepared = PlayfairEngine.prepareText(text);
    let result = "";

    for (let i = 0; i < prepared.length; i += 2) {
      let a = PlayfairEngine.findPosition(matrix, prepared[i]);
      let b = PlayfairEngine.findPosition(matrix, prepared[i + 1]);

      if (!a || !b) continue;

      if (a.row === b.row) {
        result += matrix[a.row][(a.col + 1) % 5];
        result += matrix[b.row][(b.col + 1) % 5];
      } else if (a.col === b.col) {
        result += matrix[(a.row + 1) % 5][a.col];
        result += matrix[(b.row + 1) % 5][b.col];
      } else {
        result += matrix[a.row][b.col];
        result += matrix[b.row][a.col];
      }
    }
    return result;
  },

  decrypt: (text, key) => {
    const matrix = PlayfairEngine.generateMatrix(key);
    let cleanText = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    if (cleanText.length % 2 !== 0) cleanText += "X";

    let decrypted = "";

    for (let i = 0; i < cleanText.length; i += 2) {
      let a = PlayfairEngine.findPosition(matrix, cleanText[i]);
      let b = PlayfairEngine.findPosition(matrix, cleanText[i + 1]);

      if (!a || !b) continue;

      if (a.row === b.row) {
        decrypted += matrix[a.row][(a.col + 4) % 5];
        decrypted += matrix[b.row][(b.col + 4) % 5];
      } else if (a.col === b.col) {
        decrypted += matrix[(a.row + 4) % 5][a.col];
        decrypted += matrix[(b.row + 4) % 5][b.col];
      } else {
        decrypted += matrix[a.row][b.col];
        decrypted += matrix[b.row][a.col];
      }
    }

    // Post-processing to remove Playfair fillers and padding
    let result = "";
    for (let i = 0; i < decrypted.length; i++) {
      // If we encounter an 'X'
      if (decrypted[i] === 'X') {
        // 1. Remove if it's a filler between two identical letters (e.g., HELXL -> HELL)
        if (i > 0 && i < decrypted.length - 1 && decrypted[i - 1] === decrypted[i + 1]) {
          continue;
        }
        // 2. Remove if it's a padding character at the very end
        if (i === decrypted.length - 1) {
          continue;
        }
      }
      result += decrypted[i];
    }

    return result;
  }
};
