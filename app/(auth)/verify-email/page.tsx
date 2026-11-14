export default function VerifyEmailPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="page-header" style={{ marginBottom: "1.5rem" }}>
          <h1>Verifique seu email</h1>
        </div>
        <div className="alert alert-success">
          Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta.
        </div>
        <p className="text-muted" style={{ textAlign: "center" }}>
          Não recebeu o email? Verifique a caixa de spam ou tente novamente.
        </p>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <a href="/auth/login" style={{ color: "#007bff" }}>
            Já verifyi meu email, fazer login
          </a>
        </p>
      </div>
    </main>
  );
}
