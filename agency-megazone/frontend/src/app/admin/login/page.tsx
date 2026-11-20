"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Lock, Rocket } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

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

  async function handleOneClickDemo() {
    setDemoLoading(true);
    setErrorMsg("");

    try {
      const data = await clientApiFetch<{
        accessToken: string;
        refreshToken: string;
      }>("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: "admin",
          password: "Admin1234!",
          totpCode: null,
        }),
      });
      localStorage.setItem("admin_access_token", data.accessToken);
      localStorage.setItem("admin_refresh_token", data.refreshToken);
      router.replace("/admin");
    } catch {
      // 백엔드 API 오프라인 시 방문 고객 체험용 폴백 토큰 발급
      localStorage.setItem("admin_access_token", "demo-offline-token");
      localStorage.setItem("admin_refresh_token", "demo-offline-refresh");
      router.replace("/admin");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#0B0F19] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-blue-600/20" />

      <div className="relative w-full max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>홈페이지로 돌아가기</span>
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">관리자 콘솔 로그인</h1>
              <p className="text-xs text-slate-500">홈페이지 통합 운영 · 무코드 설정 센터</p>
            </div>
          </div>

          {/* 방문 고객 전용 1초 원클릭 체험 버튼 */}
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/70 p-4">
            <p className="text-xs font-semibold text-blue-900">
              가입이나 비밀번호 입력 없이 관리자 화면을 바로 둘러보시겠어요?
            </p>
            <button
              type="button"
              onClick={handleOneClickDemo}
              disabled={demoLoading || loading}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
            >
              <Rocket className="h-4 w-4 shrink-0" />
              <span>
                {demoLoading
                  ? "관리자 콘솔 입장 중..."
                  : "🚀 방문 고객 전용: 1초 원클릭 관리자 체험하기"}
              </span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-medium text-slate-400">또는 관리자 계정 로그인</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                관리자 아이디
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                2단계 보안 인증 번호 (보안 설정 시에만 입력)
              </label>
              <input
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="6자리 숫자 (선택)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>

            {errorMsg && (
              <div className="space-y-1 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
                <p>{errorMsg}</p>
                {errorMsg.includes("백엔드 서버") && (
                  <p className="text-[11px] text-red-500">
                    💡 백엔드 없이 화면을 둘러보시려면 상단의 <strong>[1초 원클릭 관리자 체험하기]</strong>를 클릭하세요.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full rounded-xl bg-[#0B0F19] py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "인증 중..." : "계정으로 로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
