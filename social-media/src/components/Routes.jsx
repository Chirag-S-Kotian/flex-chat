import { useContext } from "react";
import RegisterAndLogin from "./RegisterAndLogin";
import { UserContext } from "./UserContex.jsx";
import Chat from "./Chat.jsx";

export default function Routes() {
    const {username, id} = useContext(UserContext);

    if(username){
        return <Chat />;
    }

  return (
    <RegisterAndLogin />
  );
}
