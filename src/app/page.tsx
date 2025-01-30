"use client";

import { useState } from "react";
import { Loading } from "@/components/Loading";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const resetInput = () => {
    setInput("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const formData = new FormData(e.target as HTMLFormElement);
      const input = formData.get("input") as string;
      setMessages([...messages, { role: "user", content: input }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
        }),
      });
      const _response = await response.json();
      const content = _response.data.content;

      setMessages([
        ...messages,
        { role: "user", content: input },
        { role: "assistant", content },
      ]);
    } catch (error) {
      throw error;
    } finally {
      resetInput();
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="p-10">
        <h1 className="text-2xl font-bold text-center mb-8">Chatbot</h1>
        <div className="flex flex-col items-center w-full">
          <div className="px-10 flex flex-col gap-y-4">
            {messages.map((message, index) => (
              <div className="text-black" key={index}>
                {message.role === "user" ? "User: " : "AI: "}
                {message.content}
              </div>
            ))}
          </div>
          <form className="flex mt-4" onSubmit={handleSubmit}>
            <input
              className="border w-[300px] border-gray-300 rounded-md p-2"
              name="input"
              value={input}
              placeholder="質問を入力してください"
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="rounded-md bg-black py-2 px-3 text-white"
              type="submit"
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
