import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import zeusLogo from "@/assets/zeus-logo-hd.png";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isLoggedIn, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/minha-conta", { replace: true });
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <img src={zeusLogo} alt="Zeus Rental Car" className="h-20 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-primary">ZEUS</span>
              <span className="text-muted-foreground font-light ml-1">RENTAL CAR</span>
            </h1>
          </a>
          <p className="text-muted-foreground text-sm mt-2">
            {mode === "login" ? "Acesse sua conta para gerenciar suas reservas" : "Recupere o acesso à sua conta"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg p-8">
          {mode === "login" ? (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-6">Entrar</h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                const success = login(email.trim(), password.trim());
                if (success) {
                  navigate("/minha-conta");
                } else {
                  toast({ title: "Erro", description: "E-mail ou senha incorretos.", variant: "destructive" });
                }
              }} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full h-10 pl-10 pr-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-10 pr-10 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 gold-gradient text-primary-foreground rounded-lg text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Entrar
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-border/30 text-center">
                <p className="text-xs text-muted-foreground">
                  Não tem conta?{" "}
                  <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Criar conta
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setMode("login")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft size={14} />
                Voltar ao login
              </button>

              <h2 className="text-lg font-semibold text-foreground mb-2">Recuperar senha</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Informe seu e-mail e enviaremos instruções para redefinir sua senha.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full h-10 pl-10 pr-3 rounded-lg border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 gold-gradient text-primary-foreground rounded-lg text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Enviar link de recuperação
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
          © {new Date().getFullYear()} Zeus Rental Car. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
