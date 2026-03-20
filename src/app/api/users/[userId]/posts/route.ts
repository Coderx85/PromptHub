import { NextResponse } from "next/server";

import { useGetUserPrompts } from "@/actions";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const resolvedParams = await params;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);

  const result = await useGetUserPrompts({
    userId: resolvedParams.userId,
    page,
    limit,
  });

  if (result.status !== "success" || !result.data) {
    return NextResponse.json(
      {
        error: result.error?.message || "Failed to fetch user prompts",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(result.data);
}