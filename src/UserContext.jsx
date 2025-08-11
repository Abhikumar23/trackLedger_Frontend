import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:4000/api/user/profile", {
          withCredentials: true,
        })
        .then(({ data }) => setUser(data))
        .catch((err) => {
          if (err.response?.status === 401) {
            console.log("Not logged in yet.");
          } else {
            console.error("Unexpected error:", err);
          }
          setUser(null);
        })

        .finally(() => setReady(true));
    }
  }, []);

  return (
    <UserContext.Provider value={{ ready, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
