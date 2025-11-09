import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ساخت کلاینت Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // گرفتن همه کاربران
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    return NextResponse.json(data.users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
