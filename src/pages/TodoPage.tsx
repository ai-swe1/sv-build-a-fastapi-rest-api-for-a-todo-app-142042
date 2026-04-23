import React from 'react';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import useTodos from '../hooks/useTodos';

const TodoPage: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo, loading, error } = useTodos();

  return (
    <section className="todo-page">
      <TodoForm onAdd={addTodo} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <TodoList
        todos={todos}
        onToggle={updateTodo}
        onDelete={deleteTodo}
      />
    </section>
  );
};

export default TodoPage;