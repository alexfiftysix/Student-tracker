from flask import Flask, render_template, request
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, timedelta
import time
import json
import requests
from flask_cors import CORS
import _sha256
from passlib.hash import sha256_crypt

from .utilities.weekdays import next_weekday, all_days_in_week, weekdays, weekdays_abbreviated

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://root:password@localhost/student-tracker'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
api = Api(app)
db = SQLAlchemy(app)


class Teacher(db.Model):
    __tablename__ = 'teacher'
    id = db.Column('id', db.Integer, primary_key=True)
    email = db.Column('email', db.String(250), unique=True)
    password = db.Column('password', db.String(200), nullable=False)  # sha256 encryption here plz
    standard_rate = db.Column('standard_rate', db.DECIMAL, nullable=False)
    address = db.Column('address', db.String, nullable=True)  # for price calculations if we want to go there

    def log_in(self, email, password_candidate):
        # TODO: Send hashed password from front-end to avoid MIM attacks.
        teacher = Teacher.SingleTeacher.get(email)
        if teacher:
            if sha256_crypt.verify(password_candidate, teacher.get('password')):
                # TODO: is logged in
                return {'message': 'logged in successfully'}
        return {"message": "Wrong username or password"}
        # TODO: Some auth ideas here https://stackoverflow.com/questions/13916620/rest-api-login-pattern

    def json(self):
        # Avoid releasing sensitive information here
        return {
            'id': str(self.id),
            'email': self.email,
            'standard_rate': str(self.standard_rate)
        }

    @staticmethod
    def get(id):
        found = Teacher.query.filter_by(id=id).first()
        if not found:
            return {'message': 'Teacher does not exist'}
        return found

    class SingleTeacher(Resource):
        @staticmethod
        def get(id):
            found: Teacher = Teacher.get(id)
            if not found:
                return None
            else:
                return found.json()

    class AllTeachers(Resource):
        @staticmethod
        def post():
            email = request.form.get('email')
            password = request.form.get('password')
            standard_rate = request.form.get('standard_rate')
            address = request.form.get('address')

            # TODO: Not such accurate messages - invites bad actors
            #   Could be better to be vague. As is a hacker can follow the steps provided to create an account
            #   (Is this bad though? It's account creation)
            if not email:
                return {'message': '"email" must be provided when adding new teacher'}
            # Check if another teacher uses this email
            # if Teacher.SingleTeacher.get(email):
            #     return {'message': 'Account already exists'}

            if not password:
                return {'message': '"password" must be provided'}
            if not standard_rate:
                return {'message': '"standard_rate" must be provided'}

            # TODO: SHA encryption for passwords before add teacher

            password_encrypted = sha256_crypt.encrypt(password)

            # TODO: Handle duplicate email somehow
            to_add = Teacher(email=email, password=password_encrypted, standard_rate=standard_rate, address=address)
            db.session.add(to_add)
            db.session.commit()
            return {'message': 'Teacher added successfully'}

        def get(self):
            teachers = Teacher.query.all()
            output = []
            for t in teachers:
                output.append(t.json())
            return output


