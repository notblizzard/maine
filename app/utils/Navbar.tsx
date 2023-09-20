"use client";

import { Input } from "@/components/ui/input";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  avatar: string;
  username: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User>(null!);
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    }
  }, [session]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && search !== "") {
      return router.push(`/search?params=${search}`);
    }
  };
  return (
    <>
      {user && (
        <div className="z-10 flex flex-row bg-slate-800/60 backdrop-filter backdrop-blur-sm  text-black p-4 justify-end items-center w-full absolute top-0">
          <Input
            className="w-2/6 mx-10"
            placeholder="Search"
            onKeyDown={handleSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link href="/latest">
            <p className="text-amber-400 mx-4 text-lg font-semibold">Latest</p>
          </Link>
          {session && (
            <>
              <Link href="/upload">
                <p className="text-amber-400 mx-4 text-lg font-semibold">
                  Upload
                </p>
              </Link>

              <Link href={`/${user.username}`}>
                <p className="text-amber-400 mx-4 text-lg font-semibold">
                  Profile
                </p>
              </Link>

              <Link href="/settings">
                <p className="text-amber-400 mx-4 text-lg font-semibold">
                  Settings
                </p>
              </Link>

              <p
                onClick={() => signOut()}
                className="text-amber-400 mx-4 text-lg font-semibold cursor-pointer"
              >
                Sign Out
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
