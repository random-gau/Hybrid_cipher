import React, { useState, useEffect, useMemo } from 'react';
import {
  PlayfairEngine,
  VigenereEngine,
  ColumnarEngine,
  StrengthEvaluator
} from './engines';
import './index.css';

function App() {
  const [plaintext, setPlaintext] = useState('');
  const [keys, setKeys] = useState({
    playfair: '',
    vigenere: '',
    columnar: ''
  });
  const [order, setOrder] = useState(['Playfair', 'Vigenere', 'Columnar']);
  const [isEncryptMode, setIsEncryptMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [logs, setLogs] = useState(['System initialized...', 'Encryption engine ready.']);
  const [keyHistory, setKeyHistory] = useState(() => {
    const saved = localStorage.getItem('hybrid_key_history');
    return saved ? JSON.parse(saved) : [];
  });

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
  };

  const updateOrder = (idx, val) => {
    const newOrder = [...order];
    newOrder[idx] = val;
    setOrder(newOrder);
  };

  const handleReset = () => {
    setPlaintext('');
    setKeys({
      playfair: '',
      vigenere: '',
      columnar: ''
    });
    setOrder(['Playfair', 'Vigenere', 'Columnar']);
    setExecutionResult(null);
    addLog('System reset to defaults.');
  };

  const handleProcess = (mode) => {
    // Validation
    if (!plaintext.trim()) {
      addLog('⚠️ ERROR: No text entered! Please provide input.');
      return;
    }

    if (!keys.playfair.trim()) {
      addLog('⚠️ ERROR: Playfair key is required!');
      return;
    }
    if (!keys.vigenere.trim()) {
      addLog('⚠️ ERROR: Vigenère key is required!');
      return;
    }
    if (!keys.columnar.trim()) {
      addLog('⚠️ ERROR: Columnar key is required!');
      return;
    }

    const uniqueCiphers = new Set(order);
    if (uniqueCiphers.size !== order.length) {
      addLog('⚠️ ERROR: Duplicate ciphers detected! Each stage must use a unique algorithm.');
      return;
    }

    setIsEncryptMode(mode);

    let current = plaintext;
    let steps = [];

    try {
      if (mode) {
        steps.push({ name: 'Original Message', value: plaintext });
        order.forEach((cipher) => {
          if (cipher === 'Playfair') {
            current = PlayfairEngine.encrypt(current, keys.playfair);
            steps.push({ name: 'Playfair', value: current });
          } else if (cipher === 'Vigenere') {
            current = VigenereEngine.encrypt(current, keys.vigenere);
            steps.push({ name: 'Vigenère', value: current });
          } else if (cipher === 'Columnar') {
            current = ColumnarEngine.encrypt(current, keys.columnar);
            steps.push({ name: 'Columnar', value: current });
          }
        });
      } else {
        steps.push({ name: 'Ciphertext Input', value: plaintext });
        [...order].reverse().forEach((cipher) => {
          if (cipher === 'Playfair') {
            current = PlayfairEngine.decrypt(current, keys.playfair);
            steps.push({ name: 'Playfair', value: current });
          } else if (cipher === 'Vigenere') {
            current = VigenereEngine.decrypt(current, keys.vigenere);
            steps.push({ name: 'Vigenère', value: current });
          } else if (cipher === 'Columnar') {
            current = ColumnarEngine.decrypt(current, keys.columnar);
            steps.push({ name: 'Columnar', value: current });
          }
        });
      }

      setExecutionResult({ final: current, steps });

      const currentScore = strength.score;
      const newHistory = [...keyHistory, currentScore].slice(-10);
      setKeyHistory(newHistory);
      localStorage.setItem('hybrid_key_history', JSON.stringify(newHistory));
      addLog(`${mode ? 'Encryption' : 'Decryption'} pipeline executed successfully.`);

    } catch (e) {
      addLog('❌ ERROR: Pipeline execution failed.');
      console.error(e);
    }
  };

  const strength = useMemo(() => {
    const combinedKey = Object.values(keys).join('');
    return StrengthEvaluator.evaluate(combinedKey);
  }, [keys]);

  const learningMsg = useMemo(() => {
    const combinedKey = Object.values(keys).join('');
    return StrengthEvaluator.getLearningFeedback(combinedKey, keyHistory);
  }, [keys, keyHistory]);

  const handleCopy = () => {
    if (!executionResult) return;
    navigator.clipboard.writeText(executionResult.final);
    setCopied(true);
    addLog('Final output copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Hybrid Cipher</h1>
        <p>Quantum-Resistant Multi-Stage Pipeline</p>
      </header>

      <div className="main-grid">
        {/* Left Side: Inputs */}
        <div className="panel">
          <div className="panel-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>⚡</span> Input Control
            </div>
            <button className="refresh-btn" onClick={handleReset} title="Reset All Defaults">
              🔄 RESET
            </button>
          </div>

          <div className="input-group">
            <label>Plaintext / Ciphertext</label>
            <textarea
              className="input-field"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter message..."
            />
          </div>

          <div className="input-group">
            <label>Pipeline Order Configuration</label>
            <div className="key-grid">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="input-group">
                  <label>Stage {idx + 1}</label>
                  <select
                    className="input-field select-field"
                    value={order[idx]}
                    onChange={(e) => updateOrder(idx, e.target.value)}
                  >
                    <option value="Playfair">Playfair</option>
                    <option value="Vigenere">Vigenere</option>
                    <option value="Columnar">Columnar</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="key-grid">
            <div className="input-group">
              <label>Playfair Key</label>
              <input
                className="input-field"
                value={keys.playfair}
                onChange={(e) => setKeys({ ...keys, playfair: e.target.value })}
                placeholder="e.g. SECRET"
              />
            </div>
            <div className="input-group">
              <label>Vigenère Key</label>
              <input
                className="input-field"
                value={keys.vigenere}
                onChange={(e) => setKeys({ ...keys, vigenere: e.target.value })}
                placeholder="e.g. CRYPTO"
              />
            </div>
            <div className="input-group">
              <label>Columnar Key</label>
              <input
                className="input-field"
                value={keys.columnar}
                onChange={(e) => setKeys({ ...keys, columnar: e.target.value })}
                placeholder="e.g. KEYWORD"
              />
            </div>
          </div>

          <div className="controls">
            <button
              className="btn btn-primary"
              onClick={() => handleProcess(true)}
            >
              🔒 ENCRYPT PIPELINE
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleProcess(false)}
            >
              🔓 DECRYPT PIPELINE
            </button>
          </div>

          <div className="strength-meter">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>KEY STRENGTH</span>
              <span style={{ color: strength.color, fontWeight: 800 }}>{strength.label}</span>
            </div>
            <div className="meter-bar">
              <div
                className="meter-fill"
                style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
              ></div>
            </div>
            <div className="learning-panel">
              <strong>AI Insights:</strong> {learningMsg}
            </div>
          </div>
        </div>

        {/* Right Side: Results & Pipeline */}
        <div className="panel">
          <div className="panel-title">
            <span style={{ color: 'var(--accent-purple)' }}>⚙️</span> Pipeline Execution
          </div>

          <div className="pipeline">
            {executionResult ? (
              executionResult.steps.map((step, idx) => (
                <div key={idx} className="step" style={{ borderLeftColor: idx === executionResult.steps.length - 1 ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>
                  <div className="step-header">
                    <span>Step {idx + 1}: {step.name}</span>
                    <span>{isEncryptMode ? 'ENCRYPTING' : 'DECRYPTING'}</span>
                  </div>
                  <div className="step-value">{step.value}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                Pipeline Idle. Configure your keys and click Encrypt or Decrypt to see results.
              </div>
            )}
          </div>

          {executionResult && (
            <div className="input-group" style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>{isEncryptMode ? 'FINAL CIPHERTEXT' : 'ORIGINAL MESSAGE'}</label>
                <button
                  className="copy-btn"
                  onClick={handleCopy}
                >
                  {copied ? '✓ COPIED' : '⧉ COPY'}
                </button>
              </div>
              <div className="input-field final-output" style={{ minHeight: '60px', background: 'rgba(0, 242, 255, 0.05)', borderColor: 'var(--accent-cyan)' }}>
                {executionResult.final}
              </div>
            </div>
          )}

          <div className="panel-title" style={{ marginTop: '20px', fontSize: '1rem' }}>
            <span style={{ color: 'var(--accent-green)' }}>◈</span> System Logs
          </div>
          <div className="logs">
            {logs.map((log, i) => (
              <div key={i} className="log-entry">{log}</div>
            ))}
          </div>
        </div >
      </div >
    </div >
  );
}

export default App;
