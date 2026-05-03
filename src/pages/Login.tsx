import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, KeyRound, LogOut, ShieldCheck, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useAuth, type Role } from "@/contexts/AuthContext";

const ROLES: {
  key: Role;
  icon: typeof Eye;
  permsKey: string;
  descKey: string;
}[] = [
  { key: "VISITOR", icon: Eye, permsKey: "auth.perms.read", descKey: "auth.desc.visitor" },
  { key: "WRITER", icon: Wrench, permsKey: "auth.perms.read_write", descKey: "auth.desc.writer" },
  { key: "ADMIN", icon: ShieldCheck, permsKey: "auth.perms.full", descKey: "auth.desc.admin" },
];

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, logout, role, permissions, isApiConfigured, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (chosen: Role) => {
    setError(null);
    try {
      await login(chosen);
      navigate("/catalog");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error"));
    }
  };

  return (
    <main className="container mx-auto min-h-[60vh] max-w-2xl px-4 py-10">
      <SEO title={t("auth.login")} noIndex />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground md:text-4xl">
          <KeyRound className="h-8 w-8 text-primary" />
          {t("auth.login")}
        </h1>
        <p className="mt-2 font-body text-muted-foreground">{t("auth.login_desc")}</p>
      </motion.div>

      {!isApiConfigured && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 font-body text-sm text-destructive">
          {t("auth.api_missing")}
        </div>
      )}

      {role && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div>
            <p className="font-body text-sm text-muted-foreground">
              {t("auth.signed_in_as")}
            </p>
            <p className="font-display text-lg font-bold text-primary">{role}</p>
            <p className="mt-1 font-body text-xs text-muted-foreground">
              {permissions.join(" · ")}
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2 rounded-full">
            <LogOut className="h-4 w-4" />
            {t("auth.logout")}
          </Button>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            disabled={!isApiConfigured || loading}
            onClick={() => handleLogin(r.key)}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-toy disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <r.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-lg font-bold text-foreground">{r.key}</p>
            <p className="font-body text-xs text-muted-foreground">{t(r.descKey)}</p>
            <p className="mt-1 font-body text-[11px] font-semibold uppercase tracking-wider text-primary">
              {t(r.permsKey)}
            </p>
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 font-body text-sm text-destructive">{error}</p>
      )}

      <p className="mt-6 font-body text-xs text-muted-foreground">
        {t("auth.token_note")}{" "}
        <Link to="/catalog" className="text-primary underline-offset-2 hover:underline">
          {t("auth.skip_to_catalog")}
        </Link>
      </p>
    </main>
  );
};

export default Login;
