import { SignUp as ClerkSignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto flex flex-col justify-center items-center bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6 animate-float">
            <Image 
              src="/logo.png" 
              alt="Meal Planner Logo" 
              width={80} 
              height={80} 
              className="rounded-full shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Create Your Account</h1>
          <p className="mt-2 text-muted-foreground animate-fade-in animate-delay-150">
            Start your personalized meal planning journey
          </p>
        </div>
        
        <div className="bg-card rounded-lg border shadow-lg p-6 animate-slide-in-up card-hover glass-morphism">
          <ClerkSignUp signInUrl="/sign-in" redirectUrl="/create-profile" />
          
          <div className="mt-8 text-center text-sm animate-fade-in animate-delay-300">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center animate-fade-in animate-delay-500">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
 
export default SignUp;