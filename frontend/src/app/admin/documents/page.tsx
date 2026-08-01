"use client";

import { AdminEmptyState } from "@/features/admin/components";
export default function Page() { return <section><h1 className="mb-8 text-3xl font-bold">Documents</h1><AdminEmptyState resource="document" onCreate={() => undefined} /></section>; }
