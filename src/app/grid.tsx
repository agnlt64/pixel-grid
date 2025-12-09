"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Grid = () => {
  const [gridSize, setGridSize] = useState(16);
  const [grid, setGrid] = useState(
    Array(16)
      .fill(0)
      .map(() => Array(16).fill(0))
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleGridSizeChange = (value: number[]) => {
    const newSize = value[0];
    setGridSize(newSize);
    setGrid(
      Array(newSize)
        .fill(0)
        .map(() => Array(newSize).fill(0))
    );
  };

  const handleCellClick = (row: number, col: number) => {
    const newGrid = grid.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((c, colIndex) => (colIndex === col ? (c ? 0 : 1) : c))
        : r
    );
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      handleCellClick(row, col);
    }
  };

  const clearGrid = () => {
    setGrid(
      Array(gridSize)
        .fill(0)
        .map(() => Array(gridSize).fill(0))
    );
  };

  const handleCopy = () => {
    const reversedGrid = [...grid].reverse();
    const pythonMatrix = `[${reversedGrid
      .map((row) => `[${row.join(", ")}]`)
      .join(",\n ")}]
`;
    navigator.clipboard.writeText(pythonMatrix);
    toast("Success!", {
      description: "The array has been copied to your clipboard.",
    });
  };

  const matrixRepresentation = useMemo(() => {
    const reversedGrid = [...grid].reverse();
    return `[${reversedGrid.map((row) => `[${row.join(", ")}]`).join(",\n ")}]
`;
  }, [grid]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-center gap-4 p-4 border-b">
        <div className="flex-1 flex flex-col gap-2 max-w-xs">
          <Label htmlFor="grid-size">Grid Size: {gridSize}</Label>
          <Slider
            id="grid-size"
            min={8}
            max={32}
            step={1}
            defaultValue={[gridSize]}
            onValueChange={handleGridSizeChange}
          />
        </div>
        <Button className="cursor-pointer" onClick={clearGrid}>Clear Grid</Button>
        <Button className="cursor-pointer" onClick={handleCopy}>Copy Array</Button>
      </div>
      <div className="flex items-center justify-center">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 20px)`,
            gap: "1px",
            border: "1px solid white",
          }}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-5 h-5 border border-gray-700"
                style={{ backgroundColor: cell ? "black" : "white" }}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Grid;
