import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (isLogin) {
      if (email === "admin@example.com" && password === "admin") {
        toast({
          title: "Welcome back, Admin!",
          description: "Successfully logged in as administrator.",
        });
        navigate("/admin");
      } else if (email === "user@example.com" && password === "user") {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials. Please try again.",
        });
      }
    } else {
      toast({
        title: "Account created!",
        description: "Please log in with your new credentials.",
      });
      setIsLogin(true);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-gold-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full bg-gold-500 hover:bg-gold-600">
            {isLogin ? "Sign in" : "Create account"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-sm text-gold-700"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}