import Link from "next/link";
import { UserRound } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-foreground bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo element resembling reference */}
          <div className="bg-foreground text-white font-heading text-4xl leading-none px-3 py-1 flex items-center justify-center -skew-x-12">
            VM.
          </div>
          <span className="sr-only">VM Finance</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="font-heading uppercase text-lg hover:text-primary transition-colors">
            Dashboard
          </Link>
          <div className="flex items-center justify-center w-12 h-12 border-4 border-foreground rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer">
            <UserRound strokeWidth={2.5} size={24} />
          </div>
        </nav>
      </div>
    </header>
  );
}
