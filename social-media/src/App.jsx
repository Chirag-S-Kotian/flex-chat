import axios from "axios";
import { UserContextProvider } from "./components/UserContex";
import Routes from "./components/Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App;
