import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ApiError, apiFetch, isApiConfigured } from "@/lib/api";

export type Role = "VISITOR" | "WRITER" | "ADMIN";
export type Permission = "READ" | "WRITE" | "DELETE";

interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  role: Role;
  permissions: Permission[];
}

interface AuthState {
  token: string | null;
  role: Role | null;
  permissions: Permission[];
  expiresAt: number | null;
}

interface AuthContextValue extends AuthState {
  login: (role: Role) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
  isApiConfigured: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ROLE_STORAGE_KEY = "funkids-role";
// Refresh slightly before the JWT actually expires.
const REFRESH_LEAD_MS = 5_000;

function readStoredRole(): Role | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return v === "VISITOR" || v === "WRITER" || v === "ADMIN" ? v : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    permissions: [],
    expiresAt: null,
  });
  const [loading, setLoading] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const issueToken = useCallback(async (role: Role): Promise<TokenResponse> => {
    return apiFetch<TokenResponse>("/token", { method: "POST", body: { role } });
  }, []);

  const scheduleRefresh = useCallback(
    (role: Role, expiresInMs: number) => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      const delay = Math.max(expiresInMs - REFRESH_LEAD_MS, 0);
      refreshTimer.current = setTimeout(() => {
        void refresh(role);
      }, delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const refresh = useCallback(
    async (role: Role) => {
      try {
        const data = await issueToken(role);
        setState({
          token: data.access_token,
          role: data.role,
          permissions: data.permissions,
          expiresAt: Date.now() + data.expires_in * 1000,
        });
        scheduleRefresh(role, data.expires_in * 1000);
      } catch (err) {
        // Backend unreachable or rejected — drop the session quietly.
        if (err instanceof ApiError) {
          // eslint-disable-next-line no-console
          console.warn("[auth] token refresh failed:", err.message);
        }
        setState({ token: null, role: null, permissions: [], expiresAt: null });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(ROLE_STORAGE_KEY);
        }
      }
    },
    [issueToken, scheduleRefresh],
  );

  const login = useCallback(
    async (role: Role) => {
      if (!isApiConfigured) {
        throw new ApiError("API not configured (set VITE_API_URL in .env)", 0);
      }
      setLoading(true);
      try {
        const data = await issueToken(role);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ROLE_STORAGE_KEY, data.role);
        }
        setState({
          token: data.access_token,
          role: data.role,
          permissions: data.permissions,
          expiresAt: Date.now() + data.expires_in * 1000,
        });
        scheduleRefresh(role, data.expires_in * 1000);
      } finally {
        setLoading(false);
      }
    },
    [issueToken, scheduleRefresh],
  );

  const logout = useCallback(() => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    }
    setState({ token: null, role: null, permissions: [], expiresAt: null });
  }, []);

  // On mount, if the user previously chose a role, silently re-issue a fresh token.
  useEffect(() => {
    if (!isApiConfigured) return;
    const stored = readStoredRole();
    if (!stored) return;
    void refresh(stored);
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isLoggedIn: !!state.token,
        isApiConfigured,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
