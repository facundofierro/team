export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const validDate = (dateString: string) =>
  !isNaN(new Date(dateString).getTime())

export const getWeekOfYear = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const firstMondayOfTheYear = new Date(
    date.getFullYear(),
    0,
    1 + ((8 - firstDayOfYear.getDay()) % 7)
  )
  const pastDaysOfYear =
    (date.valueOf() - firstMondayOfTheYear.valueOf()) / 86400000
  return Math.ceil((pastDaysOfYear + firstMondayOfTheYear.getDay() + 1) / 7)
}

export const getWeekStart = (weekOfYear: number) => {
  const yearStart = new Date(new Date().getFullYear(), 0, 1)
  const firstMondayOfYear = new Date(
    yearStart.setDate(
      yearStart.getDate() + ((1 + 7 - yearStart.getDay()) % 7 || 7)
    )
  )
  const date = new Date(firstMondayOfYear)
  date.setDate(date.getDate() + (weekOfYear - 2) * 7)
  date.setHours(0, 0, 0, 0)
  return date
}

export const getWeekEnd = (weekOfYear: number) => {
  const date = getWeekStart(weekOfYear)
  date.setDate(date.getDate() + 6)
  return date
}

export type WeekInfo = {
  start: Date
  end: Date
  weekOfYear: number
  days: number[]
}

export const getWeekInfo = (weekOfYear: number): WeekInfo => {
  const start = getWeekStart(weekOfYear)
  const end = getWeekEnd(weekOfYear)
  const monday = start.getDate()
  const tuesday = new Date(start.valueOf() + 86400000).getDate()
  const wednesday = new Date(start.valueOf() + 86400000 * 2).getDate()
  const thursday = new Date(start.valueOf() + 86400000 * 3).getDate()
  const friday = new Date(start.valueOf() + 86400000 * 4).getDate()
  const saturday = new Date(start.valueOf() + 86400000 * 5).getDate()
  const sunday = new Date(start.valueOf() + 86400000 * 6).getDate()
  const days = [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
  return { start, end, weekOfYear, days }
}
