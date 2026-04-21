import axios from "axios";

const baseURL = window.location.href.includes('localhost')? "http://localhost:3000/api" : import.meta.env.VITE_API_BASE_URL;

export const axiosInstance=axios.create({baseURL, withCredentials: true,})