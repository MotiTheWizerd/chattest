import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Image
          src="/next.svg"
          alt="Logo"
          width={80}
          height={20}
          className="dark:invert"
        />
        <span className="font-semibold text-xl text-gray-800 dark:text-white">
          Chat
        </span>
      </div>
      <ThemeToggle />
    </header>
  );
}
