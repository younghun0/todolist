import "./App.css";
import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Todo from "./pages/Todo";
import { Provider } from "react-redux";
import Counter from "./components/Counter/Counter";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/Counter" element={<Counter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Provider>
  );
};

export default App;
