
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { useEffect } from "react"
import { useToastPreferences } from "@/hooks/useToastPreferences"
import { setToastPreferences } from "@/utils/toast-handlers"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const { preferences } = useToastPreferences()

  // Update toast handlers with current preferences
  useEffect(() => {
    setToastPreferences(preferences);
  }, [preferences]);

  if (!preferences.showToasts) {
    return null;
  }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={false}
      richColors
      closeButton
      duration={preferences.duration}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:mt-14",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          marginTop: '60px', // Avoid overlapping with navigation
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
