import * as React from "react"

interface PopoverContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

const usePopover = () => {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("Popover components must be used within a Popover")
  }
  return context
}

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Popover = ({ open: controlledOpen, onOpenChange, children }: PopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = controlledOpen ?? internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <PopoverContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ onClick, asChild, children, ...props }, ref) => {
    const { open, onOpenChange } = usePopover()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(!open)
      onClick?.(e)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        onClick: handleClick,
      } as any)
    }

    return (
      <button ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)
PopoverTrigger.displayName = "PopoverTrigger"

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", ...props }, ref) => {
    const { open, onOpenChange } = usePopover()

    if (!open) return null

    return (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => onOpenChange(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <div
          ref={ref}
          className={`absolute z-50 w-72 rounded-md border-2 border-gray-300 bg-white p-4 shadow-lg ${
            align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2"
          } ${className || ""}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            zIndex: 50,
            top: "100%",
            marginTop: "8px"
          }}
          {...props}
        />
      </>
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
}
