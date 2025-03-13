import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(1, "Full name is required"),
  church: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthForm() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const { loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
      church: "",
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };
  
  return (
    <Tabs 
      defaultValue="login" 
      value={tab} 
      onValueChange={(value) => setTab(value as "login" | "register")}
      className="w-full max-w-md"
    >
      <Card className="w-full border-0 bg-transparent shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-merriweather text-center mb-3 text-white">
            Welcome to <span className="text-amber-600">DailyCross.com</span>
          </CardTitle>
          <CardDescription className="text-center text-gray-400 text-base mb-5">
            {tab === "login" ? "Sign in to access your account" : "Join the DailyCross.com community today"}
          </CardDescription>
          <TabsList className="grid grid-cols-2 w-full bg-gray-800/70 border border-gray-700">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Register
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="px-0">
          <TabsContent value="login" className="mt-0">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          className="bg-gray-800/60 border-gray-700 text-white focus:border-amber-600/80 focus:ring-amber-600/10 h-11" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="bg-gray-800/60 border-gray-700 text-white focus:border-amber-600/80 focus:ring-amber-600/10 h-11" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 transition-colors h-12 mt-6 text-white font-semibold"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username" 
                          className="bg-gray-800/60 border-gray-700 text-white focus:border-amber-600/80 focus:ring-amber-600/10 h-11" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="bg-gray-800/60 border-gray-700 text-white focus:border-amber-600/80 focus:ring-amber-600/10 h-11" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="church"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Church (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your church name" 
                          className="bg-gray-800/60 border-gray-700 text-white focus:border-amber-600/80 focus:ring-amber-600/10 h-11" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Choose a secure password" 
                          className="bg-gray-800/60 border-gray-700 text-white focus:border-amber-600/80 focus:ring-amber-600/10 h-11" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-amber-500" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 transition-colors h-12 mt-6 text-white font-semibold"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
