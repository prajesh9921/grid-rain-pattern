import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const rows = 15;
  const cols = 20;
  const [activeBoxes, setActiveBoxes] = useState([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  // Function to generate RGB colors dynamically
  const generateRGBColor = (red, green, blue) => {
    const r = red % 256; // Ensure red is within 0-255 range
    const g = green % 256; // Ensure green is within 0-255 range
    const b = blue % 256; // Ensure blue is within 0-255 range
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Add new column with 5 boxes every 2 seconds
  useEffect(() => {
    const addColumnInterval = setInterval(() => {
      const newCol = Math.floor(Math.random() * cols);
      const newBoxes = [{
        col: newCol,
        rows: [0, -1, -2, -3, -4],
        color: generateRGBColor(currentColorIndex * 20, 100, 150),
      }];
      setActiveBoxes(prevBoxes => [...prevBoxes, ...newBoxes]);
    }, 500); // Adjust interval to change how often new columns are added

    return () => clearInterval(addColumnInterval);
  }, [currentColorIndex]);

  // Move boxes down every 50ms
  useEffect(() => {
    const moveBoxesInterval = setInterval(() => {
      setActiveBoxes(prevBoxes => {
        const updatedBoxes = prevBoxes.map(box => ({
          ...box,
          rows: box.rows.map(row => row + 1),
        })).filter(box => box.rows[4] < rows); // Remove boxes that reach the bottom
        return updatedBoxes;
      });
    }, 50); // Adjust interval to change the speed of falling boxes

    return () => clearInterval(moveBoxesInterval);
  }, [activeBoxes]);

  // Change color every 2 seconds
  useEffect(() => {
    const changeColorInterval = setInterval(() => {
      setCurrentColorIndex(prevIndex => prevIndex + 1);
    }, 2000);

    return () => clearInterval(changeColorInterval);
  }, []);

  // Rendering grid items based on activeBoxes state
  const gridItems = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const activeBox = activeBoxes.find(box => box.col === j && box.rows.includes(i));
      const isActive = !!activeBox;
      const opacityIndex = isActive ? activeBox.rows.indexOf(i) : -1;
      const opacity = isActive ? 1 - (opacityIndex * 0.2) : 1; // Opacity for stacked boxes
      const backgroundColor = isActive ? activeBox.color : '#000000';
      gridItems.push(
        <div
          key={`${i}-${j}`}
          className={`grid-item ${isActive ? 'active' : ''}`}
          style={{ backgroundColor, opacity }}
        ></div>
      );
    }
  }

  return <div className="grid-container">{gridItems}</div>;
};

export default App;
