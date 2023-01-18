import { useCallback } from "react";
import axiosInstance from "../../apis/axiosInstance";
import TodoItem from "../TodoItem";
import { TodoListWrapper } from "./TodoList.styled";

const TodoList = ({ todos, handleTodos, handleDeleteTodo, openTodoMoal }) => {
  //완료 여부 (체크박스)
  const handleCheck = useCallback(
    async (id, isCompleted) => {
      try {
        const url = isCompleted
          ? `/todo/${id}/isCompleted/uncompleted`
          : `/todo/${id}/isCompleted/completed`;
        const response = await axiosInstance.patch(url);
        const { success } = response.data;
        if (success) {
          handleTodos(id, { isCompleted: !isCompleted });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [handleTodos]
  );

  //todo 수정 input 핸들러
  const handleTodoTitle = useCallback(
    (id, title = "") => {
      handleTodos(id, {
        title: title,
      });
    },

    [handleTodos]
  );

  const handleUpdate = useCallback(
    async (_id, keyCode, todo) => {
      if (keyCode === 13) {
        const formData = new FormData();
        formData.append("title", todo.title);
        formData.append("isCompleted", todo.isCompleted);
        try {
          const {
            data: { success, todo },
          } = await axiosInstance.put(`/todo/${_id}`, formData);
          if (success) {
            handleTodos(_id, todo);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    [handleTodos]
  );
  //삭제 (x박스)
  const handleDelete = useCallback(async (_id) => {
    try {
      const response = await axiosInstance.delete(`/todo/${_id}`);
      const { success } = response.data;
      if (success) {
        handleDeleteTodo(_id);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <TodoListWrapper>
      {todos.map((todo, index) => {
        return (
          <TodoItem
            key={index}
            todo={todo}
            handleCheck={handleCheck}
            handleTodoTitle={handleTodoTitle}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            openTodoMoal={openTodoMoal}
          />
        );
      })}
    </TodoListWrapper>
  );
};

export default TodoList;
