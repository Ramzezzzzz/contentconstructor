import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const API_BASE = import.meta.env.BASE_URL + "api"; // = '/movie/api/'

  // При загрузке проверяем токен
  useEffect(() => {
    if (!token) return;
    fetch(API_BASE + "/auth.php", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setUser(data);
        } else {
          logout();
        }
      })
      .catch(() => logout());
  }, [token]);

  async function login(email, password) {
    const res = await fetch(API_BASE + "/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ошибка входа");
    localStorage.setItem("token", data.token);
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
