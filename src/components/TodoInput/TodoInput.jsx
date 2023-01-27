import { useCallback, useState } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { Input } from "./TodoInput.styled";

const TodoInput = ({ handleAddTodo, onSaveButtonClick }) => {
  const [newTodo, setNewTodo] = useState("");

  //추가 input 핸들러
  const handleNewTodo = useCallback(
    (e) => {
      setNewTodo(e.target.value);
    },
    [setNewTodo]
  );

  //todo 추가 (Enter)
  const handleNewTodoEnter = useCallback(
    async (e) => {
      if (e.keyCode === 13) {
        if (newTodo === "") {
          alert("빈값");
          return false;
        }
        onSaveButtonClick(newTodo);
        handleAddTodo(newTodo);
        setNewTodo("");
      }
    },
    [newTodo, onSaveButtonClick]
  );

  return (
    <Input
      type="text"
      onChange={handleNewTodo}
      onKeyDown={handleNewTodoEnter}
      value={newTodo}
    />
  );
};

export default TodoInput;
