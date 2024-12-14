import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import './App.css';

function App() {
  const [display, setDisplay] = useState('');
  const [scientificMode, setScientificMode] = useState(false);
  const [isDegrees, setIsDegrees] = useState(true);

  const handleKeyPress = (event) => {
    const { key } = event;

    if (key === 'Enter') {
      calculate();
    } else if (key === 'c' || key === 'C') {
      clear();
    } else if (!isNaN(key) || '+-*/().'.includes(key)) {
      handleInput(key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleInput = (input) => {
   
    if (input === '.') {
      if (display.split(/[\+\-\*\/\(\)]/).pop().includes('.')) return;
    }

    
    if (input === '(' && display.includes(')') && !display.includes('(')) return;

   
    if (input === ')') {
      const openCount = (display.match(/\(/g) || []).length;
      const closeCount = (display.match(/\)/g) || []).length;
      if (closeCount >= openCount) return;
    }

    setDisplay((prev) => prev + input);
  };

  const clear = () => {
    setDisplay('');
  };


  const calculate = () => {
    try {
      if (display.includes('/0')) {
        setDisplay('Error');
        return;
      }
  
      let formattedExpression = display;
  
      formattedExpression = formattedExpression
        .replace(/sin\((.*?)\)/g, (_, angle) => `Math.sin(${toRadians(angle)})`)
        .replace(/cos\((.*?)\)/g, (_, angle) => `Math.cos(${toRadians(angle)})`)
        .replace(/tan\((.*?)\)/g, (_, angle) => `Math.tan(${toRadians(angle)})`)
        .replace(/\u221a\((.*?)\)/g, (_, number) => `Math.sqrt(${number})`); 
  
      const result = evaluate(formattedExpression);
      setDisplay(result.toString());
    } catch (error) {
      console.log(error)
      setDisplay('Error');
    }
  };

  const toRadians = (angle) => {
    if (isDegrees) {
      return (parseFloat(angle) * Math.PI) / 180;
    }
    return parseFloat(angle);
  };

  const toggleScientificMode = () => {
    setScientificMode(!scientificMode);
  };

  const toggleDegreeRad = () => {
    setIsDegrees(!isDegrees);
  };

  const handleScientificFunction = (func) => {
    setDisplay((prev) => `${prev}${func}(`);
  };

  return (
    <div className="calculator">
      <div className="header">
        <div className="mode-controls">
          <span className="mode-toggle" onClick={toggleDegreeRad}>
            {isDegrees ? 'deg' : 'rad'}
          </span>
          <span className="scientific-mode-toggle" onClick={toggleScientificMode}>
            {scientificMode ? 'Basic' : 'Scientific'}
          </span>
        </div>
      </div>
      <div className="display">{display || '0'}</div>
      <div className="buttons">
        <button onClick={clear} className="clear">AC</button>
        <button onClick={() => handleInput('%')} className="percent">%</button>
        <button onClick={() => handleInput('/')} className="operation">÷</button>


        {scientificMode && (
          <>
          <button onClick={() => handleScientificFunction('sin')} className="operation">sin</button>
           <button onClick={() => handleScientificFunction('cos')} className="operation">cos</button>
          <button onClick={() => handleScientificFunction('tan')} className="operation">tan</button>
          <button onClick={() => handleScientificFunction('√')} className="operation">√</button>
          </>
        )}
        <button onClick={() => handleInput('*')} className="operation">×</button>
      

        <button onClick={() => handleInput('7')}>7</button>
        <button onClick={() => handleInput('8')}>8</button>
        <button onClick={() => handleInput('9')}>9</button>
        <button onClick={() => handleInput('-')} className="operation">−</button>

        <button onClick={() => handleInput('4')}>4</button>
        <button onClick={() => handleInput('5')}>5</button>
        <button onClick={() => handleInput('6')}>6</button>
        <button onClick={() => handleInput('+')} className="operation">+</button>

        <button onClick={() => handleInput('1')}>1</button>
        <button onClick={() => handleInput('2')}>2</button>
        <button onClick={() => handleInput('3')}>3</button>
        <button onClick={() => handleInput('.')} className="dot">.</button>
        <button onClick={() => handleInput('0')} className="zero">0</button>
        <button onClick={() => handleInput('(')} className="parenthesis">(</button>
        <button onClick={() => handleInput(')')} className="parenthesis">)</button>
        <button onClick={calculate} className="equal">=</button>
      </div>
    </div>
  );
}

export default App;