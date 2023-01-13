import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../apis/axiosInstance";
import Modal from "react-modal";
import { Link } from "react-router-dom";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [idState, setIdState] = useState("");
  const [updateTodo, setUpdateTodo] = useState("");
  const [modalId, setModalId] = useState("");
  const [modalContent, setModalContent] = useState("");

  //완료 여부 (체크박스)
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
  //삭제 (x박스)
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

  //추가 input 핸들러
  const handleNewTodo = useCallback(
    (e) => {
      setNewTodo(e.target.value);
    },
    [setNewTodo]
  );
  //todo 추가 (Enter)
  const handleNewTodoEnter = useCallback(
    (e) => {
      console.log(newTodo);
      const formData = new FormData();
      formData.append("title", newTodo);
      formData.append("isCompleted", false);
      if (e.keyCode === 13) {
        if (newTodo === "") {
          alert("빈값");
          return false;
        }
        try {
          (async () => {
            const response = await axiosInstance.post("/todo", formData);
            console.log(response.data);
            const newData = response.data.todo;
            setTodos((prev) => [newData, ...prev]);
          })();
        } catch (e) {
          console.log(e);
        }
        setNewTodo("");
      }
    },
    [newTodo]
  );

  //todo 수정
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

  //
  const handleTodoUpdate = useCallback(
    (e) => {
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
  // const handleFile = useCallback((e, id) => {
  //   const img = e.target.files[0];
  //   // const title = todos.filter(todos._id === id);

  //   // console.log(title);

  //   const formData = new FormData();
  //   console.log(
  //     todos.map((todo, index) => {
  //       return todo._id === id ? todo.title : false;
  //     })
  //   );
  //   formData.append("file", img);
  //   formData.append("title", "이미지테스트");
  //   formData.append("isCompleted", false);
  //   try {
  //     (async () => {
  //       const response = await axiosInstance.put(`/todo/${id}`, formData);
  //       console.log(response.data);
  //     })();
  //   } catch (error) {
  //     console.log("error:" + error);
  //   }
  // });

  const handleModal = useCallback(async () => {
    const formData = new FormData();
    const todo = todos.filter((v) => v._id === modalId);
    const title = todo.map((todoData) => {
      return todoData.title;
    });
    const isCompleted = todo.map((todoData) => {
      return todoData.isCompleted;
    });
    console.log(title);
    formData.append("title", title);
    formData.append("content", modalContent);
    formData.append("isCompleted", isCompleted);

    try {
      const response = await axiosInstance.put(`/todo/${modalId}`, formData);
      console.log(response.data);
      const newData = response.data.todo;
      setTodos((prev) => {
        return prev.map((todo) =>
          todo._id === modalId ? { ...todo, content: modalContent } : todo
        );
      });
    } catch (e) {
      console.log(e);
    }
    setModalId("");
    setModalContent("");
  });

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
      if (e.request.statusText === "Unauthorized") {
        alert("권한이 없습니다 재로그인 해주세요");
        window.location.replace("/login");
      }
      console.log("오류남" + e);
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
              <div>
                내용
                <input
                  type="text"
                  name="content"
                  onChange={(e) => setModalContent(e.target.value)}
                />
                변경 내용 : {modalContent}
                내용 : {todo.content}
                {/* {todo.file !== null ? (
                  <img src={todo.file.url} width="300"></img>
                ) : (
                  "파일없음"
                )}
                <input
                  type="file"
                  accept="image/jpg,image/png,image/jpeg,image/gif"
                  name="file"
                  onChange={(e) => handleFile(e, todo._id)}
                /> */}
              </div>
              <div>작성자(닉네임) : {todo.createdUser.username}</div>
              <div>작성일시 : {todo.createdDate}</div>
              <div>수정자(닉네임) : {todo.updatedUser.username}</div>
              <div>수정일시 : {todo.updatedDate}</div>
              <div>
                완료여부 : {todo.isCompleted === false ? "미완료" : "완료"}
                {todo.isCompleted === false ? (
                  <button
                    type="button"
                    onClick={() => handleCheck(todo._id, todo.isCompleted)}
                  >
                    완료
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCheck(todo._id, todo.isCompleted)}
                  >
                    미완료
                  </button>
                )}
              </div>
              <button type="button" onClick={() => handleModal()}>
                변경
              </button>
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
        defalutvalue={newTodo}
      ></input>
      <h4>더보기</h4>
      <button type="button" onClick={() => !isLoading && patch()}>
        more
      </button>
    </>
  );
};

export default Todo;
