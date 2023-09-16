"use client";

import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  description: string;
  posts: Post[];
};

type Post = {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: string;
  user: User;
};

export default function Gallery({ params }: { params: { slug: string } }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getData = useCallback(() => {
    fetch(`/api/gallery?username=${params.slug}&skip=${skip}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts([...posts.concat(data.posts)]);
        if (data.noMore) setHasMore(false);
        setSkip(skip + 1);
      });
  }, [params.slug, skip, posts]);

  useEffect(() => {
    getData();
  }, []);

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
      {posts && (
        <InfiniteScroll
          dataLength={posts.length}
          next={getData}
          hasMore={hasMore}
          loader={<div>Loading</div>}
        >
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 5 }}
          >
            <Masonry gutter={"1rem"} className="pr-4">
              {posts.map((post) => (
                <div
                  key={post.id.toString()}
                  className={`border-2 ${ratingBorder(post.rating)}`}
                >
                  <Link href={`/post/${post.id}`}>
                    <Image
                      src={`https://cdn.notblizzard.dev/maine/uploads/${post.image}.png`}
                      height={1000}
                      width={1000}
                      alt={post.image}
                    />
                  </Link>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </InfiniteScroll>
      )}
    </>
  );
}
