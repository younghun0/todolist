import "./App.css";
import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Todo from "./pages/Todo";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/todo" element={<Todo />} />
    </Routes>
  );
};

export default App;
