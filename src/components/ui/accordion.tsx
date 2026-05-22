import * as React from "react"
import { ChevronDown } from "lucide-react"

interface AccordionContextValue {
  value: string
  onValueChange: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

const useAccordionContext = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion")
  }
  return context
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  collapsible?: boolean
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      value,
      defaultValue,
      onValueChange,
      collapsible = true,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const controlledValue = value ?? internalValue

    const handleValueChange = (newValue: string) => {
      if (type === "single") {
        const nextValue = collapsible && controlledValue === newValue ? "" : newValue
        setInternalValue(nextValue)
        onValueChange?.(nextValue)
      }
    }

    return (
      <AccordionContext.Provider value={{ value: controlledValue as string, onValueChange: handleValueChange }}>
        <div ref={ref} className={className || "w-full"} {...props} />
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={`border-b border-border ${className || ""}`}
      {...props}
    />
  )
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, value, "data-value": dataValue, onClick, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useAccordionContext()
    const itemValue = value || dataValue || ""
    const isOpen = selectedValue === itemValue

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onValueChange(itemValue)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`flex w-full items-center justify-between py-4 px-2 font-medium transition-all hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-ring ${
          className || ""
        }`}
        {...props}
      >
        <span className="flex-1 text-left">{children}</span>
        <ChevronDown 
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, value, "data-value": dataValue, ...props }, ref) => {
    const { value: selectedValue } = useAccordionContext()
    const itemValue = value || dataValue || ""
    const isOpen = selectedValue === itemValue

    return (
      <>
        {isOpen && (
          <div
            ref={ref}
            className={`overflow-hidden py-0 pb-4 px-2 text-sm transition-all ${className || ""}`}
            {...props}
          />
        )}
      </>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
