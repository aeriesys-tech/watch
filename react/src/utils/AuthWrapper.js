import axios from "axios";
import { getToken } from "./TokenService";

const authWrapper = async (endpoint, data, rawResponse = false) => {
  const token = getToken();
  const headers = {};

  if (token) {
    console.log(token);
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set 'Content-Type' to 'application/json' if the data is not FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_API_URL}/api${endpoint}`,
      data,
      { headers }
    );

    if (rawResponse) {
      return response;
    }

    return response.data; // Automatically parse JSON response
  } catch (error) {
    const errorMessage = error.response?.data || "Something went wrong";
    console.error("Axios error:", errorMessage);
    error.message = errorMessage;
    throw error;
  }
};

export default authWrapper;
