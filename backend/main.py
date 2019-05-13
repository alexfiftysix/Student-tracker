from flask import Flask, render_template, request
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, timedelta
import time
import json
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://root:password@localhost/student-tracker'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
api = Api(app)
db = SQLAlchemy(app)

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


class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(200), nullable=False)
    lesson_day = db.Column('lesson_day', db.String(10), nullable=False)
    lesson_time = db.Column('lesson_time', db.String(10), nullable=False)
    address = db.Column('address', db.String(200), nullable=False)
    price = db.Column('price', db.DECIMAL, nullable=False)

    def __repr__(self):
        return f'Student: {self.name}.  {self.lesson_day}. {self.lesson_time}. ${self.price}'

    def __str__(self):
        return self.__repr__()

    def json(self):
        student = {'id': self.id,
                   'name': self.name,
                   'lesson_day': self.lesson_day,
                   'lesson_time': str(self.lesson_time),
                   'address': self.address,
                   'price': str(self.price)}

        return student

    @staticmethod
    def delete(id: int):
        to_delete = Student.get(id)
        if to_delete is None:
            return {'message': 'student not found'}
        db.session.delete(to_delete)
        db.session.commit()
        return {'message': 'student deleted successfully'}

    @staticmethod
    def add(name, lesson_day, lesson_time, address, price):
        # TODO: error checking
        to_add = Student(name=name, lesson_day=lesson_day, lesson_time=lesson_time, address=address, price=price)
        db.session.add(to_add)
        db.session.commit()
        return to_add

    @staticmethod
    def get(id: int):
        found = Student.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
        if not found:
            return None
        # return found.json()
        return found

    class AllStudents(Resource):
        def get(self):
            students = []
            for student in Student.query.all():
                students.append(student.json())
            return {'students': students}

    class SingleStudent(Resource):
        def get(self, id):
            to_show = Student.get(id)
            if not to_show:
                return "Student doesn't exist"
            else:
                return to_show.json()

        def post(self, id):
            # id is not used to add new student
            name = request.form['name']

            lesson_day = request.form['lesson_day'].lower()
            if lesson_day not in weekdays:
                if lesson_day not in weekdays_abbreviated:
                    return {'message': 'lesson day must be a day Eg. Monday'}
                lesson_day = weekdays_abbreviated[lesson_day]

            lesson_time = request.form['lesson_time']
            try:
                time.strptime(lesson_time, "%H:%M")
            except ValueError:
                return {'message': 'lesson_time must be in format HH:MM (24 hour time)'}

            address = request.form['address']
            price = request.form['price']

            added = Student.add(name, lesson_day, lesson_time, address, price)
            return added.json()

        def delete(self, id):
            return Student.delete(id)


class Appointment(db.Model):
    __tablename__ = 'appointment'
    id = db.Column('id', db.Integer, primary_key=True)
    student = db.Column('student', db.Integer, db.ForeignKey(Student.id, onupdate="CASCADE", ondelete="CASCADE"))
    datetime = db.Column('datetime', db.DateTime)
    date = db.Column('date', db.Date)
    time = db.Column('time', db.Time)
    attended = db.Column('attended', db.Boolean)
    payed = db.Column('payed', db.Boolean)

    def __repr__(self):
        return f'Appointment({self.id}): {self.datetime} | {Student.get(self.student)}'

    def __str__(self):
        return self.__repr__()

    def json(self):
        return {
            'id': self.id,
            'student': Student.get(self.student).json(),
            'datetime': str(self.datetime),
            'date': str(self.date),
            'time': str(self.time),
            'attended': self.attended,
            'payed': self.payed,
        }

    @staticmethod
    def add_for_next_available_date(student: Student):
        # TODO: Run this every monday? Every time they sign on for every student?
        hour = int(student.lesson_time.strftime('%H'))
        minute = int(student.lesson_time.strftime('%M'))
        weekday = student.lesson_day
        now = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)
        next_lesson_datetime = next_weekday(now, weekday)

        clash = Appointment.query.filter_by(datetime=next_lesson_datetime).first()
        if clash:
            return None

        next_lesson_date = next_lesson_datetime.date()
        next_lesson_time = next_lesson_datetime.time()
        to_add = Appointment(student=student.id, datetime=next_lesson_datetime, date=next_lesson_date,
                             time=next_lesson_time, attended=False, payed=False)

        db.session.add(to_add)
        db.session.commit()
        return to_add

    class SingleAppointment(Resource):
        def get(self, id):
            found = Appointment.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
            if not found:
                return {'message': 'Appointment not found'}
            else:
                return found.json()

        def post(self, id):
            """
            Creates appointment for student in next week
            """
            # id is id of student
            student = Student.get(id)
            if not student:
                return {'message': 'Student does not exist'}
            added = Appointment.add_for_next_available_date(student)
            if not added:
                return {'message': 'Clashes with existing appointment'}
            return added.json()

        def delete(self, id):
            found = Appointment.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
            if not found:
                return {'message': 'Appointment not found'}
            else:
                db.session.delete(found)
                db.session.commit()
                return {'message': 'Appointment deleted successfully'}

    class AllAppointments(Resource):
        def get(self):
            appointments = []
            for a in Appointment.query.all():
                appointments.append(a.json())
            return {'appointments': appointments}

    class DailyAppointments(Resource):
        def get(self, date):
            """
            Gets all appointments for a given date
            """
            appointments = []
            for a in Appointment.query.filter_by(date=date).order_by(Appointment.time):
                appointments.append(a.json())
            return {'appointments': appointments}


api.add_resource(Student.SingleStudent, '/student/<id>')
api.add_resource(Student.AllStudents, '/student')

api.add_resource(Appointment.SingleAppointment, '/appointment/<id>')
api.add_resource(Appointment.AllAppointments, '/appointment')
api.add_resource(Appointment.DailyAppointments, '/daily_appointments/<date>')


@app.route('/')
def daily_view():
    today = datetime.now().date() + timedelta(days=1)
    appointments = requests.get(f'http://localhost:5000/daily_appointments/{today}')
    appointments = json.loads(appointments.text)
    print(appointments)
    for a in appointments['appointments']:
        print(a)

    return render_template('daily_view.html', appointments=appointments['appointments'])
