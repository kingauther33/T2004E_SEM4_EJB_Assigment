import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAPI } from "src/hooks/useAPI";
import { addToLocalStorage } from "src/utils/add-to-localstorage";

const UserContext = createContext({
  userInfo: "",
  setUserInfo: () => {},
});

export default function UserContextProvider({ children }) {
  const router = useRouter();
  const { API } = useAPI();
  const { pathname } = router;
  const inLoginOrRegister = pathname.includes("register") || pathname.includes("login");
  const [userInfo, setUserInfo] = useState({
    id: "",
    accessToken: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    balance: "",
    role: "",
  });

  useEffect(() => {
    const id = localStorage.getItem("id");
    const accessToken = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("email");
    const balance = localStorage.getItem("balance");
    const role = localStorage.getItem("role");

    if (
      !!id &&
      !!accessToken &&
      !!username &&
      !!firstName &&
      !!lastName &&
      !!email &&
      !!balance &&
      !!role
    ) {
      setUserInfo({
        id,
        accessToken,
        username,
        firstName,
        lastName,
        email,
        balance,
        role,
      });
      if (inLoginOrRegister) {
        router.replace("/");
      }
    } else if (!inLoginOrRegister) {
      router.replace("/register");
    }
  }, [inLoginOrRegister, pathname, router]);

  // fetch lại account
  useEffect(() => {
    const fetchAccount = async () => {
      await axios
        .get(API.getUserByToken.url, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: userInfo.accessToken,
          },
        })
        .then((res) => {
          const { data } = res;
          addToLocalStorage(data, setUserInfo, router);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    !!userInfo.accessToken && fetchAccount();
  }, [API, router, userInfo.accessToken]);

  const _userApi = useMemo(() => {
    return { userInfo, setUserInfo };
  }, [userInfo]);
  return <UserContext.Provider value={_userApi}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
