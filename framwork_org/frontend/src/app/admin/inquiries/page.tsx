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

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);

  function load() {
    adminApiFetch<InquiryItem[]>("/api/admin/inquiries").then(setItems).catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id: number, status: string) {
    await adminApiFetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, adminMemo: "" }),
    });
    load();
  }

  async function downloadProtectedFile(url: string, fallbackName: string) {
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
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

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
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
