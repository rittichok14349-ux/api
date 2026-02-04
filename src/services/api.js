import axios from "axios";

const BASE_URL = 'wedstd.huaiyot.ac.th';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type' : 'application/json'
    },
});

export default api;
