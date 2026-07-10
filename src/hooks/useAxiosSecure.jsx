import { useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "./useAuthContext";
import safeStorage from "../utils/storage";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuthContext();

  // Create the axios instance ONCE (not on every render)
  const axiosSecure = useMemo(
    () =>
      axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
      }),
    []
  );

  // Store interceptor IDs so we can properly eject them
  const interceptorIds = useRef({ request: null, response: null });

  useEffect(() => {
    // Add request interceptor — inject JWT token
    interceptorIds.current.request = axiosSecure.interceptors.request.use(
      (config) => {
        var accessToken = safeStorage.getItem("ub-jewellers-jwt-token");
        if (accessToken) {
          config.headers["Authorization"] = "Bearer " + accessToken;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    // Add response interceptor — handle 401/403
    interceptorIds.current.response = axiosSecure.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          logOut()
            .then(function () {})
            .catch(function (err) {
              console.error(err);
            });
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: eject using the correct interceptor IDs
    return function () {
      if (interceptorIds.current.request !== null) {
        axiosSecure.interceptors.request.eject(
          interceptorIds.current.request
        );
      }
      if (interceptorIds.current.response !== null) {
        axiosSecure.interceptors.response.eject(
          interceptorIds.current.response
        );
      }
    };
  }, [axiosSecure, logOut, navigate]);

  return [axiosSecure];
};

export default useAxiosSecure;
