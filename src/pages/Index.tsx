
import React from "react";

export default function Index() {
  console.log('Index page rendering - simplified version');
  
  return (
    <div className="bg-[#141416] min-h-screen flex flex-col items-center justify-center">
      <div className="text-center max-w-4xl px-6">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          Create, collect, and trade
          <br />
          card art with stunning 3D effects
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Experience cards like never before with immersive 3D viewing, professional lighting, and visual effects that bring your art to life.
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}
