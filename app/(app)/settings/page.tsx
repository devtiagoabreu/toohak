"use client";

import { useSession, signOut } from "next-auth/react";
import { getDisplayName, getInitials } from "@/lib/userDisplay";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const name = getDisplayName(user);
  const initials = getInitials(user);

  if (status === "loading") {
    return <div className="page-loading">Carregando...</div>;
  }

  return (
    <div className="settings-page" style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Configurações</h1>

      <section style={{ background: "var(--surface, #fff)", border: "1px solid var(--border, #e5e7eb)", borderRadius: 16, padding: "1.5rem", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 650, marginBottom: "1rem" }}>Perfil</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1rem" }}>
          <div aria-label="Avatar do usuário" style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent, #6366f1)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 650, fontSize: "1.05rem" }}>{name}</div>
            <div style={{ color: "var(--text-secondary, #6b7280)" }}>{user?.email || "—"}</div>
          </div>
        </div>
        <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 8, columnGap: 12, margin: 0 }}>
          <dt style={{ color: "var(--text-secondary, #6b7280)" }}>Nome</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{user?.name || "—"}</dd>
          <dt style={{ color: "var(--text-secondary, #6b7280)" }}>Email</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{user?.email || "—"}</dd>
          <dt style={{ color: "var(--text-secondary, #6b7280)" }}>Plano</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>Gratuito</dd>
        </dl>
      </section>

      <section style={{ background: "var(--surface, #fff)", border: "1px solid var(--border, #e5e7eb)", borderRadius: 16, padding: "1.5rem", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 650, marginBottom: "0.5rem" }}>Conta</h2>
        <p style={{ color: "var(--text-secondary, #6b7280)", marginBottom: "1rem" }}>Gerencie sua sessão neste dispositivo.</p>
        <button onClick={() => signOut({ callbackUrl: "/auth/login" })} style={{ background: "#DC2626", color: "#fff", border: 0, borderRadius: 10, padding: "0.6rem 1rem", fontWeight: 600, cursor: "pointer" }}>
          Sair da conta
        </button>
      </section>

      <section style={{ background: "var(--surface, #fff)", border: "1px solid var(--border, #e5e7eb)", borderRadius: 16, padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 650, marginBottom: "0.5rem" }}>Sobre o Toohak</h2>
        <p style={{ margin: 0, color: "var(--text-secondary, #6b7280)", lineHeight: 1.6 }}>
          Criador do Toohak: <strong>Tiago de Abreu</strong> (<a href="https://github.com/devtiagoabreu" target="_blank" rel="noreferrer">@devtiagoabreu</a>) — marido da Marina e pai da Rosa, Ágatha e Cecília.
        </p>
      </section>
    </div>
  );
}
