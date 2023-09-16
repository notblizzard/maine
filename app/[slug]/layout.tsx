"use client";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  username: string;
  avatar: string;
  createdAt: Date;
};
export default function RootLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(null!);
  const pathname = usePathname();
  useEffect(() => {
    fetch(`/api/profile?username=${params.slug}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, [params.slug]);

  const activeLink = (path: string) => {
    return `font-bold text-xl m-4 ${
      path === pathname ? "text-amber-400" : "text-slate-400"
    }`;
  };

  return (
    <>
      {user && (
        <div className="flex flex-col justify-center  py-24 px-10">
          <div className="grid grid-cols-12 bg-slate-900/80 p-4">
            <div className="col-span-1">
              <Image
                src={`https://cdn.notblizzard.dev/maine/avatars/${user.avatar}.png`}
                width={100}
                height={100}
                alt={user.avatar}
              />
            </div>
            <div className="col-span-11">
              <div className="flex flex-col justify-between">
                <p className="font-bold text-xl text-amber-400">
                  {user.username}
                </p>
                <p className="font-semibold text-lg text-emerald-400">
                  Registered {dayjs(user.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
            </div>
            <div className="col-span-12">
              <div className="flex flex-row">
                <Link
                  href={`/${params.slug}`}
                  className={activeLink(`/${params.slug}`)}
                >
                  Home
                </Link>
                <Link
                  href={`/${params.slug}/gallery`}
                  className={activeLink(`/${params.slug}/gallery`)}
                >
                  Gallery
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 mt-4">
            <div className="col-span-12">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
