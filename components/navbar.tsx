import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav>
      <div>
        <Link href="/">
          <Image src="/logo.png" width={60} height={60} alt="logo" />
        </Link>
      </div>

      <div>
        <ul>
          <li>
            <Link href="/mealplan">Meal Plan</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <Link href="/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link href="/subscribe">Subscribe</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
