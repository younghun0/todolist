import React from "react";

function BoardList({
  id,
  boardId,
  title,
  Content,
  onRowClick,
  onRemoveButtonClick,
  page,
}) {
  return (
    <tr>
      <td onClick={() => onRowClick(id, boardId, title, Content)}>{boardId}</td>
      <td onClick={() => onRowClick(id, boardId, title, Content)}>{title}</td>
      <td onClick={() => onRowClick(id, boardId, title, Content)}>{Content}</td>
      <td>
        <button onClick={() => onRemoveButtonClick(id, page)}>삭제</button>
      </td>
    </tr>
  );
}

export default BoardList;
