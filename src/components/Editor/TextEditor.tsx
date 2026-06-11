"use client";

import { useLetterStore } from "@/store/useLetterStore";

export default function TextEditor() {
  const { title, body, setTitle, setBody } = useLetterStore();

  return (
    <section className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">
          称呼 / Salutation
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="亲爱的家人："
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">
          正文 / Body — 每个段落用一个换行分隔 (one newline per paragraph)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          placeholder="在这里输入或粘贴信件内容…"
          className="thin-scroll w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm leading-relaxed outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
        />
        <p className="mt-1 text-right text-xs text-neutral-400">
          {body.length} chars
        </p>
      </div>
    </section>
  );
}
