import { Todo } from '../types';

const API_BASE = '/api'; // Vite proxy forwards to backend

/**
 * Generic helper for fetch with JSON handling and error mapping.
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

export async function getTodos(): Promise<Todo[]> {
  return request<Todo[]>('/todos');
}

export async function createTodo(title: string): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function updateTodo(todo: Todo): Promise<Todo> {
  return request<Todo>(`/todos/${todo.id}`, {
    method: 'PUT',
    body: JSON.stringify({ title: todo.title, completed: todo.completed }),
  });
}

export async function deleteTodo(id: number): Promise<void> {
  await request<void>(`/todos/${id}`, { method: 'DELETE' });
}