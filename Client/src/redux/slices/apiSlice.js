import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const isLocal = window.location.hostname === "localhost";
const API_URI = isLocal
  ? "http://localhost:8800"
  : "https://planity-4l0m.onrender.com";


const baseQuery = fetchBaseQuery({ baseUrl: API_URI +"/api" ,
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});