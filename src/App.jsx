import React, { useState, useEffect } from 'react';
import './App.css';
import { evaluate, create, all } from 'mathjs';

const math = create(all);


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

    const operators = '+-*/%';
  
    if (operators.includes(input) && operators.includes(display[display.length - 1])) {
      setDisplay((prev) => prev.slice(0, -1) + input); 
      return;
    }
   
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

  const normalizeExpression = (expr) => {
    return expr.replace(/(\-{2,})/g, (match) => {
      return match.length % 2 === 0 ? '+' : '-';
    });
  };


  const roundToPrecision = (num, precision) => {
    if (typeof num !== 'number' || typeof precision !== 'number') {
      throw new Error('Both arguments must be numbers');
    }
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  };

  
  const calculate = () => {
    try {
      if (display.includes('/0')) {
        setDisplay('Error: Division by Zero');
        return;
      }
  
      let formattedExpression = normalizeExpression(display);

      if (formattedExpression.includes('√(') && !formattedExpression.includes(')')) {
        formattedExpression += ')'; 
      }

      formattedExpression = formattedExpression
      .replace(/(sin|cos|tan)\((.*?)$/g, (match, func, angle) => {
        return `${func}(${angle})`;
      });

  
      formattedExpression = formattedExpression
        .replace(/(\d+)%/g, (_, number) => `${handlePercent(number)}`)
        .replace(/sin\((.*?)\)/g, (_, angle) => `math.sin(${toRadians(angle)})`)
        .replace(/cos\((.*?)\)/g, (_, angle) => `math.cos(${toRadians(angle)})`)
        .replace(/tan\((.*?)\)/g, (_, angle) => `math.tan(${toRadians(angle)})`)
        .replace(/√\((.*?)\)/g, (_, number) => `math.sqrt(${number})`)
        .replace(/√(\d+)/g, (_, number) => `math.sqrt(${number})`);
    
  
      console.log(formattedExpression);
  
      const result = evaluate(formattedExpression, { math });
  
      const roundedResult = roundToPrecision(result, 10);
      setDisplay(roundedResult.toString());
    } catch (error) {
      console.error(error);
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
            {isDegrees ? 'rad' : 'deg'}
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