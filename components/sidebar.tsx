"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Share2, 
  Star, 
  Trash2,
  Upload,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500"
  },
  {
    label: "My Documents",
    icon: FileText,
    href: "/documents",
    color: "text-violet-500"
  },
  {
    label: "Shared",
    icon: Share2,
    href: "/shared",
    color: "text-pink-500"
  },
  {
    label: "Starred",
    icon: Star,
    href: "/starred",
    color: "text-orange-500"
  },
  {
    label: "Trash",
    icon: Trash2,
    href: "/trash",
    color: "text-red-500"
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <FolderOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold ml-2">DocHub</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition",
                pathname === route.href ? "bg-gray-100 dark:bg-gray-800" : "text-gray-600 dark:text-gray-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <ThemeToggle />
      </div>
    </div>
  );
}