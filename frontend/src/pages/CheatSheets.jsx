import React from "react";

const CheatSheets = () => {
 
  const arr = [0,0,1,1,1,1,2,2];
  const map = {};
  const freq = arr.map((item)=> map[item] = (map[item] || 0) + 1)
  
   
  console.log(map);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-white text-5xl">CheatSheets</h1>
    </div>
  );
};

export default CheatSheets;
