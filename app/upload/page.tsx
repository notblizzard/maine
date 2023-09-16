"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Post = {
  title: string;
  description: string;
  image: File;
  tags: string[];
  rating: string;
};

export default function Upload() {
  const router = useRouter();
  const [post, setPost] = useState<Post>({
    title: "",
    description: "",
    image: null!,
    tags: [],
    rating: "MATURE",
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("description", post.description);
    formData.append("image", post.image);
    formData.append("tags", JSON.stringify(post.tags));
    formData.append("rating", post.rating);

    fetch("/api/post", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => router.push(`/post/${data.post.id}`));
  };

  return (
    <div className="flex flex-col justify-center items-center p-24">
      <h1>Upload</h1>
      <div className="flex flex-col w-4/6">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />

        <Label htmlFor="Description">Description</Label>
        <Textarea
          id="title"
          value={post.description}
          onChange={(e) => setPost({ ...post, description: e.target.value })}
        />

        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          onChange={(e) => {
            if (!e.target.files) return;
            setPost({
              ...post,
              image: e.target.files[0],
            });
          }}
        />

        <Label htmlFor="rating">Rating</Label>
        <Select
          defaultValue="MATURE"
          onValueChange={(value) => setPost({ ...post, rating: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GENERAL">GENERAL</SelectItem>
            <SelectItem value="MATURE">MATURE</SelectItem>
            <SelectItem value="EXPLICIT">EXPLICIT</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="tags">Tags</Label>
        <TagsInput
          value={post.tags}
          onChange={(tags) => setPost({ ...post, tags })}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}
