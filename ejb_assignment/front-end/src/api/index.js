const BASE_URL = "http://localhost:8080/api/v1/";

const accessToken = typeof window != "undefined" && localStorage.getItem("access_token");
console.log(accessToken);

export const API = {
  config: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: accessToken,
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
};
