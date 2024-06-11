import React from "react";
import Link from "next/link";
import Image from "next/image";

const NavBarLink = ({ activePage }: { activePage: string }) => {
  const links = [
    { href: "/home", label: "Your Feed" },
    { href: "/MostUpvoted", label: "Most Upvoted" },
    { href: "/MostDiscussed", label: "Most Discussed" },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mx-auto w-full flex justify-center items-center">
      <ul className="flex flex-wrap -mb-px text-sm max-sm:text-xs font-medium text-center text-gray-500 dark:text-gray-400">
        {links.map((link, index) => (
          <li className="me-2" key={index}>
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex items-center justify-center p-4 max-sm:px-2 pb-2 border-b-2 rounded-t-lg group ${
                activePage == link.href
                  ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500"
                  : " border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavBarLink;
