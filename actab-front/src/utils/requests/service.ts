import axios from "axios";

const service = axios.create({
  baseURL: "http://127.0.0.1:8081/",
});

/**
 * Request interceptor
 */
service.interceptors.request.use(
  function(config) {
    // TODO: Before request
    return config;
  },
  function(error) {
    // TODO: When request error
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
service.interceptors.response.use(
  function(response) {
    // Before response
    if (response.status !== 200) {
      return Promise.reject(new Error(`Response code: ${response.status}`));
    }
    return response;
  },
  function(error) {
    // TODO: When response error
    return Promise.reject(error);
  }
);

export { service };
