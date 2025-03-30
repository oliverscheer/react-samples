const TailwindTest = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl text-bold text-avocado-600">Hallo</h1>
      <h1 className="text-xl text-bold text-accent">Hola</h1>
      
      <button className="rounded-md text-blue m-4 bg-blue-300 p-4 font-mono">Hallo</button>
      <button className="rounded-md text-blue bg-blue-300 p-4">Hallo</button>
    </div>
  );
};

export default TailwindTest;
