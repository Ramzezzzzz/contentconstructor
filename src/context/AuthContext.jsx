import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const API_BASE = "/movie/api"; // жёстко, без import.meta.env

  // При старте, если есть токен, проверяем его
  useEffect(() => {
    if (!token) return;
    console.log("🟡 Проверяем токен при старте:", token);
    fetch(API_BASE + "/auth.php", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🟢 Ответ auth.php:", data);
        if (data.id) {
          setUser(data);
        } else {
          // Токен невалиден – сбрасываем
          console.warn("🔴 Токен не принят, сбрасываем");
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      })
      .catch((err) => {
        console.error("🔴 Ошибка сети при проверке токена:", err);
        // Не сбрасываем токен при сетевой ошибке, может сервер недоступен
      });
  }, []); // пустой массив зависимостей — запускается один раз

  async function login(email, password) {
    console.log("🔵 Вызван login с email:", email);
    const res = await fetch(API_BASE + "/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("🔵 Ответ login.php:", data);
    if (!res.ok) throw new Error(data.error || "Ошибка входа");

    // Сохраняем токен
    localStorage.setItem("token", data.token);
    console.log("🟢 Токен сохранён в localStorage:", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(email, password, name) {
    const res = await fetch(API_BASE + "/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
    // После успешной регистрации сразу логинимся
    return await login(email, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
