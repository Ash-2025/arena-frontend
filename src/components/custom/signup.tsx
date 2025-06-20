"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, User, Camera } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { authClient } from "@/lib/auth-client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/UseAuth"

// Mock data for existing usernames and emails (in real app, this would be API calls)
const existingUsernames = ["john_doe", "jane_smith", "admin", "user123"]
const existingEmails = ["john@example.com", "jane@example.com", "admin@test.com"]

// Dummy avatar URLs
const avatarOptions = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
]

// const countries = [
//   "United States",
//   "Canada",
//   "United Kingdom",
//   "Germany",
//   "France",
//   "Australia",
//   "Japan",
//   "India",
//   "Brazil",
//   "Mexico",
// ]

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .refine((username) => !existingUsernames.includes(username.toLowerCase()), "Username is already taken"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email) => !existingEmails.includes(email.toLowerCase()), "Email is already registered"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be less than 16 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  avatar: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type SignUpFormData = z.infer<typeof signUpSchema>
type LoginFormData = z.infer<typeof loginSchema>

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  // get the set user from use auth hook
  const { setUser } = useAuth()

  const onSubmit = async (formdata: SignUpFormData) => {
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      await authClient.signUp.email({
        name: formdata.username,
        email: formdata.email,
        password: formdata.password,
        image: formdata.avatar,
      }, {
        onSuccess: (ctx) => {
          if (ctx.response.status === 200) {
            console.log("User created successfully:", ctx.data)
            setUser(ctx.data.user) // Set user in context
            navigate("/")
          }
        }
      })

      toast.success("Account created successfully!", {
        description: "Welcome to our platform.",
      })
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
  }

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl)
    setValue("avatar", avatarUrl)
    setIsAvatarModalOpen(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="Enter your username"
          className={errors.username ? "border-destructive" : ""}
        />
        {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
      </div>

      {/* Country Field */}
      {/* <div className="space-y-2">
        <Label htmlFor="country">Select your country</Label>
        <Select onValueChange={(value) => setValue("country", value)}>
          <SelectTrigger className={errors.country ? "border-destructive" : ""}>
            <SelectValue placeholder="Choose your country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-sm text-destructive">Select a Country</p>}
      </div> */}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password"
            className={errors.password ? "border-destructive pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      {/* Avatar Selection */}
      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex justify-center">
          <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
              >
                <Avatar className="w-20 h-20 border-2 border-dashed border-gray-300 group-hover:border-primary transition-colors">
                  <AvatarImage src={selectedAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-50">
                    <User className="w-8 h-8 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Choose Your Avatar</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 py-4">
                {avatarOptions.map((avatarUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAvatarSelect(avatarUrl)}
                    className={`relative rounded-full transition-all hover:scale-105 ${selectedAvatar === avatarUrl ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                  >
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" className="flex-1 bg-transparent">
          Reset
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Submit"}
        </Button>
      </div>
    </form>
  )
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      await authClient.signIn.email({
        email: data.email,
        password: data.password
      }, {
        onSuccess: (ctx) => {
          if (ctx.response.status === 200) {
            console.log("User created successfully:", ctx.data)
            setUser(ctx.data.user) // Set user in context
            navigate("/")
          }
        }
      })

      toast.success("Login successful!", {
        description: "Welcome back!",
      })
    } catch (error) {
      toast.error("Invalid credentials. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password"
            className={errors.password ? "border-destructive pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      {/* Form Buttons */}
      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" className="flex-1 bg-transparent" >
          Reset
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </form>
  )
}

function OAuthButtons() {

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL:"http://localhost:5173"
    });
    toast.info(`Signing in with Google`)
  };
  return (
    <>
      {/* OAuth Buttons */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={signIn} type="button" variant="outline" className="w-full bg-transparent">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent"
          // onClick={() => handleOAuth("twitter")}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Continue with X
        </Button>
      </div>
    </>
  )
}

export function AuthForms() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <LoginForm />
            <OAuthButtons />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <SignUpForm />
            <OAuthButtons />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
