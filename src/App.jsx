import React, { useState, useEffect } from 'react';
import { conversionData } from './data/conversions';

const App = () => {
  const [category, setCategory] = useState('currency');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState([]);

  // Initialize units when category changes
  useEffect(() => {
    const units = conversionData[category].units;
    if (units) {
      setFromUnit(units[0]);
      setToUnit(units[1]);
    }
  }, [category]);

  // Load history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('conv_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Conversion Logic
  const performConversion = () => {
    if (!amount || isNaN(amount)) return 0;
    
    const val = parseFloat(amount);
    const currentCat = conversionData[category];

    if (category === 'temperature') {
      if (fromUnit === toUnit) return val;
      if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') return (val * 9/5) + 32;
      if (fromUnit === 'Celsius' && toUnit === 'Kelvin') return val + 273.15;
      if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') return (val - 32) * 5/9;
      if (fromUnit === 'Fahrenheit' && toUnit === 'Kelvin') return (val - 32) * 5/9 + 273.15;
      if (fromUnit === 'Kelvin' && toUnit === 'Celsius') return val - 273.15;
      if (fromUnit === 'Kelvin' && toUnit === 'Fahrenheit') return (val - 273.15) * 9/5 + 32;
      return val;
    }

    const fromRate = currentCat.rates[fromUnit];
    const toRate = currentCat.rates[toUnit];
    
    if (!fromRate || !toRate) return 0;

    // Convert to base unit (where rate is 1) then to target unit
    const baseValue = val / fromRate;
    return baseValue * toRate;
  };

  useEffect(() => {
    const res = performConversion();
    setResult(res);
  }, [amount, fromUnit, toUnit, category]);

  const addToHistory = () => {
    const resValue = result.toLocaleString(undefined, { maximumFractionDigits: 4 });
    const newEntry = {
      id: Date.now(),
      category: conversionData[category].label,
      from: `${amount} ${fromUnit}`,
      to: `${resValue} ${toUnit}`,
      time: new Date().toLocaleTimeString()
    };
    const updatedHistory = [newEntry, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('conv_history', JSON.stringify(updatedHistory));
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getIcon = (cat) => {
    switch (cat) {
      case 'currency': return '💰';
      case 'length': return '📏';
      case 'weight': return '⚖️';
      case 'temperature': return '🌡️';
      default: return '⚙️';
    }
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SwiftConvert
        </h1>
        <p style={{ color: '#94a3b8' }}>Premium Unit & Currency Converter</p>
      </header>

      <div className="converter-container">
        <div className="category-selector">
          {Object.keys(conversionData).map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              <span style={{ fontSize: '1.2rem' }}>{getIcon(cat)}</span>
              {conversionData[cat].label}
            </button>
          ))}
        </div>

        <div className="glass-card">
          <div className="input-group">
            <label>From</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                {conversionData[category].units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="swap-btn" onClick={swapUnits} title="Swap Units">
            🔄
          </button>

          <div className="input-group">
            <label>To</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {conversionData[category].units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="result-area">
            <div className="result-label">Result</div>
            <div className="result-value">
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              <span style={{ fontSize: '1rem', color: '#818cf8', marginLeft: '0.5rem' }}>{toUnit}</span>
            </div>
          </div>

          <button 
            onClick={addToHistory}
            style={{ 
              marginTop: '1.5rem', 
              width: '100%', 
              background: 'transparent', 
              border: '1px solid #6366f1', 
              color: '#818cf8',
              padding: '0.75rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Save to History
          </button>
        </div>

        {history.length > 0 && (
          <div className="history-container glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="history-title" style={{ margin: 0 }}>Recent Conversions</h3>
              <button 
                onClick={() => { setHistory([]); localStorage.removeItem('conv_history'); }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Reset
              </button>
            </div>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div>
                    <span style={{ fontWeight: '600' }}>{item.from}</span> = <span style={{ color: '#818cf8' }}>{item.to}</span>
                  </div>
                  <div className="time">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '4rem', color: '#475569', fontSize: '0.875rem' }}>
        &copy; 2026 SwiftConvert Premium • Built with React
      </footer>
    </div>
  );
};

export default App;
