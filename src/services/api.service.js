import axios from "axios";
import Cookies from "js-cookie";
const domain = import.meta.env.VITE_APP_DOMAIN_NAME_CLIENT;

const commonConfig = {
  headers: {
    Accept: "application/json",
  },
};

export default (baseURL) => {
  const instance = axios.create({
    baseURL,
    ...commonConfig,
  });

  instance.interceptors.request.use(
    (config) => {
      const access_token = Cookies.get("access_token");
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (
        error.request &&
        error.response.status == 500 &&
        error.response.data.message == 'Attempt to read property "id" on null'
        
      ) {
        
        window.location.href = domain + "/tokenProcess";

      }

      if (
        error.request &&
        error.response.status == 500 &&
        error.response.data.message == 'Could not send message: Attempt to read property "id" on null'
        
      ) {
        
        window.location.href = domain + "/tokenProcess";

      }

      if(error.request && error.response.status == 401 && error.response.statusText == "Unauthorized"){
      
        window.location.href = domain + "/tokenProcess";
        // localStorage.setItem("processRefreshToken", true);
        // alert("Ngu");
      }
      if (
        error.request &&
        error.response.status == 500 &&
        error.response.data.message == "Token has expired"
      ) {
       
        window.location.href = domain + "/tokenProcess";
        
      }

      if(error.request &&
        error.response.status == 417 &&
        error.response.data.message == "Refresh token expired"){
          Cookies.set("isAdminLoggedIn", false);
          // Cookies.remove("access_token");
          // Cookies.remove("refresh_token");
          // Cookies.remove("admin_id");
          window.location.href = domain + "/login";
      }
      // if (
      //   error.request &&
      //   error.response.status == 401 &&
      //   error.response.data.error == "Access Token has expired"
      //   // error.response.statusText === "Unauthorized"
      // ) {
      //   window.location.href = "http://localhost:3001/tokenProcess";
      // }

      // if (
      //   error.request &&
      //   error.response.status == 401 &&
      //   error.response.statusText == "Unauthorized"
      // ) {
      //   window.location.href = "http://localhost:3001/tokenProcess";
      // }
      
      return Promise.reject(error);
    }
  );
  return instance;
};
