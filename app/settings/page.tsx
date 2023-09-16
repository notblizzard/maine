"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import ReactCropper from "react-cropper";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type User = {
  id: string;
  username: string;
  description?: string;
  birthday: Date;
  avatar?: string;
};

export default function Settings() {
  const [user, setUser] = useState<User>(null!);
  const [avatar, setAvatar] = useState("");
  const [cropper, setCropper] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const cropperRef = useRef<ReactCropperElement>(null);
  const { data: session } = useSession();

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (typeof cropper !== "undefined") {
      setCropper(cropper?.getCroppedCanvas().toDataURL());
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsOpen(true);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    }
  }, [session]);

  const handleSubmit = () => {
    const form = new FormData();
    if (cropper) form.append("avatar", cropper);
    form.append("username", user.username);
    form.append("birthday", user.birthday.toString());
    if (user.description) form.append("description", user.description);

    fetch("/api/user", {
      method: "POST",
      body: form,
    });
  };

  return (
    <>
      {user && session && (
        <div className="flex flex-col justify-center items-center p-24">
          <div className="w-4/6">
            <p className="font-bold text-4xl">Settings</p>
            {avatar && (
              <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Avatar</DialogTitle>
                    <DialogDescription>
                      Crop your avatar to your liking
                    </DialogDescription>
                  </DialogHeader>
                  <Cropper
                    src={avatar}
                    style={{ height: 400, width: "100%" }}
                    initialAspectRatio={1}
                    aspectRatio={1}
                    guides={true}
                    ref={cropperRef}
                    crop={onCrop}
                    movable={false}
                    rotatable={false}
                    scalable={false}
                  />
                  <Button
                    className="mt-4 bg-sky-500 p-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Save
                  </Button>
                </DialogContent>
              </Dialog>
            )}
            <label htmlFor="profile">
              {cropper && !isOpen ? (
                <>
                  <Image
                    src={cropper}
                    alt={user.username}
                    width={100}
                    height={100}
                    className="m-2 cursor-pointer  rounded-full border-2 border-solid border-slate-950"
                  />
                  <div className="relative"></div>
                </>
              ) : (
                <>
                  <Image
                    src={`https://cdn.notblizzard.dev/maine/avatars/${user.avatar}.png`}
                    alt={user.username}
                    width={100}
                    height={100}
                    className="m-2 cursor-pointer  rounded-full border-2 border-solid border-slate-950"
                  />

                  <div className="relative"></div>
                </>
              )}
            </label>
            <input
              id="profile"
              type="file"
              name="profile"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleProfileChange}
              className="hidden w-full cursor-pointer border border-gray-700 bg-gray-50 file:border file:border-none file:bg-gray-800 file:text-white dark:bg-gray-700"
            />
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              id="username"
              placeholder="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Description"
              value={user.description}
              onChange={(e) =>
                setUser({ ...user, description: e.target.value })
              }
            />
            <div className="flex flex-col">
              <Label htmlFor="birthday">Birthday</Label>
              <DatePicker
                selected={new Date(user.birthday)}
                onChange={(date) => setUser({ ...user, birthday: date! })}
                className="text-black"
              />
            </div>

            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      )}
    </>
  );
}
