import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OPTIONS } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "@/prisma";

export async function POST(request: NextRequest) {
  const schema = z.object({
    id: z.string(),
    comment: z.string(),
  });

  const response = schema.safeParse(await request.json());

  if (!response.success) {
    return NextResponse.json({ error: response.error });
  }

  const { id, comment } = response.data;

  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    return NextResponse.json({ error: true });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!user) {
    return NextResponse.json({ error: true });
  }
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!post) {
    return NextResponse.json({ error: true });
  }
  const comment_ = await prisma.comment.create({
    data: {
      text: comment,
      user: {
        connect: {
          id: user.id,
        },
      },
      post: {
        connect: {
          id: parseInt(id),
        },
      },
    },
  });
  return NextResponse.json({ comment: comment_ });
}
