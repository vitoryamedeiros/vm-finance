import Link from "next/link";
import { UserRound } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white">
      <div className="container mx-auto flex h-24 items-center justify-between px-6 md:px-12 text-black">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo element resembling reference */}
          <div className="bg-black text-white font-heading text-5xl leading-none px-4 py-1 flex items-center justify-center -skew-x-12 border-l-8 border-primary">
            VM.
          </div>
          <span className="sr-only">VM Finance</span>
        </Link>
        <nav className="flex items-center gap-8 text-black font-bold uppercase tracking-tighter text-xl">
          <Link href="/dashboard" className="hover:text-primary transition-all hover:scale-105">
            DASHBOARD
          </Link>
          <div className="flex items-center justify-center w-14 h-14 border-4 border-black bg-black text-white hover:bg-primary transition-all cursor-pointer shadow-[6px_6px_0_0_#000] rounded-none hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
            <UserRound strokeWidth={2.5} size={28} />
          </div>
        </nav>
      </div>
    </header>
  );
}
