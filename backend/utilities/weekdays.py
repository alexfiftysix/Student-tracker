from datetime import datetime, date, timedelta

weekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

weekdays_abbreviated = {
    'sun': weekdays[0],
    'mon': weekdays[1],
    'tues': weekdays[2],
    'wed': weekdays[3],
    'thurs': weekdays[4],
    'fri': weekdays[5],
    'sat': weekdays[6],
}


def weekday_to_decimal(weekday: str) -> int:
    """
    Returns int of weekday. 0=sunday, 6=saturday
    returns -1 on invalid input
    """
    weekday = weekday.lower()
    if weekday.lower() in weekdays:
        return weekdays.index(weekday)
    if weekday in weekdays_abbreviated:
        return weekdays.index(weekdays_abbreviated[weekday])
    return -1


def next_weekday(current_date: datetime, weekday: str):
    """
    Given a date and a weekday, returns the next date which falls on that weekday.
    Returns none if weekday is not valid
    """
    weekday = weekday_to_decimal(weekday)
    if weekday == -1:
        return None
    weekday = weekday - 1 % 7  # Following uses monday=0

    days_ahead = weekday - current_date.weekday()
    if days_ahead <= 0:  # Target day already happened this week
        days_ahead += 7
    return current_date + timedelta(days_ahead)


def all_days_in_week(day: date):
    day_num = day.weekday() + 1 % 7
    first_sunday = day - timedelta(days=day_num)
    first_sunday = first_sunday.date()

    week = []
    for i in range(0, 7):
        week.append(first_sunday + timedelta(days=i))

    return week


def to_weekday(s: str):
    s = s.lower()

    if s in weekdays:
        return s.lower()
    elif s in weekdays_abbreviated.keys():
        return weekdays_abbreviated[s]
