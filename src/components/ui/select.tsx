import * as React from "react"
import { ChevronDown } from "lucide-react"
import { createPortal } from "react-dom"

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

const useSelect = () => {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select")
  }
  return context
}

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  required?: boolean
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value: controlledValue, defaultValue, onValueChange, required, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(controlledValue || defaultValue || "")
    const [open, setOpen] = React.useState(false)
    const value = controlledValue ?? internalValue

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
      setOpen(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen)
    }

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue)
      }
    }, [controlledValue])

    return (
      <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, onOpenChange: handleOpenChange }}>
        <div ref={ref} className="relative" {...props} />
      </SelectContext.Provider>
    )
  }
)
Select.displayName = "Select"

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useSelect()

    return (
      <button
        ref={ref}
        className={`flex h-10 w-full items-center justify-between rounded-md border-2 border-gray-300 bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:border-gray-400 ${
          className || ""
        }`}
        onClick={() => onOpenChange(!open)}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = useSelect()
  return <span>{value || placeholder}</span>
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, ...props }, ref) => {
    const { open, onOpenChange } = useSelect()

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
          className={`absolute z-50 w-full max-h-96 overflow-y-auto rounded-md border-2 border-gray-300 bg-white shadow-md ${
            className || ""
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px"
          }}
          {...props}
        />
      </>
    )
  }
)
SelectContent.displayName = "SelectContent"

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelect()
    const isSelected = selectedValue === value

    return (
      <button
        ref={ref}
        onClick={() => onValueChange(value)}
        className={`w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 transition-colors ${
          isSelected ? "bg-gray-100 font-semibold text-blue-600" : ""
        }`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
