import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const normalizedValue = Math.min(Math.max(value, 0), 100)
    
    return (
      <div
        ref={ref}
        className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className || ""}`}
        {...props}
      >
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
