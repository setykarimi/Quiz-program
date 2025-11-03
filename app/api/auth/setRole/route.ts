import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚠️ اینجا Service Role Key استفاده میشه، پس فقط سرور
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id)
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });

    // ✅ ست کردن role داخل app_metadata
    const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      app_metadata: { role: "member" },
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
