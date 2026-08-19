import React from 'react';
import TodoCard from './TodoCard';

function TodoList({ todos, onToggle, onEdit, onDelete, currentDate, isLoading }) {
  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          currentDate={currentDate}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default TodoList;
