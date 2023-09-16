import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl);
  const username = searchParams.get("username")!;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      posts: {
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });
  if (!user) {
    return NextResponse.json({ error: true });
  }
  return NextResponse.json({ user });
}
