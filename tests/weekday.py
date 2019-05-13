import unittest
import datetime
from main import next_weekday


class TestWeekday(unittest.TestCase):
    def test_monday(self):
        now = datetime.datetime(year=2019, month=5, day=1)
        self.assertEqual(datetime.datetime(2019, 5, 6), next_weekday(now, 'mon'))
        self.assertEqual(datetime.datetime(2019, 5, 7), next_weekday(now, 'tues'))
        self.assertEqual(datetime.datetime(2019, 5, 8), next_weekday(now, 'wed'))
        self.assertEqual(datetime.datetime(2019, 5, 2), next_weekday(now, 'thurs'))
        self.assertEqual(datetime.datetime(2019, 5, 3), next_weekday(now, 'fri'))
        self.assertEqual(datetime.datetime(2019, 5, 4), next_weekday(now, 'sat'))
        self.assertEqual(datetime.datetime(2019, 5, 5), next_weekday(now, 'sun'))

        self.assertEqual(datetime.datetime(2019, 5, 6), next_weekday(now, 'monday'))
        self.assertEqual(datetime.datetime(2019, 5, 7), next_weekday(now, 'tuesday'))
        self.assertEqual(datetime.datetime(2019, 5, 8), next_weekday(now, 'wednesday'))
        self.assertEqual(datetime.datetime(2019, 5, 2), next_weekday(now, 'thursday'))
        self.assertEqual(datetime.datetime(2019, 5, 3), next_weekday(now, 'friday'))
        self.assertEqual(datetime.datetime(2019, 5, 4), next_weekday(now, 'saturday'))
        self.assertEqual(datetime.datetime(2019, 5, 5), next_weekday(now, 'sunday'))

        self.assertEqual(None, next_weekday(now, 'blurnsday'))
