import { useState } from 'react';

const Test = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-8">BlockCraft Test</h1>
      <div className="text-2xl mb-4">Count: {count}</div>
      <button 
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      <div className="mt-8 text-gray-400">
        If you see this, React is working correctly!
      </div>
    </div>
  );
};

export default Test;