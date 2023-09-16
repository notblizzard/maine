"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type User = {
  avatar: string;
  username: string;
};

type Post = {
  title: string;
  description: string;
  image: string;
  user: User;
  tags: Tag[];
  comments: Comment[];
  rating: "GENERAL" | "MATURE" | "EXPLICIT";
};

type Tag = {
  tag: {
    id: string;
    name: string;
  };
};

type Comment = {
  id: string;
  text: string;
  user: User;
  post: Post;
  createdAt: Date;
};

export default function Post({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post>(null!);
  const [comment, setComment] = useState("");

  const router = useRouter();

  dayjs.extend(relativeTime);

  useEffect(() => {
    fetch(`/api/post?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post));
  }, [params.id]);

  const handleCommentSubmit = () => {
    fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({
        comment,
        id: params.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.comment) {
          router.refresh();
        }
      });
  };

  const ratingBorder = (rating: string) => {
    switch (rating) {
      case "GENERAL":
        return "border-green-500";
      case "MATURE":
        return "border-yellow-500";
      case "EXPLICIT":
        return "border-red-500";
    }
  };

  return (
    <>
      {post && (
        <div className="flex justify-center items-start py-24 px-10">
          <div className="grid grid-cols-12">
            <div className="col-span-10">
              <div className="flex flex-col">
                <div className={`border-4 ${ratingBorder(post.rating)}`}>
                  <Image
                    src={`https://cdn.notblizzard.dev/maine/uploads/${post.image}.png`}
                    height={2000}
                    width={2000}
                    alt={post.image}
                  />
                </div>
                <div className="grid grid-cols-12 mt-4 gap-4 bg-slate-900/80 p-4 min-h-min">
                  <div className="col-span-1">
                    <Image
                      src={`https://cdn.notblizzard.dev/maine/avatars/${post.user.avatar}.png`}
                      height={100}
                      width={100}
                      alt={post.user.avatar}
                    />
                  </div>
                  <div className="col-span-11">
                    <div className="flex flex-col justify-between h-full">
                      <p className="font-bold text-xl text-amber-400">
                        {post.title}
                      </p>
                      <p className="text-lg text-white">
                        By{" "}
                        <span className="font-bold">{post.user.username}</span>
                      </p>
                    </div>
                  </div>
                  <div className="col-span-12">{post.description}</div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-12">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="grid grid-cols-12 gap-4 mt-4 bg-slate-900/80 p-4 w-full"
                      >
                        <div className="col-span-1">
                          <Image
                            src={`https://cdn.notblizzard.dev/maine/avatars/${post.user.avatar}.png`}
                            height={100}
                            width={100}
                            alt={comment.user.avatar}
                          />
                        </div>
                        <div className="col-span-11">
                          <div className="flex flex-row justify-between">
                            <p className="font-bold text-xl text-amber-400">
                              {comment.user.username}
                            </p>
                            <p className=" text-emerald-400">
                              {dayjs().to(dayjs(comment.createdAt))}
                            </p>
                          </div>
                          <p className="text-lg text-white">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    <Textarea
                      placeholder="Comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleCommentSubmit} className="w-full">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex flex-wrap flex-none">
                {post.tags.map((tag) => (
                  <div
                    key={tag.tag.id}
                    className="text-slate-950 bg-emerald-400 max-w-fit p-1 m-1 "
                  >
                    {tag.tag.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
