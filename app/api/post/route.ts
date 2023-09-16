import prisma from "@/prisma";
import upload from "@/upload";
import { NextRequest, NextResponse } from "next/server";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { OPTIONS } from "../auth/[...nextauth]/route";
import dayjs from "dayjs";

export async function GET(request: NextRequest) {
  const session = await getServerSession(OPTIONS);
  const { searchParams } = new URL(request.nextUrl);
  const id = searchParams.get("id")!;

  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.redirect("/404");
  }

  if (!session?.user?.email && post.rating !== "GENERAL") {
    return NextResponse.json({ error: true });
  }

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: true });
    }
    const now = dayjs();
    const birthday = dayjs(user.birthday);
    const age = now.diff(birthday, "year");
    if (post.rating !== "GENERAL" && age < 18) {
      return NextResponse.json({ error: true });
    }
  }
  return NextResponse.json({ post });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(OPTIONS);
  const schema = zfd.formData({
    title: zfd.text(),
    description: zfd.text(),
    image: zfd.file(),
    tags: zfd.json(z.array(z.string())),
    rating: zfd.text(),
  });
  const response = schema.safeParse(await request.formData());
  if (!response.success) {
    return NextResponse.json({ error: response.error });
  }
  if (session?.user?.email) {
    const { title, description, image, tags, rating } = response.data;
    const buffer = Buffer.from(await image.arrayBuffer());

    const uuid = await upload(buffer, "uploads");

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    const post = await prisma.post.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        title,
        description,
        rating,
        image: uuid,
        tags: {
          create: tags.map((tag) => {
            return {
              tag: {
                connectOrCreate: {
                  where: {
                    name: tag,
                  },
                  create: {
                    name: tag,
                  },
                },
              },
            };
          }),
        },
      },
    });

    return NextResponse.json({ post });
  }
}
