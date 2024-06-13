import { SignInButton,SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

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
              <Image src="/assets/icons/logo.png" alt="Logo" width={170} height={40} />
              <div className="text-xl font-bold ml-3"></div>
            </div>

          <nav className="space-x-6">
            <Link href="#home" className="text-gray-700 hover:text-blue-500">Home</Link>
            <Link href="#features" className="text-gray-700 hover:text-blue-500">Features</Link>
            <Link href="#pricing" className="text-gray-700 hover:text-blue-500">Pricing</Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-500">About</Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
            
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
