import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const UserContext = createContext({
  accessToken: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
});

export default function UserContextProvider({ children }) {
  const router = useRouter();
  const {pathname} = router;
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (accessToken && username && firstName && lastName && email && role) {
      setUserInfo({
        accessToken,
        username,
        firstName,
        lastName,
        email,
        role,
      });
    } else if (!pathname.includes("register") || !pathname.includes("login")) {
      router.push("/register");
    }
  }, []);
  return <UserContext.Provider value={[userInfo, setUserInfo]}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
