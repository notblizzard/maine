"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import bg from "../public/mercedes-mehling-7I9aCavB8RI-unsplash.jpg";

type Post = {
  id: string;
  image: string;
};
export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src={bg}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        alt="maine bg"
        className="object-cover"
      />
      <div className="z-10 flex flex-col items-center justify-center">
        {" "}
        <p className="text-9xl font-bold text-center drop-shadow">Maine</p>
        {session ? (
          <Button onClick={() => signOut()}>Sign Out</Button>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </div>
    </main>
  );
}
