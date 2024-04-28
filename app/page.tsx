'use client'

import Greet from "./greet";
import { ConnectionDialog } from "../components/connect/ConnectionDialog";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Greet />
      <ConnectionDialog />
    </main>
  );
}
