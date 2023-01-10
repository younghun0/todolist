import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../apis/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);
  const handlePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const login = useCallback(
    async (e) => {
      try {
        if (!username.trim()) {
          alert("id를 입력해주세요.");
        } else if (!password.trim()) {
          alert("password를 입력해주세요.");
        } else {
          const respons = await axiosInstance.post("/auth/login", {
            username,
            password,
          });
          const { accessToken } = respons.data;
          if (!accessToken) return;
          localStorage.setItem("accessToken", accessToken);
          navigate("/todo");
        }
      } catch (error) {
        alert("ERROR");
      }
      e.preventDefault();
      return;
    },
    [username, password, navigate]
  );
  return (
    <>
      <h1>로그인 페이지</h1>
      <form>
        <label>ID</label>
        <input
          type="text"
          onChange={handleUsername}
          name="username"
          value={username}
        ></input>
        <br />
        <label>password</label>
        <input
          type="password"
          onChange={handlePassword}
          name="password"
          value={password}
        ></input>
        <br />
        <button type="button" onClick={login}>
          로그인
        </button>
      </form>
    </>
  );
};

export default Login;
