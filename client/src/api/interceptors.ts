import api from "./axios";
api.interceptors.response.use(
  res => res,
  err => {
    const message =
      err.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
)