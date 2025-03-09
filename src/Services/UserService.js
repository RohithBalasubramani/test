// /src/Services/UserService.js
import { httpClient } from "./HttpClient";

const KEYCLOAK_BASE_URL = "http://206.189.131.153";
const REALM = "Premier";
const CLIENT_ID = "premier-app";

/**
 * Logs the user in with username + password
 * using Keycloak's Direct Access (password) grant.
 */
const loginWithCredentials = async (username, password) => {
  try {
    const response = await fetch(
      `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "password",
          username: username,
          password: password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    const data = await response.json();
    console.log("Login successful! Data:", data);

    // Store tokens in localStorage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("expires_in", String(data.expires_in));

    // Set Authorization header for subsequent requests
    httpClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.access_token}`;

    return { success: true, token: data.access_token };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Retrieve the current access token from localStorage.
 */
const getToken = () => localStorage.getItem("access_token");

/**
 * Check if user is considered "logged in" (i.e., has an access token).
 */
const isLoggedIn = () => !!getToken();

/**
 * Logs out by removing tokens from storage, clearing auth headers,
 * and redirecting to /login.
 */
const doLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_in");
  delete httpClient.defaults.headers.common["Authorization"];

  // Redirect to login page or some other route
  window.location.href = "/login";
};

const UserService = {
  loginWithCredentials,
  getToken,
  isLoggedIn,
  doLogout,
};

export default UserService;
