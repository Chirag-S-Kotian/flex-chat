import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUserName] = useState(null);
  const [id, setId] = useState(null);
  
  useEffect(() => {
    axios.get('/profile').then(response => {
      setId(response.data.userId);
      setUserName(response.data.username);
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUserName, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
