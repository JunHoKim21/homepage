"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, Rocket, ShieldCheck } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin1234!");
  const [totpCode, setTotpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function executeLogin(loginUser: string, loginPass: string, allowOfflineFallback: boolean) {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await clientApiFetch<{
        accessToken: string;
        refreshToken: string;
      }>("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: loginUser,
          password: loginPass,
          totpCode: totpCode || null,
        }),
      });
      localStorage.setItem("admin_access_token", data.accessToken);
      localStorage.setItem("admin_refresh_token", data.refreshToken);
      router.replace("/admin");
    } catch (err) {
      if (allowOfflineFallback) {
        // 백엔드 서버가 꺼져 있는 오프라인 프리뷰 환경에서도 즉시 대시보드 체험이 가능하도록 처리
        localStorage.setItem("admin_access_token", "demo-offline-token");
        localStorage.setItem("admin_refresh_token", "demo-offline-refresh-token");
        router.replace("/admin");
        return;
      }
      setErrorMsg(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    await executeLogin(username, password, false);
  }

  async function handleOneClickDemo() {
    setUsername("admin");
    setPassword("Admin1234!");
    await executeLogin("admin", "Admin1234!", true);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        {/* 상단 홈 복귀 링크 */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>홈페이지 메인으로 돌아가기</span>
          </Link>
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            JWT + 2FA 보안 인증
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-white p-7 shadow-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">한국형 관리자 콘솔 로그인</h1>
              <p className="text-xs text-slate-500">
                무코드 SEO · 상담문의 · 하이브리드 예약 통합 상황판
              </p>
            </div>
          </div>

          {/* 1초 원클릭 관리자 체험하기 버튼 영역 */}
          <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span>크몽·숨고 의뢰인 전용 쇼룸</span>
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] text-white">
                ID/PW 자동입력
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              비밀번호를 타이핑하실 필요 없이 아래 버튼만 누르면 즉시 관리자 대시보드로 입장합니다.
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={handleOneClickDemo}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Rocket className="h-4 w-4" />
              <span>[🚀 방문 고객 전용: 1초 원클릭 관리자 체험하기]</span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>또는 직접 계정 입력</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">관리자 아이디</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                비밀번호 (기본 데모: Admin1234!)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">
                Google OTP (Pro 2FA 활성화 시에만 입력)
              </label>
              <input
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="6자리 숫자 (기본 비활성)"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "인증 확인 중..." : "관리자 콘솔 로그인"}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-500">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              실제 고객 납품 시 초기 비밀번호 강제 변경 및 관리자 IP·2FA 보안 정책이 적용됩니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
