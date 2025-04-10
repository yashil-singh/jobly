import axios from "axios";
import { BASE_API_URL } from "../lib/constants";

// Axios instance
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// GET request
export const GET = async (endpoint: string = "", params?: URLSearchParams) => {
  const response = await api.get(endpoint, { params });
  return response.data;
};

export const POST = async <T>(endpoint: string = "", body?: T) => {
  const response = await api.post(endpoint, body);
  return response.data;
};

export const PATCH = async <T>(endpoint: string = "", body?: T) => {
  const response = await api.patch(endpoint, body);
  return response.data;
};

export const DELETE = async (endpoint: string = "") => {
  const response = await api.delete(endpoint);
  return response.data;
};
