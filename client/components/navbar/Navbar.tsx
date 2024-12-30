import { SignInButton,SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FileText, MessageCircle, Menu } from "lucide-react"

import { Button } from "../ui/button";

const Navbar = () => {
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-55 h-55", // Custom width and height
      userButtonPopoverCard: "bg-blue-100", // Custom background for the popover card
      userButtonPopoverActionButton: "text-red-600", // Custom text color for action buttons
    },
  };
  return (
    <div>
      <nav className=" w-full border-b ">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
        <Link href="/" className="flex items-center text-xl font-bold">
              <div className="relative mr-2">
              <FileText className="h-8 w-8 text-blue-500" strokeWidth={2} />
                <MessageCircle 
                  className="h-5 w-5 absolute -bottom-1 -right-1" 
                  fill="#10B981" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                />
              </div>
              <span className="text-foreground">Chat with <span className="text-primary">Data </span></span>
            </Link>
            </div>

          <nav className="space-x-6">
            <Link href="#home" className="text-gray-700 hover:text-blue-500">Home</Link>
            <Link href="#features" className="text-gray-700 hover:text-blue-500">Features</Link>

            <Link href="https://github.com/JayeshYadav99/Chat-with-Data" className="text-gray-700 hover:text-blue-500">About</Link>
            {/* <Link href="#contact" className="text-gray-700 hover:text-blue-500">Contact</Link> */}
            
          </nav>
          <div className="flex w-32 justify-end gap-5">
          <SignedIn>
            <UserButton afterSignOutUrl="/"  appearance={userButtonAppearance}  />
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
