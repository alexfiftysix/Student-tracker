import datetime
import unittest
from backend.main import Student, Teacher, Payment


class TestStudent(unittest.TestCase):
    def test_account(self):
        t = Teacher(id=1, public_id='asdf', email='asdf', name='asdf', password='asdf', standard_rate=float(0),
                    address='asdf')
        s = Student(id=1, teacher=t.id, name='asdf', lesson_day='Monday', lesson_time='12:34', lesson_length_minutes=30,
                    address='asdf', price=50, end_date=None)
        p1 = Payment(id=1, student=s.id, datetime=datetime.datetime.now(), amount=50)
        p2 = Payment(id=2, student=s.id, datetime=datetime.datetime.now(), amount=50)
        p3 = Payment(id=3, student=s.id, datetime=datetime.datetime.now(), amount=50)

        self.assertEqual(150, s.payment_total())
