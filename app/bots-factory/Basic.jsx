"use client";

import { useState } from "react";
import ImageInput from "./ImageInput";

export default function Basic({
  name,
  setName,
  description,
  setDescription,
  coverImage,
  setCoverImage,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* — Name Field — */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-lg text-bl">nameYourBot</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="enterBotName"
          className="
            w-full
            bg-[rgba(20,24,25,0.6)]
            backdrop-blur-sm
            border
            border-white/10
            rounded-xl
            px-4 py-3
            text-bl
            placeholder:text-gr
            outline-none
            focus:ring-2
            focus:ring-root-green
            transition
          "
        />
      </div>

      {/* — Description Field — */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-lg text-bl">description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="enterSomeDescription"
          className="
            w-full
            h-28
            resize-none
            bg-[rgba(20,24,25,0.6)]
            backdrop-blur-sm
            border
            border-white/10
            rounded-xl
            px-4 py-3
            text-bl
            placeholder:text-gr
            outline-none
            focus:ring-2
            focus:ring-root-green
            transition
          "
        />
      </div>

      {/* — Avatar / Cover Image — */}
      <div className="flex flex-col gap-2">
        <ImageInput coverImage={coverImage} setCoverImage={setCoverImage} />
      </div>
    </div>
  );
}
