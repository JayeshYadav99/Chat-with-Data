import { SignInButton,SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <div>
      <nav className=" w-full border-b ">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">Chat with Docs</div>
          <nav className="space-x-6">
            <Link href="#home" className="text-gray-700 hover:text-blue-500">Home</Link>
            <Link href="#features" className="text-gray-700 hover:text-blue-500">Features</Link>
            <Link href="#pricing" className="text-gray-700 hover:text-blue-500">Pricing</Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-500">About</Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
            
          </nav>
          <div className="flex w-32 justify-end gap-5">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            {/* <MobileNav /> */}
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
            
          </SignedOut>
        </div>
    
        </div>
      </header>
 
      </nav>
    </div>
  );
};

export default Navbar;
