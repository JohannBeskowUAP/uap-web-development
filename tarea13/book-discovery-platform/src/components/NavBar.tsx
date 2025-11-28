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
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-3">
        {/* Centered buttons with larger spacing */}
        <ul className="flex justify-center items-center list-none p-0 m-0">
          {links.map(({ href, label }) => (
            <li key={href} className="mx-8"> {/* Increased spacing here */}
              <Link href={href}>
                <Button
                  variant={pathname === href ? "primary" : "nav"}
                  size="sm"
                  className={`${
                    pathname === href
                      ? "bg-blue-600 text-white"
                      : "text-neutral-800 hover:bg-neutral-300"
                  }`}
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
