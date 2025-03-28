"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

type ApiResponse = {
  message: string;
  error?: string;
};

type ProfileStatus = "loading" | "creating" | "success" | "error";

export default function CreateProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState<ProfileStatus>("loading");
  const [message, setMessage] = useState<string>("");

  // Define the mutation to create a profile
  const { mutate, isPending } = useMutation<ApiResponse, Error>({
    mutationFn: async () => {
      setStatus("creating");
      setMessage("Setting up your profile...");
      
      const res = await fetch("/api/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to create profile");
      }
      
      const data = await res.json();
      return data as ApiResponse;
    },
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message || "Profile created successfully!");
      console.log("Profile created:", data.message);
      
      // Redirect to subscription page after 2 seconds
      setTimeout(() => {
        router.push("/subscribe");
      }, 2000);
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
      console.error("Error creating profile:", error);
      
      // Redirect to home page after 3 seconds if error
      setTimeout(() => {
        router.push("/");
      }, 3000);
    },
  });

  useEffect(() => {
    // Only trigger the mutation if the user is signed in and we're not already processing
    if (isLoaded && isSignedIn && !isPending && status === "loading") {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border animate-fade-in">
        <div className="flex flex-col items-center text-center">
          {status === "loading" || status === "creating" ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          ) : status === "success" ? (
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
          )}
          
          <h1 className="text-2xl font-bold mb-2">
            {status === "loading" ? "Preparing Your Account" : 
             status === "creating" ? "Creating Your Profile" :
             status === "success" ? "Profile Created!" : 
             "Something Went Wrong"}
          </h1>
          
          <p className="text-muted-foreground mb-4">{message}</p>
          
          {status === "success" && (
            <p className="text-sm text-muted-foreground">
              Redirecting to subscription page...
            </p>
          )}
          
          {status === "error" && (
            <p className="text-sm text-muted-foreground">
              Redirecting to home page...
            </p>
          )}
          
          {isLoaded && isSignedIn && user && (
            <div className="mt-4 text-sm text-muted-foreground">
              Signed in as: {user.primaryEmailAddress?.emailAddress}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}