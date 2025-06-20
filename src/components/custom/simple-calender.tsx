import { useState } from "react"
import { Calendar } from "../ui/calendar"
import { useNavigate } from "react-router-dom"

export default function SimpleShadcnCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const navigate = useNavigate()
  const today = new Date()

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || date > today) return

    setSelectedDate(date)
    navigate(`/date/${formatDate(date)}`)  //we will render the data on this route
  }

  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        disabled={(d:Date) => d > today}
        captionLayout="dropdown"
        toYear={today.getFullYear()}
        defaultMonth={today}
        className="rounded-md border shadow-sm"
      />
    </div>
  )
}
