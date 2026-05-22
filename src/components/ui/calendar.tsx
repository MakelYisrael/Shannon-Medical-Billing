import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface CalendarProps {
  mode?: "single" | "multiple"
  selected?: Date | Date[]
  onSelect?: (date: Date | Date[] | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ mode = "single", selected, onSelect, disabled, initialFocus }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const days: (number | null)[] = []
    const firstDay = getFirstDayOfMonth(currentMonth)
    const daysInMonth = getDaysInMonth(currentMonth)

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    const handlePrevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const handleSelectDate = (day: number) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      if (mode === "single") {
        onSelect?.(date)
      }
    }

    const isDateSelected = (day: number) => {
      if (!selected || !day) return false
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      if (Array.isArray(selected)) {
        return selected.some((d) => d.toDateString() === date.toDateString())
      }
      return selected.toDateString() === date.toDateString()
    }

    const isDateDisabled = (day: number) => {
      if (!day) return false
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      return disabled?.(date) ?? false
    }

    return (
      <div ref={ref} className="w-full rounded-lg border-2 border-gray-300 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={handlePrevMonth} className="p-1 text-gray-700 hover:bg-gray-100 rounded" aria-label="Previous month" title="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={handleNextMonth} className="p-1 text-gray-700 hover:bg-gray-100 rounded" aria-label="Next month" title="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
          {days.map((day, i) => (
            <button
              key={i}
              disabled={!day || isDateDisabled(day)}
              onClick={() => day && handleSelectDate(day)}
              className={`py-2 text-sm font-medium ${
                !day
                  ? ""
                  : isDateDisabled(day)
                  ? "cursor-not-allowed opacity-50 text-gray-400"
                  : isDateSelected(day)
                  ? "rounded-md bg-blue-600 text-white font-semibold"
                  : "text-gray-900 hover:bg-blue-100 rounded-md"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
