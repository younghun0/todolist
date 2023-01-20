import { useDispatch, useSelector } from "react-redux";
import { down, init, up } from "../../store/conunterSlice";

const Counter = () => {
  const dispach = useDispatch();
  const count = useSelector((state) => {
    return state.counter.value;
  });
  const addNumber = () => {
    dispach(up(2));
  };
  const minusNumber = () => {
    dispach(down(2));
  };
  const initNumber = () => {
    dispach(init(""));
  };
  return (
    <div>
      <div>{count}</div>
      <button onClick={addNumber}>+</button>
      <button onClick={minusNumber}>-</button>
      <button onClick={initNumber}>초기화</button>
    </div>
  );
};

export default Counter;
