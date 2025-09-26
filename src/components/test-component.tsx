import React from 'react';

// TODO: Add proper error handling
interface TestComponentProps {
  name: string;
  age?: number;
  data?: any; // This should be more specific
}

export const TestComponent: React.FC<TestComponentProps> = ({ name, age, data }) => {
  console.log('Rendering TestComponent with:', { name, age, data });

  const handleClick = () => {
    // FIXME: Add proper validation
    console.log('Button clicked!');
  };

  return (
    <div className="p-4 border rounded">
      <h2>Hello, {name}!</h2>
      {age && <p>Age: {age}</p>}
      <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2 rounded">
        Click me
      </button>
    </div>
  );
};