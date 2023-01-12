import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../apis/axiosInstance";
import Modal from "react-modal";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [idState, setIdState] = useState("");
  const [updateTodo, setUpdateTodo] = useState("");
  const [modalId, setModalId] = useState("");
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
      console.log(newTodo);
      const formData = new FormData();
      formData.append("title", newTodo);
      formData.append("isCompleted", false);

      if (e.keyCode === 13) {
        try {
          setTodos((prev) => [{ title: newTodo }, ...prev]);
          setNewTodo("");
          (async () => {
            const response = await axiosInstance.post("/todo", formData);
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
      const formData = new FormData();
      formData.append("title", updateTodo);
      formData.append("isCompleted", false);
      if (e.keyCode === 13) {
        setTodos((prev) => {
          return prev.map((todo) =>
            todo._id === idState ? { ...todo, title: updateTodo } : todo
          );
        });
        try {
          (async () => {
            const response = await axiosInstance.put(
              `/todo/${idState}`,
              formData
            );
            console.log(response.data);
          })();
        } catch (error) {
          console.log("error:" + error);
        }
        setIdState("");
        setUpdateTodo("");
      }
      if (e.keyCode === 27) {
        setIdState("");
      }
    },
    [idState, updateTodo]
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
      setIdState(id);
    },
    [setIdState]
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
            {idState !== todo._id ? (
              <>
                <span
                  onClick={() => {
                    handleInputId(todo._id);
                  }}
                >
                  {todo.title}
                </span>
                <button type="button" onClick={() => setModalId(todo._id)}>
                  상세보기
                </button>
              </>
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

            <Modal isOpen={modalId !== todo._id ? false : true}>
              <div>id: {todo._id}</div>
              <div>제목 : {todo.title}</div>
              <div>작성자(닉네임) : {todo.createdUser.username}</div>
              <div>작성일시 : {todo.createdDate}</div>
              <div>수정자(닉네임) : {todo.updatedUser.username}</div>
              <div>수정일시 : {todo.updatedDate}</div>
              <div>
                완료여부 : {todo.isCompleted === false ? "미완료" : "완료"}
              </div>
              <button type="button" onClick={() => setModalId("")}>
                x
              </button>
            </Modal>
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
