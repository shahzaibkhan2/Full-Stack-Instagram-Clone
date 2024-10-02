import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/hooks/useAuth/useAuthContext";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const { usernameRef, emailRef, passwordRef, authSubmitHandler, authLoading } =
    useAuthContext();
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        onSubmit={(event) => {
          authSubmitHandler(event, "Signup");
          navigate("/auth/login");
        }}
        className="flex flex-col shadow-lg p-8 gap-5"
      >
        <div className="my-4">
          <h1 className="font-bold text-2xl text-center">Logo</h1>
          <p className="text-md text-[#737373] text-center mt-2 max-w-80">
            Sign up to explore more about your friends and family
          </p>
        </div>
        <div>
          <Label className="font-medium text-md">Username</Label>
          <Input
            placeholder="Enter your username"
            ref={usernameRef}
            name="username"
            type="text"
            className="my-2 focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="font-medium text-md">Email</Label>
          <Input
            placeholder="Enter your email"
            ref={emailRef}
            name="email"
            type="text"
            className="my-2 focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="font-medium text-md">Password</Label>
          <Input
            placeholder="Enter your password"
            ref={passwordRef}
            name="password"
            type="text"
            className="my-2 focus-visible:ring-transparent"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Checkbox className="mb-4" />
          <p className="text-sm text-[#737373] max-w-72 leading-5">
            By clicking, you agree to the terms and privacy policy of Postagram
          </p>
        </div>
        {authLoading ? (
          <Button>
            <Loader2 className="size-5 animate-spin mr-2" />
            Signing in
          </Button>
        ) : (
          <Button type="submit">Sign up</Button>
        )}
        <span className="text-center">
          Already have an account ?{" "}
          <Link to="/auth/login" className="text-blue-500">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
