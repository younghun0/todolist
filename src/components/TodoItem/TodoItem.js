import { Input, TodoItemWapper } from "./TodoItem.styled";

const TodoItem = ({
  index,
  todo,
  handleCheck,
  handleTodoTitle,
  handleUpdate,
  handleDelete,
  openTodoMoal,
}) => {
  return (
    <TodoItemWapper key={index}>
      <input
        type="checkbox"
        onChange={() => handleCheck(todo._id, todo.isCompleted)}
        checked={todo.isCompleted}
      />
      <input
        type="text"
        onKeyDown={(e) => handleUpdate(todo._id, e.keyCode, todo)}
        onChange={(e) => handleTodoTitle(todo._id, e.target.value)}
        Value={todo.title}
      />
      <button type="button" onClick={() => handleDelete(todo._id)}>
        X
      </button>
      <button type="button" onClick={() => openTodoMoal(todo._id)}>
        상세보기
      </button>
    </TodoItemWapper>
  );
};
export default TodoItem;
