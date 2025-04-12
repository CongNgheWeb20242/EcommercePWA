import React from 'react';

type Props = {
  task: string;
  done: boolean;
};

const TodoItem: React.FC<Props> = ({ task, done }) => {
  return (
    <div>
      <input type="checkbox" checked={done} readOnly />
      <span style={{ textDecoration: done ? 'line-through' : 'none' }}>
        {task}
      </span>
    </div>
  );
};

export default TodoItem;
