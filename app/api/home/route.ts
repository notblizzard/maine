import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const posts = await prisma.post.findMany({
    where: {
      rating: "GENERAL",
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });
  return NextResponse.json({ posts });
}
