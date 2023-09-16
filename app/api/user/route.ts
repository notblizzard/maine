import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { zfd } from "zod-form-data";
import upload from "@/upload";

export async function GET(request: Request) {
  const session = await getServerSession(OPTIONS);
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (user) {
      return NextResponse.json({ user });
    }
  }
}

export async function POST(request: Request) {
  const schema = zfd.formData({
    username: zfd.text(),
    description: zfd.text().nullable().optional(),
    avatar: zfd.text().nullable().optional(),
    birthday: zfd.text(),
  });
  const session = await getServerSession(OPTIONS);
  if (session?.user?.email) {
    const response = schema.safeParse(await request.formData());
    if (!response.success) {
      return NextResponse.json(response.error);
    }
    const { username, description, avatar, birthday } = response.data;
    if (avatar) {
      const buffer = Buffer.from(
        avatar.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );
      const uuid = await upload(buffer, "avatars");
      const user = await prisma.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          username,
          description,
          birthday: new Date(birthday),
          avatar: uuid,
        },
      });
      return NextResponse.json({ user });
    } else {
      const user = await prisma.user.update({
        where: {
          email: session.user.email,
        },
        data: {
          username,
          description,
          birthday: new Date(birthday),
        },
      });
      return NextResponse.json({ user });
    }
  }
}
