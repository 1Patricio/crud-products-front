import axios from "axios";

const api = axios.create({
    baseURL: "https://crud-products-back.onrender.com/",
    headers: {
        "Content-Type": "application/json"
    }
})

export default api;