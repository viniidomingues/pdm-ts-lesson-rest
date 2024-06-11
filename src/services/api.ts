import axios from "axios";

const api = axios.create({
  baseURL: "https://pocketpdm.ocdev.debug.app.br", // android emulator accessing pocketbase on localhost
  // baseURL: "http://localhost:8090/", // ios simulator accessing pocketbase on localhost
  // baseURL: "http://your.own.deploy/", // any case accessing pocketbase hosted online
});

export default api;
