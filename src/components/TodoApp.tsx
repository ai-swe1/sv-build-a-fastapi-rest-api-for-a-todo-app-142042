import React, { useEffect, useState } from 'react';
import { Todo } from '../types';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api';
import TodoItem from './TodoItem';

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError(null);
    try {
      const created = await createTodo(newTitle.trim());
      setTodos((prev) => [...prev, created]);
      setNewTitle('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const toggleComplete = async (todo: Todo) => {
    setError(null);
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = async (id: number, newTitle: string) => {
    setError(null);
    try {
      const updated = await updateTodo(id, { title: newTitle });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="New todo title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
          Add
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleComplete(todo)}
              onDelete={() => handleDelete(todo.id)}
              onEdit={(newTitle) => handleEdit(todo.id, newTitle)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoApp;
