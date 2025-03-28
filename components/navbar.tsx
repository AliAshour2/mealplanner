"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isLoaded, user, isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="logo"
              className="rounded-full"
            />
            <span className="ml-2 text-xl font-semibold text-gray-800">
              Meal Planner
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <SignedIn>
              <Link
                href="/mealplan"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Meal Plan
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Profile
              </Link>
              <Link
                href="/subscribe"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Subscribe
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                {user?.imageUrl ? (
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="focus:outline-none"
                  >
                    <Image
                      src={user.imageUrl}
                      width={40}
                      height={40}
                      alt="profile"
                      className="rounded-full cursor-pointer"
                    />
                  </button>
                ) : (
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Profile
                  </Link>
                )}

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <SignOutButton>
                      <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                )}
              </div>
            </SignedIn>

            <SignedOut>
              <Link
                href={isSignedIn ? "/subscribe" : "sign-up"}
                className="text-gray-700 hover:text-gray-900"
              >
                Subscribe
              </Link>
              <Link
                href="/sign-in"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="block text-white py-2 bg-green-600 hover:bg-green-700 px-3 rounded btn-bounce"
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="px-4 py-3 space-y-2">
            <SignedIn>
              <Link
                href="/mealplan"
                className="block text-gray-700 py-2 hover:bg-gray-100 px-3 rounded"
              >
                Meal Plan
              </Link>
              <Link
                href="/profile"
                className="block text-gray-700 py-2 hover:bg-gray-100 px-3 rounded"
              >
                Profile
              </Link>
              <Link
                href="/subscribe"
                className="block text-gray-700 py-2 hover:bg-gray-100 px-3 rounded"
              >
                Subscribe
              </Link>
              <SignOutButton>
                <button className="w-full text-left text-red-600 py-2 px-3 hover:bg-gray-100">
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <Link
                href="/"
                className="block text-gray-700 py-2 hover:bg-gray-100 px-3 rounded"
              >
                Home
              </Link>
              <Link
                href={isSignedIn ? "/subscribe" : "sign-up"}
                className="block text-gray-700 py-2 hover:bg-gray-100 px-3 rounded"
              >
                Subscribe
              </Link>
              <Link
                href="/sign-in"
                className="block text-gray-700 py-2 hover:bg-gray-100 px-3 rounded"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="block text-white py-2 bg-green-600 hover:bg-green-700 px-3 rounded"
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
