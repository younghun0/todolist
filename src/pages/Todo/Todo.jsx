import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router";
import axiosInstance from "../../apis/axiosInstance";
import ModalTodo from "../../components/Modal/ModalTodo";
import TodoInput from "../../components/TodoInput";
import TodoList from "../../components/TodoList";
import { TodoDiv, TodoTitle, TodoWrapper } from "./Todo.styled";

const Todo = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [todo, setTodo] = useState(null);

  const handleAddTodo = useCallback((nextTodo) => {
    setTodos((prev) => [nextTodo, ...prev]);
  }, []);

  const handleTodos = useCallback(async (id, nextTodo) => {
    setTodos((prev) => {
      return prev.map((todo) => {
        return todo._id === id ? { ...todo, ...nextTodo } : todo;
      });
    });
  }, []);

  const handleDeleteTodo = useCallback((id) => {
    setTodos((prev) => {
      return prev.filter((todo) => todo._id !== id);
    });
  }, []);

  //완료 여부 (체크박스) Modal
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
          setTodo({ ...todo, isCompleted: !isCompleted });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [handleTodos, todo]
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
      if (e.request.statusText === "Unauthorized") {
        alert("권한이 없습니다 재로그인 해주세요");
        navigate("/Login");
        return false;
      }
      console.log("오류남" + e);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, page]);

  useEffect(() => {
    (async () => {
      await patch();
    })();
  }, []);
  const handleModalTitle = useCallback(
    (e) => {
      setTodo({ ...todo, title: e.target.value });
    },
    [todo]
  );
  const handleModalContent = useCallback(
    (e) => {
      setTodo({ ...todo, content: e.target.value });
    },
    [todo]
  );
  const handleModalUpdate = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("title", todo.title);
      formData.append("content", todo.content);
      formData.append("isCompleted", todo.isCompleted);
      const {
        data: { success, todo: nextTodo },
      } = await axiosInstance.put(`todo/${todo._id}`, formData);
      if (success) {
        handleTodos(todo._id, nextTodo);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTodo(null);
    }
  }, [handleTodos, todo, todos]);
  const closeModal = useCallback(() => {
    setTodo(null);
  }, []);
  const openTodoMoal = useCallback(async (id) => {
    console.log(id);
    try {
      const {
        data: { success, todo },
      } = await axiosInstance.get(`todo/${id}`);
      if (success) {
        setTodo(todo);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <TodoWrapper>
      <TodoTitle>Todo</TodoTitle>
      <TodoDiv>
        <TodoInput handleAddTodo={handleAddTodo} />
        <TodoList
          todos={todos}
          handleTodos={handleTodos}
          handleDeleteTodo={handleDeleteTodo}
          openTodoMoal={openTodoMoal}
        />
      </TodoDiv>
      <Modal isOpen={todo === null ? false : true}>
        {todo === null ? (
          false
        ) : (
          <>
            <dl>
              <dt>제목</dt>
              <dd>
                <input
                  type="text"
                  name="title"
                  value={todo.title}
                  onChange={(e) => handleModalTitle(e)}
                />
              </dd>
              <dt>내용</dt>
              <dd>
                <input
                  type="text"
                  name="content"
                  value={todo.content}
                  onChange={(e) => handleModalContent(e)}
                />
              </dd>
              <dt>완료여부</dt>
              <dd>
                <input
                  type="checkbox"
                  onChange={() => handleCheck(todo._id, todo.isCompleted)}
                  checked={todo.isCompleted}
                />
              </dd>
              <dt>작성자</dt>
              <dd>{todo.createdUser.nickname}</dd>
              <dt>작성일시</dt>
              <dd>{todo.createdDate}</dd>
              <dt>수정자</dt>
              <dd>{todo.updatedUser.nickname}</dd>
              <dt>수정일시</dt>
              <dd>{todo.updatedDate}</dd>
            </dl>
            <ModalTodo
              todo={todo}
              closeModal={closeModal}
              handleModalUpdate={handleModalUpdate}
            />
          </>
        )}
      </Modal>
      <h4>더보기</h4>
      <button type="button" onClick={() => !isLoading && patch()}>
        more
      </button>
    </TodoWrapper>
  );
};

export default Todo;
