import styled from "styled-components";
export const TodoItemWapper = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;
`;
export const InputTodo = styled.input`
  border: none;
`;

export const Input = styled.input`
  border: none;
  outline: none;

  &:focus {
    border: 3px solid red;
  }
`;
