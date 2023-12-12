import axios from "axios";

const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL;
};

const getURL = (path, fullURL) => {
    return getApiBaseUrl(path, fullURL) + (path.startsWith("/") ? path : "/" + path);
}
  

const getAuthHeader = (headers = {}) => {
  return headers;
};

const apiService = axios.create({});
apiService.defaults.headers["Content-Type"] = "application/json";
apiService.defaults.headers["Accept"] = "application/json";

export const get = (path, params = {}, headers) =>
  apiService.get(getURL(path), {
    params,
    headers: getAuthHeader(headers),
    // paramsSerializer: (params) => stringifyObj(params),
  });

export const post = (path, params = {}, headers) => {
  return apiService.post(getURL(path), params, {
    headers: getAuthHeader(headers),
  });
};

export const put = (path, params = {}, headers) =>
  apiService.put(getURL(path), params, {
    headers: getAuthHeader(headers),
  });

export const deleteRequest = (path, params = {}, headers) => {
  const { data, ...rest } = params;
  return apiService.delete(getURL(path), {
    params: rest,
    headers: getAuthHeader(headers),
    data,
  });
};

// API response interceptor
export function setupResponseInterceptors(store) {
  apiService.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      switch (error && error.response && error.response.status) {
        case 401:
          // store.dispatch(logoutUser());

          break;
        default:
          return Promise.reject(error.response);
      }

      return Promise.reject(error.response);
    }
  );
}
