"use client";

import { useEffect, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { adminApiFetch } from "@/lib/api";

interface InquiryItem {
  id: number;
  category: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  title: string;
  content: string;
  customFieldsJson: string;
  attachmentMediaId: number | null;
  status: string;
  adminMemo: string | null;
  clientIp: string;
  createdAt: string;
}

const DEFAULT_DEMO_INQUIRIES: InquiryItem[] = [
  {
    id: 9001,
    category: "ESTIMATE",
    customerName: "김도현 대표",
    customerPhone: "010-3412-8890",
    customerEmail: "dhkim@hanbit-precision.co.kr",
    title: "제조업 B2B 영문/국문 기업 홈페이지 Deluxe 견적 문의",
    content: "제품 카탈로그와 견적서 파일 첨부 기능이 포함된 기업 홈페이지를 제작하고 싶습니다.",
    customFieldsJson: JSON.stringify({ desiredPackage: "DELUXE", industry: "CORP" }),
    attachmentMediaId: null,
    status: "PENDING",
    adminMemo: null,
    clientIp: "127.0.0.1",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 9002,
    category: "ESTIMATE",
    customerName: "박지연 원장",
    customerPhone: "010-7721-5430",
    customerEmail: "clinic@brightdental.kr",
    title: "치과 네이버 예약 연동 및 진료 안내 페이지 구축 상담",
    content: "네이버 스마트플레이스 예약 연동과 자체 시간대 예약을 함께 운영하고 싶습니다.",
    customFieldsJson: JSON.stringify({ desiredPackage: "DELUXE", industry: "CLINIC" }),
    attachmentMediaId: null,
    status: "IN_PROGRESS",
    adminMemo: null,
    clientIp: "127.0.0.1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 9003,
    category: "GENERAL",
    customerName: "이준호 팀장",
    customerPhone: "010-9182-3304",
    customerEmail: "jhlee@cloudwave.io",
    title: "기존 회사 소개서 첨부 및 Premium 패키지 일정 확인",
    content: "다음 달 신규 서비스 오픈에 맞춰 7일 이내 구축이 가능한지 확인 부탁드립니다.",
    customFieldsJson: JSON.stringify({ desiredPackage: "PREMIUM", industry: "IT_STARTUP" }),
    attachmentMediaId: null,
    status: "COMPLETED",
    adminMemo: null,
    clientIp: "127.0.0.1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function getDemoInquiries(): InquiryItem[] {
  let savedList: InquiryItem[] = [];
  try {
    const raw = localStorage.getItem("demo_sample_inquiries");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        savedList = parsed.map((item: Partial<InquiryItem>, idx: number) => ({
          id: typeof item.id === "number" ? item.id : 8000 + idx,
          category: item.category || "ESTIMATE",
          customerName: item.customerName || "체험 고객",
          customerPhone: item.customerPhone || "010-0000-0000",
          customerEmail: item.customerEmail ?? null,
          title: item.title || "샘플 상담 문의",
          content: item.content || "",
          customFieldsJson: item.customFieldsJson || "{}",
          attachmentMediaId: item.attachmentMediaId ?? null,
          status: item.status || "PENDING",
          adminMemo: item.adminMemo ?? null,
          clientIp: item.clientIp || "127.0.0.1",
          createdAt: item.createdAt || new Date().toISOString(),
        }));
      }
    }
  } catch {
    // localStorage 파싱 실패 시 기본 샘플만 사용
  }
  return [...savedList, ...DEFAULT_DEMO_INQUIRIES];
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [isOfflineDemo, setIsOfflineDemo] = useState(false);

  function load() {
    const token = localStorage.getItem("admin_access_token");
    if (token === "demo-offline-token") {
      setIsOfflineDemo(true);
      setItems(getDemoInquiries());
      return;
    }

    adminApiFetch<InquiryItem[]>("/api/admin/inquiries")
      .then((list) => {
        setIsOfflineDemo(false);
        setItems(list);
      })
      .catch(() => {
        setIsOfflineDemo(true);
        setItems(getDemoInquiries());
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id: number, status: string) {
    if (isOfflineDemo) {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      try {
        const raw = localStorage.getItem("demo_sample_inquiries");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const updated = parsed.map((item: Partial<InquiryItem>) =>
              item.id === id ? { ...item, status } : item
            );
            localStorage.setItem("demo_sample_inquiries", JSON.stringify(updated));
          }
        }
      } catch {
        // ignore
      }
      return;
    }

    try {
      await adminApiFetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, adminMemo: "" }),
      });
      load();
    } catch {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    }
  }

  async function downloadProtectedFile(url: string, fallbackName: string) {
    if (isOfflineDemo) {
      alert("방문 고객 체험 모드에서는 실제 파일 다운로드 대신 샘플 화면만 제공됩니다.");
      return;
    }
    const token = localStorage.getItem("admin_access_token");
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      alert("다운로드 권한이 없거나 파일이 존재하지 않습니다.");
      return;
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fallbackName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">상담문의 관리</h1>
          <p className="mt-1 text-sm text-slate-500">
            접수된 문의와 비공개 보안 첨부파일을 확인하고 상태를 관리합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadProtectedFile("/api/admin/export/inquiries", "inquiries.xlsx")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          엑셀 다운로드 (.xlsx)
        </button>
      </div>

      {isOfflineDemo && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800 sm:text-sm">
          오프라인 체험 모드로 동작 중입니다. 직접 접수한 체험 문의와 기본 샘플 문의 3건을 함께 조회합니다.
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="px-4 py-3">접수일시</th>
              <th className="px-4 py-3">고객명 / 연락처</th>
              <th className="px-4 py-3">제목 / 내용</th>
              <th className="px-4 py-3">첨부파일</th>
              <th className="px-4 py-3">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  접수된 상담 문의가 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.customerName}</div>
                    <div className="text-xs text-slate-500">{item.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.content}</div>
                  </td>
                  <td className="px-4 py-3">
                    {item.attachmentMediaId ? (
                      <button
                        type="button"
                        onClick={() =>
                          downloadProtectedFile(
                            `/api/admin/media/${item.attachmentMediaId}/download`,
                            `inquiry_${item.id}_attachment`
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-primary hover:bg-slate-50"
                      >
                        <Download className="h-3.5 w-3.5" /> 비공개 다운로드
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium"
                    >
                      <option value="PENDING">접수대기</option>
                      <option value="IN_PROGRESS">상담중</option>
                      <option value="COMPLETED">완료</option>
                      <option value="SPAM">스팸</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
