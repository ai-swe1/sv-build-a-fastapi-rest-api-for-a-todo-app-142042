import React, { useState, FormEvent } from 'react';

type Props = {
  onAdd: (title: string) => void;
};

const TodoForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="todo-input"
      />
      <button type="submit" className="todo-submit">Add</button>
    </form>
  );
};

export default TodoForm;