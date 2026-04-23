import React from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

const TodoList: React.FC<Props> = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return <p className="empty-state">No todos yet! 🎉</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </ul>
  );
};

export default TodoList;