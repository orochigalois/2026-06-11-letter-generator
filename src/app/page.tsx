"use client";

import { useEffect, useState } from "react";
import TextEditor from "@/components/Editor/TextEditor";
import FontPicker from "@/components/Editor/FontPicker";
import BackgroundPicker from "@/components/Editor/BackgroundPicker";
import SettingsControls from "@/components/Editor/SettingsControls";
import PaginationControls from "@/components/Editor/PaginationControls";
import LetterPreview from "@/components/Preview/LetterPreview";
import ExportBar from "@/components/ExportBar";

export default function Home() {
  // Gate rendering until mounted so persisted (localStorage) state doesn't
  // cause a server/client hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-screen flex-col bg-neutral-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white px-5 py-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-800">
            信笺生成器{" "}
            <span className="font-normal text-neutral-400">
              · Letter Generator
            </span>
          </h1>
          <p className="text-xs text-neutral-500">
            写信 → 选信纸与字体 → 预览 → 导出 PNG（长信自动分页）
          </p>
        </div>
        <ExportBar />
      </header>

      {!mounted ? (
        <div className="flex flex-1 items-center justify-center text-neutral-400">
          加载中 / Loading…
        </div>
      ) : (
        <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          {/* Controls pane */}
          <aside className="thin-scroll w-full shrink-0 space-y-6 overflow-auto border-b border-neutral-200 bg-white p-5 lg:w-[380px] lg:border-b-0 lg:border-r">
            <TextEditor />
            <FontPicker />
            <BackgroundPicker />
            <SettingsControls />
            <PaginationControls />
          </aside>

          {/* Preview pane */}
          <div className="min-h-0 flex-1">
            <LetterPreview />
          </div>
        </main>
      )}
    </div>
  );
}
