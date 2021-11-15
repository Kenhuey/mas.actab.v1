import axios from "axios";

export const apiHost = "127.0.0.1:8081";

const service = axios.create({
  baseURL: `http://${apiHost}/`,
});

/**
 * Request interceptor
 */
service.interceptors.request.use(
  function(config) {
    // Before request
    return config;
  },
  function(error) {
    // When request error
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
    // When response error
    return Promise.reject(error);
  }
);

export { service };
