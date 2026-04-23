import React, { useState } from 'react';
import { Todo } from '../types';

type Props = {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
};

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const submitEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      onEdit(trimmed);
    }
    setIsEditing(false);
  };

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #eee',
      }}
    >
      <input type="checkbox" checked={todo.completed} onChange={onToggle} />
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitEdit();
            if (e.key === 'Escape') {
              setEditTitle(todo.title);
              setIsEditing(false);
            }
          }}
          autoFocus
          style={{ flex: 1, marginLeft: '0.5rem', padding: '0.25rem' }}
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          style={{
            flex: 1,
            marginLeft: '0.5rem',
            textDecoration: todo.completed ? 'line-through' : 'none',
            cursor: 'pointer',
          }}
        >
          {todo.title}
        </span>
      )}
      <button onClick={onDelete} style={{ marginLeft: '0.5rem' }}>
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