class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column('id', db.Integer, primary_key=True)
    teacher = db.Column('teacher', db.Integer, db.ForeignKey(Teacher.id, onupdate="CASCADE", ondelete="CASCADE"))
    name = db.Column('name', db.String(200), nullable=False)
    lesson_day = db.Column('lesson_day', db.String(10), nullable=False)
    lesson_time = db.Column('lesson_time', db.String(10), nullable=False)
    lesson_length_minutes = db.Column('lesson_length_minutes', db.Integer, nullable=False, default=30)
    address = db.Column('address', db.String(200), nullable=False)
    price = db.Column('price', db.DECIMAL, nullable=False)

    def __repr__(self):
        return f'Student: {self.name}.  {self.lesson_day}. {self.lesson_time}. ${self.price}'

    def __str__(self):
        return self.__repr__()

    def json(self):

        lesson_end = datetime.strptime(self.lesson_time, "%H:%M")  # + timedelta(minutes=self.lesson_length_minutes)
        lesson_end += timedelta(minutes=self.lesson_length_minutes)
        lesson_end = lesson_end.time()
        lesson_end = str(lesson_end.hour) + ':' + str(lesson_end.minute)

        student = {
            'id': self.id,
            'name': self.name,
            'lesson_day': self.lesson_day,
            'lesson_time': str(self.lesson_time),
            'lesson_length_minutes': str(self.lesson_length_minutes),
            'lesson_end': str(lesson_end),
            'address': self.address,
            'price': str(self.price),
            'teacher_id': str(Teacher.get(self.teacher).id)
        }

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
    def add(name, lesson_day, lesson_time, lesson_length_minutes, address, price):
        # TODO: error checking
        # TODO: New lesson start time greater than or equal to lesson is bad
        #   New lesson start less than existing lesson time bad
        clash = Student.query.filter_by(lesson_day=lesson_day).filter_by(lesson_time=lesson_time).first()
        if clash:
            return {'message': 'clashes with student',
                    'student': clash.json()}

        to_add = Student(name=name, lesson_day=lesson_day, lesson_time=lesson_time,
                         lesson_length_minutes=lesson_length_minutes, address=address, price=price)
        db.session.add(to_add)
        db.session.commit()

        Appointment.SingleAppointment.post(to_add.id)
        return to_add

    @staticmethod
    def get(id: int):
        # Gets all teachers
        found = Student.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
        if not found:
            return None
        return found

    class AllStudentsPerTeacher(Resource):
        @staticmethod
        def get(teacher_id):
            students = []
            for student in Student.query.filter_by(teacher=teacher_id):
                students.append(student.json())
            return students

        @staticmethod
        def post(teacher_id):
            # TODO: Use teacher default rate if none specified
            name = request.form.get('name')

            lesson_day = request.form.get('lesson_day').lower()
            if not lesson_day or lesson_day not in weekdays:
                if lesson_day not in weekdays_abbreviated:
                    return {'message': 'lesson day must be a day Eg. Monday'}
                lesson_day = weekdays_abbreviated[lesson_day]

            lesson_time = request.form.get('lesson_time')
            try:
                time.strptime(lesson_time, "%H:%M")
            except ValueError:
                return {'message': 'lesson_time must be in format HH:MM (24 hour time)'}

            lesson_length_minutes = request.form.get('lesson_length_minutes')

            address = request.form['address']
            price = request.form['price']

            to_add = Student(name=name, lesson_day=lesson_day, lesson_time=lesson_time, teacher=int(teacher_id),
                             lesson_length_minutes=lesson_length_minutes, address=address, price=price)
            db.session.add(to_add)
            db.session.commit()

            Appointment.SingleAppointment.post(to_add.id)
            return to_add.json()

    class AllStudents(Resource):
        @staticmethod
        def get():
            students = []
            for student in Student.query.all():
                students.append(student.json())
            return {'students': students}

    class SingleStudent(Resource):
        @staticmethod
        def get(id):
            to_show = Student.get(id)
            if not to_show:
                return "Student doesn't exist"
            else:
                return to_show.json()

        @staticmethod
        def delete(id):
            return Student.delete(id)


