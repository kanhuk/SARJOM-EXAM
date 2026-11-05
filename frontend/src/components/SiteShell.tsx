import React from "react";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return <main className="w-full min-h-screen bg-[#07090d]">{children}</main>;
}
