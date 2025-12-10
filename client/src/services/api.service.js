// src/api.js
import axios from "axios";

/**
 * Crea una instancia de axios con configuración por defecto.
 * Cambia baseURL por la URL de tu backend.
 */
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000, // 10s timeout (opcional)
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Helpers para gestionar token en localStorage (o donde elijas guardarlo).
 * Puedes cambiar a cookies httpOnly si quieres más seguridad.
 */
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
};

export const getAuthToken = () => localStorage.getItem("token");

/**
 * REQUEST INTERCEPTOR
 * Añade el header Authorization Bearer si existe token.
 */
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Maneja respuestas globales; aquí puedes detectar 401 y tratar refresh tokens.
 * Este ejemplo hace reintento simple con refresh token si está implementado.
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si no hay respuesta o no es 401, propaga error
        if (!error.response) return Promise.reject(error);
        if (error.response.status !== 401) return Promise.reject(error);

        // Evitar loop infinito
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // Si ya estamos refrescando, encolar la petición
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        // Iniciar flujo de refresh token
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Asumimos que tienes /auth/refresh que devuelve { token, refreshToken? }
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token");

            const { data } = await axios.post(
                `${"http://localhost:5000"}/api/auth/refresh-token`,
                { refreshToken }
            );

            // Guardar nuevo token
            setAuthToken(data.token);
            localStorage.setItem("refreshToken", data.refreshToken || refreshToken);

            api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            processQueue(null, data.token);
            return api(originalRequest);
        } catch (err) {
            processQueue(err, null);
            // Si el refresh falla, limpia estado de auth
            setAuthToken(null);
            localStorage.removeItem("refreshToken");
            // opcional: redirigir a login
            // window.location.href = "/login";
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
