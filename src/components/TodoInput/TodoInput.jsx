import { useCallback, useState } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { Input } from "./TodoInput.styled";

const TodoInput = ({ handleAddTodo }) => {
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
      const formData = new FormData();
      formData.append("title", newTodo);
      formData.append("isCompleted", false);
      if (e.keyCode === 13) {
        if (newTodo === "") {
          alert("빈값");
          return false;
        }
        try {
          const {
            data: { success, todo: nextTodo },
          } = await axiosInstance.post("/todo", formData);
          if (success) {
            handleAddTodo(nextTodo);
            setNewTodo("");
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    [newTodo, setNewTodo, handleAddTodo]
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
