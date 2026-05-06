"use client";

export default function StarBackground() {
  return (
    <div 
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        zIndex: -10,
        backgroundColor: "#0B0B0B",
        pointerEvents: "none"
      }} 
    />
  );
}