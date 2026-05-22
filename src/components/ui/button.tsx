import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none"

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200",
      outline: "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200",
      ghost: "hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 transition-colors duration-200",
      link: "text-blue-600 underline-offset-4 hover:underline active:opacity-75 transition-opacity duration-200",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`

    if (asChild) {
      const { children, ...restProps } = props
      return React.cloneElement(props.children as React.ReactElement, {
        className: buttonClass,
        ...restProps,
      } as any)
    }

    return (
      <button ref={ref} className={buttonClass} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button }
