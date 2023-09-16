"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

type Post = {
  id: string;
  image: string;
};
export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex max-h-screen flex-col items-center justify-center p-24">
      <p className="text-9xl font-bold text-center">Maine</p>
      {session ? (
        <Button onClick={() => signOut()}>Sign Out</Button>
      ) : (
        <Button onClick={() => signIn()}>Sign In</Button>
      )}
    </main>
  );
}
