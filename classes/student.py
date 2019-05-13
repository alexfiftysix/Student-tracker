from datetime import datetime
import enum


class Student:
    name: str = ''
    lesson_day: datetime.day = None
    lesson_time: datetime.time = None
    address: str = ''
    price: float = None
