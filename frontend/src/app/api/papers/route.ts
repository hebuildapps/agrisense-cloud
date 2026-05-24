import { NextResponse } from "next/server";

import { loadExtractedPaperArtifacts } from "@/lib/extracted-papers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const artifacts = await loadExtractedPaperArtifacts();
    return NextResponse.json(artifacts);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load paper extracts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}