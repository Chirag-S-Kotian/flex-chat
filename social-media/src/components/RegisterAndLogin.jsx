import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "./UserContex.jsx";

export default function RegisterAndLogin() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState("login");
  const { setUserName: setLoggedIn, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = isLogin === "register" ? "register" : "login";
    const { data } = await axios.post(url, { username, password });
    setLoggedIn(username);
    setId(data.id);
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter a username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a user password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLogin === "register" ? "Register" : "Login"}
        </button>

        <div className="text-center mt-2">
          {isLogin === "register" && (
            <div>
              Already a member?
              <button className="ml-1" onClick={() => setIsLogin("login")}>
                Login here
              </button>
            </div>
          )}
          {isLogin === "login" && (
            <div>
              Don't have an Account!
              <button className="ml-1" onClick={() => setIsLogin("register")}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
