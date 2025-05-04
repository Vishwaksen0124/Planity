import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const isLocal = window.location.hostname === "localhost";
const API_URI = isLocal ? "http://localhost:8800" : window.location.origin;

const baseQuery = fetchBaseQuery({ baseUrl: API_URI +"/api" });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});