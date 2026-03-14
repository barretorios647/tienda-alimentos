"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const adminUser = "admin";
    const adminPass = "123456";

    if (username === adminUser && password === adminPass) {
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin");
      return;
    }

    alert("Usuario o contraseña incorrectos");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          width: "350px",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Login administrador</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}