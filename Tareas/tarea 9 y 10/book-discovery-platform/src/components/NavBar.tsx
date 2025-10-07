"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";

const links = [
  { href: "/", label: "Buscar" },
  { href: "/favorites", label: "Favoritos" },
  { href: "/profile", label: "Perfil" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-neutral-200 border-b border-neutral-800 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-200">
          BookApp
        </Link>
        <ul className="flex gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>
                <Button
                  variant={pathname === href ? "primary" : "nav"}
                  size="sm"
                  className={
                    pathname === href ? "bg-blue-600 text-white" : ""
                  }
                >
                  {label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
