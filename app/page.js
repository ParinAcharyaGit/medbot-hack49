import Image from "next/image";
import { Button } from "./components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <form className="flex flex-col">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="tel" placeholder="Phone Number (optional)" />
        <Button type="submit">Login</Button>
      </form>
      {/* Admin Login Section */}
      <div className="admin-login">
        <Button>Admin Login</Button>
      </div>
      {/* Get Started Button */}
      <div className="get-started">
        <Link href="/registration">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
