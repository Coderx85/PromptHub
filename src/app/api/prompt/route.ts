import { NextResponse } from "next/server";

import { useGetAllPrompts } from "@/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  const result = await useGetAllPrompts({ page, limit });

  if (result.status !== "success" || !result.data) {
    return NextResponse.json(
      {
        error: result.error?.message || "Failed to fetch prompts",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(result.data);
}