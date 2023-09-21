import prisma from "@/prisma";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { OPTIONS } from "../auth/[...nextauth]/route";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("params")!;
  const skip = parseInt(searchParams.get("skip")!);

  let showNSFW;
  let posts;
  const session = await getServerSession(OPTIONS);
  if (session?.user?.email) {
    const authUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (authUser) {
      const now = dayjs();
      const birthday = dayjs(authUser.birthday);
      const age = now.diff(birthday, "year");
      if (age >= 18) {
        showNSFW = true;
      }
    }
  }
  if (!showNSFW) {
    posts = await prisma.post.findMany({
      where: {
        NOT: {
          rating: {
            in: ["MATURE", "EXPLICIT"],
          },
        },
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            tags: {
              some: {
                tag: {
                  name: {
                    in: search.split(" "),
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip * 10,
      take: 10,
    });
  } else {
    posts = await prisma.post.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip * 10,
      take: 10,
    });
  }
  if (posts.length <= 9) {
    return NextResponse.json({ posts, noMore: true });
  } else {
    return NextResponse.json({ posts });
  }
}
