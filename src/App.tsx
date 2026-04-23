import React from 'react';
import TodoApp from './components/TodoApp';

const App: React.FC = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1>Todo List</h1>
      <TodoApp />
    </div>
  );
};

export default App;
