"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, FolderKanban } from "lucide-react";

const Navbar = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-14 items-center">
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2">
              <FolderKanban className="h-6 w-6" />
              <span className="font-bold hidden sm:inline-block">
                ProjectManager
              </span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex">
          <Link href="/" className="flex items-center space-x-2">
            <FolderKanban className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">
              ProjectManager
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Dashboard
                </Button>
              </Link>

              <div className="hidden md:flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm truncate max-w-[120px]">
                  {session.user.name}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="flex items-center space-x-1 sm:space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
