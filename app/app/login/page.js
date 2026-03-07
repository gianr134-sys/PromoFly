"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    try {
      setLoading(true);

      if (!email || !senha) {
        alert("Preencha email e senha.");
        return;
      }

      if (modo === "cadastro") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
        });

        if (error) {
          alert(error.message);
          return;
        }

        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            nome,
            email,
            assinatura_ativa: false,
            plano: "free",
          });

          if (profileError) {
            alert(profileError.message);
            return;
          }
        }

        alert("Conta criada com sucesso. Agora faça login.");
        setModo("login");
        setSenha("");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        alert(error.message);
        return;
      }

      window.location.href = "/painel";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Entrar no PromoFly ✈️</h1>
        <p style={subtitle}>
          Faça login para acessar seus alertas e sua assinatura.
        </p>

        <div style={tabRow}>
          <button
            type="button"
            style={modo === "login" ? activeTab : tab}
            onClick={() => setModo("login")}
          >
            Login
          </button>

          <button
            type="button"
            style={modo === "cadastro" ? activeTab : tab}
            onClick={() => setModo("cadastro")}
          >
            Cadastro
          </button>
        </div>

        {modo === "cadastro" && (
          <input
            style={input}
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        )}

        <input
          style={input}
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          type="button"
          style={button}
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? "Carregando..." : modo === "login" ? "Entrar" : "Criar conta"}
        </button>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #dff3ff 0%, #fff8db 100%)",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#fff",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const title = {
  fontSize: "32px",
  fontWeight: "800",
  marginBottom: "10px",
};

const subtitle = {
  color: "#555",
  marginBottom: "20px",
};

const tabRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const tab = {
  flex: 1,
  padding: "14px",
  borderRadius: "14px",
  border: "2px solid #ddd",
  background: "#f7f7f7",
  cursor: "pointer",
  fontWeight: "700",
};

const activeTab = {
  ...tab,
  background: "#3478f6",
  color: "#fff",
  border: "2px solid #3478f6",
};

const input = {
  width: "100%",
  padding: "16px",
  marginBottom: "14px",
  borderRadius: "14px",
  border: "2px solid #ddd",
  fontSize: "16px",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: "18px",
  borderRadius: "999px",
  border: "none",
  background: "#f29d32",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "800",
  cursor: "pointer",
};
