import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const api = axios.create({
    baseURL: isLocalhost ? "http://localhost:8081/" : "https://crud-products-back.onrender.com/",
    headers: {
        "Content-Type": "application/json"
    }
})

export default api;