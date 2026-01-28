import { Link, Outlet } from "react-router";
import logo from "@/assets/logo2.png";
import defaultAvatar from "@/assets/default-avatar.png";
import { SunIcon } from "lucide-react";
import ProfileButton from "@/components/layout/header/profile-button";
import ThemeButton from "@/components/layout/header/theme-button";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <header className="h-15 border-b">
        <div className="m-auto flex h-full w-full max-w-175 justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="React SNS 로고"
              className="h-6 w-6"
            />
            <span
              className="
                text-[15px]
                font-semibold
                tracking-tight
                text-slate-800
                dark:text-slate-100
              "
            >
              React SNS
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <ThemeButton />
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-muted-foreground border-t py-10 text-center">
        @KIM YE EUN
      </footer>
    </div>
  );
}
