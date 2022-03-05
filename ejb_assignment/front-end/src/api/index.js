const BASE_URL = "http://localhost:8080/api/v1/";

export const API = {
  config: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  register: {
    url: BASE_URL + "accounts/register",
  },
  login: {
    url: BASE_URL + "accounts/login",
  },
};