class Note(db.Model):
    __tablename__ = 'student_note'
    id = db.Column('id', db.Integer, primary_key=True)
    student = db.Column('student', db.Integer, db.ForeignKey(Student.id, onupdate="CASCADE", ondelete="CASCADE"))
    date_and_time = db.Column('datetime', db.DateTime, nullable=False)
    notes = db.Column('notes', db.String(1000), nullable=False)

    def json(self):
        return {
            'id': self.id,
            'student': Student.get(self.student).json(),
            'date_and_time': str(self.date_and_time),
            'notes': self.notes
        }

    class SingleNote(Resource):
        @staticmethod
        def get(id):
            retrieved_note = Note.query.filter_by(id=id).first()
            if not retrieved_note:
                return {'message': 'note does not exist'}
            return retrieved_note.json()

        @staticmethod
        def delete(id):
            retrieved_note = Note.query.filter_by(id=id).first()
            if not retrieved_note:
                return {'message': 'note does not exist'}
            db.session.remove(retrieved_note)
            db.session.commit()
            return {'message': 'note deleted successfully'}

    class AllNotesPerStudent(Resource):
        def get(self, student_id):
            retrieved_notes = Note.query.filter_by(student=student_id).order_by(Note.date_and_time.desc())
            notes = []
            for note in retrieved_notes:
                notes.append(note.json())
            return notes

    class AllNotes(Resource):
        @staticmethod
        def post():
            # TODO: Put this under singleNote, get student_id from url
            now = datetime.now()

            student_id = request.form.get('student_id')
            notes = request.form.get('notes')

            if not student_id:
                return {'message': 'please provide "student_id"'}

            student_record = Student.get(int(student_id))
            if not student_record:
                return {'message': 'student does not exist'}

            if not notes:
                return {'message': 'please provide "notes"'}

            to_add = Note(student=int(student_id), date_and_time=now, notes=notes)
            db.session.add(to_add)
            db.session.commit()

            return {'message': 'Note aded successfully'}


