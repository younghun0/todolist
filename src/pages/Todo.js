import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../apis/axiosInstance";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [isOn, setIsOn] = useState("");
  const [updateTodo, setUpdateTodo] = useState("");
  const handleCheck = useCallback(async (id, isCompleted) => {
    try {
      const url = isCompleted
        ? `/todo/${id}/isCompleted/uncompleted`
        : `/todo/${id}/isCompleted/completed`;
      const response = await axiosInstance.patch(url);
      const { success } = response.data;
      if (success) {
        setTodos((prev) => {
          return prev.map((todo) =>
            todo._id === id
              ? {
                  ...todo,
                  isCompleted: !isCompleted,
                }
              : todo
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      const response = await axiosInstance.delete(`/todo/${id}`);
      const { success } = response.data;
      if (success) {
        setTodos((prev) => {
          return prev.filter((todo) => todo._id !== id);
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
  const handleNewTodo = useCallback(
    (e) => {
      setNewTodo(e.target.value);
    },
    [setNewTodo]
  );
  const handleNewTodoEnter = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        try {
          setTodos((prev) => [{ title: newTodo }, ...prev]);
          setNewTodo("");
          (async () => {
            const response = await axiosInstance.post("/todo", {
              title: newTodo,
              isCompleted: false,
            });
            console.log(response.data);
          })();
        } catch (e) {
          console.log(e);
        }
      }
    },
    [newTodo]
  );
  const handleUpdate = useCallback(
    (e) => {
      console.log(updateTodo);
      if (e.keyCode === 13) {
        try {
          (async () => {
            const response = await axiosInstance.put(`/todo/${isOn}`, {
              title: updateTodo,
              isCompleted: false,
            });
            console.log(response.data);
          })();
        } catch (error) {
          console.log("error:" + error);
        }
        setIsOn("");
        setUpdateTodo("");
      }
    },
    [updateTodo]
  );
  const handleTodoUpdate = useCallback(
    (e) => {
      console.log(e.target.value);
      setUpdateTodo(e.target.value);
    },
    [setUpdateTodo]
  );
  const handleInputId = useCallback(
    (id) => {
      setIsOn(id);
    },
    [setIsOn]
  );
  const patch = useCallback(async () => {
    try {
      setIsLoading(true);
      const respons = await axiosInstance.get(`/todo?page=${page}`);
      const { paging, todos: prevTodos } = respons.data;
      setTodos((prev) => {
        return prev.concat(prevTodos);
      });
      setPage(page + 1);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [page, setPage, setTodos]);

  useEffect(() => {
    (async () => {
      await patch();
    })();
  }, []);
  return (
    <>
      <h1>Todo</h1>
      {todos.map((todo, index) => {
        return (
          <div key={index}>
            <input
              type="checkbox"
              onChange={() => handleCheck(todo._id, todo.isCompleted)}
              checked={todo.isCompleted}
            />
            {isOn !== todo._id ? (
              <span
                onClick={() => {
                  handleInputId(todo._id);
                }}
              >
                {todo.title}
              </span>
            ) : (
              <input
                type="text"
                onChange={handleTodoUpdate}
                onKeyDown={handleUpdate}
                defaultValue={updateTodo}
              ></input>
            )}
            <button type="button" onClick={() => handleDelete(todo._id)}>
              X
            </button>
          </div>
        );
      })}
      <h4>추가</h4>
      <input
        type="text"
        onChange={handleNewTodo}
        onKeyDown={handleNewTodoEnter}
        value={newTodo}
      ></input>
      <h4>더보기</h4>
      <button type="button" onClick={() => !isLoading && patch()}>
        more
      </button>
    </>
  );
};

export default Todo;
