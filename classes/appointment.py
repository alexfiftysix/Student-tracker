from datetime import datetime
from .student import Student


class Appointment:
    student: Student = None
    attended: bool = False
    payed: bool = False
    date: datetime = None
