"use client";

import { useState, useEffect } from "react";

type User = {
  username: string;
  description: string;
};
export default function Profile({ params }: { params: { slug: string } }) {
  const [user, setUser] = useState<User>(null!);

  useEffect(() => {
    fetch(`/api/profile?username=${params.slug}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, [params.slug]);

  return (
    <>
      {user && (
        <div className="flex flex-col justify-center items-center py-24 px-10">
          <div className="break-all">{user.description}</div>
        </div>
      )}
    </>
  );
}
