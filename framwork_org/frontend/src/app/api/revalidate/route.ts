import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("X-Revalidate-Secret");
  const expectedSecret = process.env.REVALIDATE_SECRET || "starter_revalidate_secret_2026";

  if (secret !== expectedSecret) {
    return NextResponse.json({ success: false, message: "Unauthorized revalidate secret" }, { status: 401 });
  }

  let tag = "site-configs";
  try {
    const body = (await request.json()) as { tag?: string };
    if (body?.tag) {
      tag = body.tag;
    }
  } catch {
    // default tag 사용
  }

  revalidateTag(tag);
  revalidatePath("/", "layout");

  return NextResponse.json({
    success: true,
    revalidated: true,
    tag,
    timestamp: new Date().toISOString(),
  });
}
