"use client";

import React, { useState } from "react";
import { useCompletion } from "ai/react";

export default function Page() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
  } = useCompletion({
    api: "/api/pop",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    console.log("Form submitted with input:", input);
    originalHandleSubmit(e);
  };

  return (
    <div>
      ssrsrsr
      <form
        onSubmit={handleSubmit}
        className="border-4 border-black bg-red-500 "
      >
        <input value={input} onChange={handleInputChange} />
      </form>
      {isSubmitted && <p>Form submitted!</p>}
      {completion}
    </div>
  );
}
