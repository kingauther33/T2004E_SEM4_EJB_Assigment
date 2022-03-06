import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const UserContext = createContext({
  userInfo: "",
  setUserInfo: () => {},
});

export default function UserContextProvider({ children }) {
  const router = useRouter();
  const { pathname } = router;
  const inLoginOrRegister = pathname.includes("register") || pathname.includes("login");
  const [userInfo, setUserInfo] = useState({
    accessToken: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    balance: "",
    role: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("email");
    const balance = localStorage.getItem("balance");
    const role = localStorage.getItem("role");

    if (
      !!accessToken &&
      !!username &&
      !!firstName &&
      !!lastName &&
      !!email &&
      !!balance &&
      !!role
    ) {
      setUserInfo({
        accessToken,
        username,
        firstName,
        lastName,
        email,
        role,
      });
      if (inLoginOrRegister) {
        router.replace("/");
      }
    } else if (!inLoginOrRegister) {
      router.replace("/register");
    }
  }, [inLoginOrRegister, pathname, router]);

  const _userApi = useMemo(() => {
    return { userInfo, setUserInfo };
  }, [userInfo]);
  return <UserContext.Provider value={_userApi}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
