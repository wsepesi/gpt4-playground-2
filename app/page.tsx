'use client';

import { UseChatOptions, useChat } from 'ai/react';

import { Message } from 'ai';

const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, handlingFunc: (e: React.ChangeEvent<HTMLTextAreaElement>) => void) => {
  // adjust the height of the textarea if we need to
  e.currentTarget.style.height = '6vh'
  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  handlingFunc(e);
}

const handleError = (e: Error) => {
  alert(e.message);
  console.error(e);
}

const handleResponse = (res: Response) => {
  if (!res.ok) {
    console.error(res, "error: response");
  } else {
    console.log("success: response", res);
  }
}

const handleFinish = (res: Message) => {
  console.log("finish: response", res);
}

const options: UseChatOptions = {
  onError(error) {
      handleError(error);
  },
  onResponse(res) {
      handleResponse(res);
  },
  onFinish(res) {
      handleFinish(res);
  },
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat(options);
  return (
    <div className="relative flex flex-col-reverse w-full max-w-md py-24 mx-auto overflow-auto h-[100vh]">
        {messages.length > 0
        ? [...messages].reverse().map(m => (
            <div key={m.id} className="whitespace-pre-wrap my-1">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
        : null}
      <form onSubmit={handleSubmit}>
        <textarea
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl overflow-auto resize-none h-[6vh] max-h-[25vh]"
          value={input}
          placeholder="Say something..."
          onChange={(e) => handleChange(e, handleInputChange)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const event = new Event('submit', {bubbles: true, cancelable: true});
              e.currentTarget.form!.dispatchEvent(event);
              e.currentTarget.style.height = '6vh'
            }
          }}
        />
      </form>
    </div>
  );
}
