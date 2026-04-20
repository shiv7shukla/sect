import axios from "axios";

const baseURL = window.location.href.includes('localhost')
    ? import.meta.env.VITE_API_BASE_URL : 'https://wallpapers-by-alex.vercel.app';

export const axiosInstance=axios.create({baseURL, withCredentials: true,})