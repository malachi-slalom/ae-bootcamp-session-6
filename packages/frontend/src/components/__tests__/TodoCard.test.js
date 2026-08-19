import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it.each([
    ['due today', { dueDate: '2025-12-25', completed: 0 }],
    ['future-dated', { dueDate: '2025-12-26', completed: 0 }],
    ['undated', { dueDate: null, completed: 0 }],
    ['invalidly dated', { dueDate: '2025-02-30', completed: 0 }],
    ['completed and past-due', { dueDate: '2025-12-24', completed: 1 }],
  ])('does not mark a %s todo as overdue', (_, overrides) => {
    const { container } = render(
      <TodoCard
        todo={{ ...mockTodo, ...overrides }}
        {...mockHandlers}
        currentDate="2025-12-25"
        isLoading={false}
      />
    );

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).not.toHaveClass('overdue');
  });

  it('labels and visually distinguishes an incomplete past-due todo', () => {
    const { container } = render(
      <TodoCard
        todo={{ ...mockTodo, dueDate: '2025-12-24' }}
        {...mockHandlers}
        currentDate="2025-12-25"
        isLoading={false}
      />
    );

    expect(screen.getByText('Overdue')).toBeVisible();
    expect(container.querySelector('.todo-card')).toHaveClass('overdue');
    expect(screen.getByRole('checkbox')).toHaveAccessibleName(/Mark "Test Todo" as complete/);
    expect(screen.getByLabelText('Edit "Test Todo"')).toBeEnabled();
    expect(screen.getByLabelText('Delete "Test Todo"')).toBeEnabled();
  });

  it('reclassifies completion, reopening, and due-date changes on rerender', () => {
    const renderCard = (todo) => (
      <TodoCard
        todo={todo}
        {...mockHandlers}
        currentDate="2025-12-25"
        isLoading={false}
      />
    );
    const pastDueTodo = { ...mockTodo, dueDate: '2025-12-24', completed: 0 };
    const { container, rerender } = render(renderCard(pastDueTodo));

    expect(screen.getByText('Overdue')).toBeVisible();
    expect(screen.getByText(/December 24, 2025/)).toBeVisible();

    rerender(renderCard({ ...pastDueTodo, completed: 1 }));
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).toHaveClass('completed');
    expect(screen.getByText(/December 24, 2025/)).toBeVisible();

    rerender(renderCard(pastDueTodo));
    expect(screen.getByText('Overdue')).toBeVisible();

    for (const dueDate of ['2025-12-25', '2025-12-26', null]) {
      rerender(renderCard({ ...pastDueTodo, dueDate }));
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    }

    rerender(renderCard({ ...pastDueTodo, dueDate: '2025-12-23' }));
    expect(screen.getByText('Overdue')).toBeVisible();
    expect(screen.getByText(/December 23, 2025/)).toBeVisible();
  });
});
