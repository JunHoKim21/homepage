"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await clientApiFetch<{
        accessToken: string;
        refreshToken: string;
      }>("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          totpCode: totpCode || null,
        }),
      });
      localStorage.setItem("admin_access_token", data.accessToken);
      localStorage.setItem("admin_refresh_token", data.refreshToken);
      router.replace("/admin");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl btn-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">관리자 콘솔 로그인</h1>
            <p className="text-xs text-slate-500">Starter Kit v2.0 Admin</p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">관리자 아이디</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">비밀번호</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Google OTP (2FA 활성화 시에만 입력)
          </label>
          <input
            type="text"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            placeholder="6자리 숫자 (선택)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">{errorMsg}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl btn-primary py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "인증 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
