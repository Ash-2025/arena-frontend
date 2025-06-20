import { AuthForms } from "@/components/custom/signup"
import { ThemeProvider } from "@/components/custom/theme-provider"

export function AuthLayout() {
  return (
    <ThemeProvider defaultTheme="dark">
      <main className="h-screen w-full flex items-center justify-center">
        <AuthForms />
      </main>
    </ThemeProvider>
  )
}

export default AuthLayout