class Appointment(db.Model):
    __tablename__ = 'appointment'
    id = db.Column('id', db.Integer, primary_key=True)
    student = db.Column('student', db.Integer, db.ForeignKey(Student.id, onupdate="CASCADE", ondelete="CASCADE"))
    datetime = db.Column('datetime', db.DateTime)
    date = db.Column('date', db.Date)  # TODO: Don't store this, infer it from datetime
    time = db.Column('time', db.Time)  # TODO: Don't store this, infer it from datetime
    attended = db.Column('attended', db.Boolean)
    payed = db.Column('payed', db.Boolean)

    def __repr__(self):
        return str(self.json())

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

        lesson_time = time.strptime(student.lesson_time, "%H:%M")

        hour = int(lesson_time.tm_hour)
        minute = int(lesson_time.tm_min)
        weekday = student.lesson_day
        now = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)
        next_lesson_datetime = next_weekday(now, weekday)

        # TODO: Only clashes if same teacher has same timeslot
        # clash = Appointment.query.filter_by(datetime=next_lesson_datetime).first()
        # if clash:
        #     return None

        next_lesson_date = next_lesson_datetime.date()
        next_lesson_time = next_lesson_datetime.time()
        to_add = Appointment(student=student.id, datetime=next_lesson_datetime, date=next_lesson_date,
                             time=next_lesson_time, attended=False, payed=False)

        db.session.add(to_add)
        db.session.commit()
        return to_add

    @staticmethod
    def get(id: int):
        """Returns an appointment with the given id - or None if doesn't exist"""
        found = Appointment.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
        if not found:
            return None
        return found

    class SingleAppointment(Resource):
        def get(self, id):
            found = Appointment.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
            if not found:
                return {'message': 'Appointment not found'}
            else:
                return found.json()

        @staticmethod
        def post(id):
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

        @staticmethod
        def put(id):
            """
            Creates appointment for student in next week
            """
            # id is id of appointment to modify

            appointment: Appointment = Appointment.get(id)
            if not appointment:
                return {'message': 'Appointment does not exist'}

            # TODO: Error checking
            if request.form.get('student'):
                appointment.student = request.form.get('student')

            if request.form.get('datetime'):
                appointment.datetime = request.form.get('datetime')

            if request.form.get('date'):
                appointment.date = request.form.get('date')

            if request.form.get('time'):
                appointment.time = request.form.get('time')

            if request.form.get('attended'):
                if request.form.get('attended').lower() == 'true':
                    appointment.attended = True
                else:
                    appointment.attended = False

            if request.form.get('payed'):
                if request.form.get('payed').lower() == 'true':
                    appointment.payed = True
                else:
                    appointment.payed = False

            print(request.form.get('attended'))
            db.session.commit()

            return appointment.json()

        def delete(self, id):
            found = Appointment.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
            if not found:
                return {'message': 'Appointment not found'}
            else:
                db.session.delete(found)
                db.session.commit()
                return {'message': 'Appointment deleted successfully'}

    class AllAppointments(Resource):
        @staticmethod
        def get():
            appointments = []
            for a in Appointment.query.order_by(Appointment.datetime):
                appointments.append(a.json())

            return {'appointments': appointments}

    class AllAppointmentsPerTeacher(Resource):
        def get(self, teacher_id):
            result = (db.session.query(Teacher, Student, Appointment)
                      .filter(Teacher.id == teacher_id)
                      .filter(Student.teacher == Teacher.id)
                      .filter(Student.id == Appointment.student)
                      .order_by(Appointment.time)
                      .all())

            output = []
            for row in result:
                output.append(row[2].json())
            return output

    class DailyAppointmentsPerTeacher(Resource):
        @staticmethod
        def get(teacher_id, date):
            """
            Gets all appointments for a given date
            """

            result = (db.session.query(Teacher, Student, Appointment)
                      .filter(Teacher.id == teacher_id)
                      .filter(Student.teacher == Teacher.id)
                      .filter(Student.id == Appointment.student)
                      .filter(Appointment.date == date)
                      .order_by(Appointment.time)
                      .all())

            output = []
            for r in result:
                print(r[2])
                output.append(r[2].json())

            return output

    class WeeklyAppointmentsPerTeacher(Resource):
        @staticmethod
        def get(teacher_id, date):
            """
            Gets all appointments for a given date
            """
            date = datetime.strptime(date, '%Y-%m-%d')

            result = (db.session.query(Teacher, Student, Appointment)
                      .filter(Teacher.id == teacher_id)
                      .filter(Student.teacher == Teacher.id)
                      .filter(Student.id == Appointment.student)
                      .filter(Appointment.date >= date)
                      .filter(Appointment.date <= date + timedelta(days=7))
                      .order_by(Appointment.time)
                      .all())

            output = []
            for r in result:
                print(r[2])
                output.append(r[2].json())

            return output

    class DailyAppointments(Resource):
        # TODO: Remove
        @staticmethod
        def get(date):
            """
            Gets all appointments for a given date
            """
            appointments = []
            for a in Appointment.query.filter_by(date=date).order_by(Appointment.time):
                appointments.append(a.json())
            return {'appointments': appointments}

    class WeeklyAppointments(Resource):
        # TODO: Convert to per-teacher
        @staticmethod
        def get(day):
            day = datetime.strptime(day, '%Y-%m-%d')
            print(day)
            week = all_days_in_week(day)
            appointments = []
            for day in week:
                appointments.append(Appointment.DailyAppointments.get(day)['appointments'])

            return appointments


api.add_resource(Teacher.SingleTeacher, '/teacher/<id>')
api.add_resource(Teacher.AllTeachers, '/teacher')

api.add_resource(Student.SingleStudent, '/student/<id>')
api.add_resource(Student.AllStudents, '/student')
api.add_resource(Student.AllStudentsPerTeacher, '/my_students/<teacher_id>')

api.add_resource(Note.SingleNote, '/student/note/<id>')
api.add_resource(Note.AllNotes, '/student/note')
api.add_resource(Note.AllNotesPerStudent, '/student/notes/<student_id>')

api.add_resource(Appointment.SingleAppointment, '/appointment/<id>')
api.add_resource(Appointment.AllAppointments, '/appointment')
api.add_resource(Appointment.DailyAppointments, '/daily_appointments/<date>')
api.add_resource(Appointment.WeeklyAppointments, '/weekly_appointments/<day>')

api.add_resource(Appointment.AllAppointmentsPerTeacher, '/my_appointments/<teacher_id>')
api.add_resource(Appointment.DailyAppointmentsPerTeacher, '/my_appointments/daily/<teacher_id>/<date>')
api.add_resource(Appointment.WeeklyAppointmentsPerTeacher, '/my_appointments/weekly/<teacher_id>/<date>')
