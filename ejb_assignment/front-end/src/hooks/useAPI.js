import { useState, useEffect } from "react";
import { useUser } from "src/providers/user-context";

const BASE_URL = "http://localhost:8080/api/v1/";

export const useAPI = () => {
  const { userInfo } = useUser();
  const [API, setAPI] = useState({
    config: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: userInfo.accessToken,
      },
    },
    register: {
      url: BASE_URL + "accounts/register",
    },
    login: {
      url: BASE_URL + "accounts/login",
    },
    getAccount: {
      url: BASE_URL + "accounts",
    },
    createTracsaction: {
      url: BASE_URL + "transactions",
    },
    getLogs: {
      url: BASE_URL + "logs",
    },
  });

  useEffect(() => {
    setAPI((api) => ({
      ...api,
      config: {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: userInfo.accessToken,
        },
      },
    }));
  }, [userInfo.accessToken]);

  return { API, setAPI };
};
