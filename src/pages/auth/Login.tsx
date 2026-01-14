import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "../../store/useAuthStore";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const loggedInUser = await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      
      {/* LEFT BRAND SECTION */}
      <div className="hidden lg:flex flex-col justify-center px-16 text-white">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-lg text-white/80 max-w-md">
          Sign in to continue accessing your dashboard, manage your workflow,
          and stay productive.
        </p>

        <div className="mt-10 flex items-center gap-4 text-sm text-white/70">
          <div className="h-px w-12 bg-white/40" />
          Secure • Fast • Reliable
        </div>
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl border-0 rounded-2xl animate-scale-in">
          <CardHeader className="space-y-2 text-center pb-2">
            <CardTitle className="text-3xl font-bold">
              Sign In
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 rounded-xl focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-11 rounded-xl pr-12 focus:ring-2 focus:ring-primary/30"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-base font-medium shadow-lg hover:shadow-xl transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don’t have an account?
              </span>{" "}
              <Link
                to="/get-started"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
