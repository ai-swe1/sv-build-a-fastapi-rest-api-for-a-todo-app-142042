import { useEffect, useState } from 'react';
import { Todo } from '../types';
import * as api from '../api/todo';

type UseTodosReturn = {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (title: string) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
};

/**
 * Hook follows a simple “load‑once then local cache” strategy.
 * All mutations are optimistically applied to the UI; if the server
 * call fails we roll back and surface an error message.
 */
export default function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    api.getTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async (title: string) => {
    const optimistic: Todo = { id: Date.now(), title, completed: false };
    setTodos((prev) => [optimistic, ...prev]);
    try {
      const saved = await api.createTodo(title);
      setTodos((prev) => prev.map((t) => (t.id === optimistic.id ? saved : t)));
    } catch (e: any) {
      setTodos((prev) => prev.filter((t) => t.id !== optimistic.id));
      setError(e.message);
    }
  };

  const updateTodo = async (todo: Todo) => {
    const previous = todos.find((t) => t.id === todo.id);
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
    try {
      await api.updateTodo(todo);
    } catch (e: any) {
      // rollback
      if (previous) {
        setTodos((prev) => prev.map((t) => (t.id === previous.id ? previous : t)));
      }
      setError(e.message);
    }
  };

  const deleteTodo = async (id: number) => {
    const previous = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.deleteTodo(id);
    } catch (e: any) {
      // rollback to previous state
      setTodos(previous);
      setError(e.message);
    }
  };

  return { todos, loading, error, addTodo, updateTodo, deleteTodo };
}