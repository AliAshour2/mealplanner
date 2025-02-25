import { SignUp as ClerkSignUp } from "@clerk/nextjs";

const SignUp = () => {
  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto flex justify-center align-center">
      <ClerkSignUp signInFallbackRedirectUrl={"/subscribe"} />
    </div>
  );
};
 
export default SignUp;