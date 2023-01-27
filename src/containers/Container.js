import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoardList from "../components/BoardList";
import BoardNew from "../components/BoardNew";
import {
  removeDataAsync,
  saveDataAsync,
  searchDataAsync,
} from "../module/boardReducer";

function Container() {
  const [page, setPage] = useState(1);
  let [inputData, setInputData] = useState({
    title: "",
  });
  const dispatch = useDispatch();

  const { todos, success } = useSelector((state) => state.boardReducer);

  const onSearchButtonClick = () => {
    resetForm();
    dispatch(searchDataAsync(page));
  };
  const onSaveButtonClick = (data) => {
    dispatch(saveDataAsync(data));
  };
  const onRemoveButtonClick = (id, page) => {
    dispatch(removeDataAsync({ id, page }));
  };

  const onRowClick = (id, boardId, title, boardContent) => {
    setInputData({
      id: id,
      title: title,
      boardContent: boardContent,
    });
  };

  const changeInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setInputData({
      title: "",
      content: "",
    });
  };

  return (
    <div>
      <button onClick={onSearchButtonClick}>조회</button>
      <div>
        <table border="1">
          <tbody>
            <tr align="center">
              <td width="50">번호</td>
              <td width="50">제목</td>
              <td width="50">내용</td>
              <td width="50">{success ? "ㅇㅇ" : "ㄴㄴ"}</td>
            </tr>
            {todos.length > 0 &&
              todos.map((row) => (
                <BoardList
                  key={row._id}
                  id={row._id}
                  boardId={row._id}
                  title={row.title}
                  Content={row.createdDate}
                  onRowclick={onRowClick}
                  onRemoveButtonClick={onRemoveButtonClick}
                  page={page}
                />
              ))}
          </tbody>
        </table>
      </div>
      <div>
        <BoardNew
          changeInput={changeInput}
          inputData={inputData}
          onSaveButtonClick={onSaveButtonClick}
          resetForm={resetForm}
        />
      </div>
    </div>
  );
}

export default Container;
