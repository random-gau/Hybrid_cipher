/**
 * Key Strength Evaluator Engine
 */

export const StrengthEvaluator = {
    calculateEntropy: (key) => {
        if (!key) return 0;
        const charset = new Set(key).size;
        const length = key.length;
        // Simplified Shannon Entropy calculation
        return length * Math.log2(charset || 1);
    },

    evaluate: (key) => {
        if (!key) return { score: 0, label: "Empty", color: "#666" };

        let score = 0;
        if (key.length >= 8) score += 20;
        if (key.length >= 12) score += 20;
        if (/[A-Z]/.test(key)) score += 15;
        if (/[a-z]/.test(key)) score += 15;
        if (/[0-9]/.test(key)) score += 15;
        if (/[^A-Za-z0-9]/.test(key)) score += 15;

        let label = "Weak";
        let color = "#ff4d4d";
        if (score >= 80) {
            label = "Very Strong";
            color = "#00ff88";
        } else if (score >= 60) {
            label = "Strong";
            color = "#bcff00";
        } else if (score >= 40) {
            label = "Fair";
            color = "#ffcc00";
        }

        return { score, label, color };
    },

    getLearningFeedback: (key, history = []) => {
        const { score } = StrengthEvaluator.evaluate(key);
        const averageHistory = history.length > 0 ? history.reduce((a, b) => a + b, 0) / history.length : 0;

        if (score > averageHistory + 10) return "Excellent! You are discovering stronger patterns.";
        if (score < averageHistory - 10) return "Warning: This key is significantly weaker than your previous patterns.";
        return "Stable pattern detected. Keep exploring complex character combinations.";
    }
};
