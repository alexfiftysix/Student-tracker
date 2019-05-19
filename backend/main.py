from flask import Flask, request, make_response, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, timedelta
import time
import json
import requests
from flask_cors import CORS
import _sha256
from passlib.hash import sha256_crypt
from functools import wraps

from .utilities.weekdays import next_weekday, all_days_in_week, weekdays, weekdays_abbreviated

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://root:password@localhost/student-tracker'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'myBigSecret'
api = Api(app)
db = SQLAlchemy(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not request.headers['x-access-token']:
            return {'message': 'Please provide token to access this resource'}, 401

        token = request.headers['x-access-token']

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = Teacher.get(data['public_id'])
        except:
            return {'message': 'Token is invalid'}, 401

        print(current_user)
        return f(current_user, *args, **kwargs)

    return decorated


class Teacher(db.Model):
    __tablename__ = 'teacher'
    id = db.Column('id', db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    email = db.Column('email', db.String(250), unique=True)
    name = db.Column('name', db.String(200))
    password = db.Column('password', db.String(200), nullable=False)  # sha256 encryption here plz
    standard_rate = db.Column('standard_rate', db.DECIMAL, nullable=False)
    address = db.Column('address', db.String, nullable=True)  # for price calculations if we want to go there

    def json(self):
        # Avoid releasing sensitive information here
        return {
            'public_id': self.public_id,
            'email': self.email,
            'name': self.name,
            'standard_rate': str(self.standard_rate),
            'password': self.password
        }

    @staticmethod
    def get(public_id):
        found = Teacher.query.filter_by(public_id=public_id).first()
        if not found:
            return {'message': 'Teacher does not exist'}, 404
        return found

    class TeacherLogIn(Resource):
        @staticmethod
        def get():
            """Teacher logs in here - gets JWT in response"""
            # TODO: Implement auth from here https://www.youtube.com/watch?v=WxGBoY5iNXY
            auth = request.authorization

            if not auth or not auth.username or not auth.password:
                return {'message': "Could not verify"}, 401, {'WWW-Authenticate': 'Basic realm="Login Required"'}

            teacher = Teacher.query.filter_by(email=auth.username).first()
            if not teacher:
                return {'message': "Username or password incorrect"}, 401  # TODO: Should this be 403?

            if check_password_hash(teacher.password, auth.password):
                token = jwt.encode({
                    # 'user': auth.username,
                    'public_id': teacher.public_id,  # TODO: Use public_id
                    'exp': datetime.utcnow() + timedelta(minutes=30)},
                    app.config['SECRET_KEY']
                )

                return {'token': token.decode('UTF-8')}
            return {'message': "Username or password incorrect"}, 401

    class SingleTeacher(Resource):
        @staticmethod
        @token_required
        def get(current_user):
            """Access a teacher's record"""
            if not current_user:
                return None
            else:
                return current_user.json()

    class AllTeachers(Resource):
        @staticmethod
        def post():
            """For adding new teachers to the database"""
            email = request.form.get('email')
            name = request.form.get('name')
            public_id = str(uuid.uuid4())
            password = request.form.get('password')
            standard_rate = request.form.get('standard_rate')
            address = request.form.get('address')

            # TODO: Not such accurate messages - invites bad actors/spam accounts
            if not email:
                return {'message': '"email" must be provided when adding new teacher'}
            if not password:
                return {'message': '"password" must be provided'}
            if not standard_rate:
                return {'message': '"standard_rate" must be provided'}
            if not name:
                return {'message': '"name" must be provided'}

            password_encrypted = generate_password_hash(password, method='sha256')

            # TODO: Handle duplicate email somehow
            to_add = Teacher(email=email, name=name, public_id=public_id, password=password_encrypted,
                             standard_rate=standard_rate, address=address)
            db.session.add(to_add)
            db.session.commit()
            return {'message': 'Teacher added successfully'}, 201

        @staticmethod
        @token_required
        def get(current_user):
            """Get list of all teachers"""
            teachers = Teacher.query.all()
            output = []
            for t in teachers:
                output.append(t.json())
            return output


class Student(db.Model):
    # TODO: Route to update all students calendars
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
            'teacher': Teacher.query.filter_by(id=self.teacher).first().public_id
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
    def get(id: int):
        # Gets all teachers
        found = Student.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
        if not found:
            return None
        return found

    class AllStudentsPerTeacher(Resource):
        @staticmethod
        @token_required
        def get(current_user):
            students = []
            for student in Student.query.filter_by(teacher=current_user.id):
                students.append(student.json())
            return students

        @staticmethod
        @token_required
        def post(current_user):
            # TODO: Check for schedule clash when adding new student
            name = request.form.get('name')
            if not name:
                return {'message': 'name must be provided'}

            lesson_day = request.form.get('lesson_day')
            if not lesson_day:
                return {'message': 'lesson_day must be provided'}
            lesson_day = lesson_day.lower()
            if lesson_day not in weekdays:
                if lesson_day not in weekdays_abbreviated:
                    return {'message': 'lesson day must be a day Eg. Monday'}
                lesson_day = weekdays_abbreviated[lesson_day]

            lesson_time = request.form.get('lesson_time')
            try:
                time.strptime(lesson_time, "%H:%M")
            except (TypeError, ValueError):
                return {'message': 'lesson_time must be in format HH:MM (24 hour time)'}

            lesson_length_minutes = request.form.get('lesson_length_minutes')

            address = request.form.get('address')
            if not address:
                return {'message': 'address must be provided'}

            price = request.form.get('price')
            if not price:
                price = current_user.standard_rate

            to_add = Student(name=name, lesson_day=lesson_day, lesson_time=lesson_time, teacher=current_user.id,
                             lesson_length_minutes=lesson_length_minutes, address=address, price=price)
            db.session.add(to_add)
            db.session.commit()

            Appointment.SingleAppointment.post(to_add.id)
            return to_add.json(), 201

    class UpdateAllStudentsPerTeacher(Resource):
        @staticmethod
        @token_required
        def get(current_user):
            # TODO: Don't allow double-booking
            students = []
            for student in Student.query.filter_by(teacher=current_user.id):
                students.append(student)

            for student in students:
                print(student)
                Appointment.add_for_next_available_date(student)

            return {'message': 'schedule updated'}

    class AllStudents(Resource):
        @staticmethod
        @token_required
        def get(current_user):
            # TODO: Only allow this route for admin users
            students = []
            for student in Student.query.all():
                students.append(student.json())
            return {'students': students}

    class SingleStudent(Resource):
        @staticmethod
        @token_required
        def get(current_user, id):
            to_show = Student.get(id)
            if to_show.teacher == current_user.id:
                if not to_show:
                    return "Student doesn't exist"
                else:
                    return to_show.json()
            else:
                return {'message': 'not your student'}, 401

        @staticmethod
        def delete(id):
            return Student.delete(id)


class Note(db.Model):
    __tablename__ = 'note'
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
        @token_required
        def get(current_user, id):
            retrieved_note = Note.query.filter_by(id=id).first()
            student = Student.get(retrieved_note.student)
            if student.teacher != current_user.id:
                return {'message': 'not your student'}, 401

            if not retrieved_note:
                return {'message': 'note does not exist'}
            return retrieved_note.json()

        @staticmethod
        @token_required
        def delete(current_user, id):
            retrieved_note = Note.query.filter_by(id=id).first()
            student = Student.get(retrieved_note.student)
            if student.teacher != current_user.id:
                return {'message': 'not your student'}, 401

            if not retrieved_note:
                return {'message': 'note does not exist'}
            db.session.remove(retrieved_note)
            db.session.commit()
            return {'message': 'note deleted successfully'}

    class AllNotesPerStudent(Resource):
        @staticmethod
        @token_required
        def get(current_user, student_id):
            student = Student.get(student_id)
            if student.teacher != current_user.id:
                return {'message': 'not your student'}, 4

            retrieved_notes = Note.query.filter_by(student=student_id).order_by(Note.date_and_time.desc())
            notes = []
            for note in retrieved_notes:
                notes.append(note.json())
            return notes

        @staticmethod
        def post(student_id):
            now = datetime.now()

            notes = request.form.get('notes')

            student_record = Student.get(int(student_id))
            if not student_record:
                return {'message': 'student does not exist'}

            if not notes:
                return {'message': 'please provide "notes"'}

            to_add = Note(student=int(student_id), date_and_time=now, notes=notes)
            db.session.add(to_add)
            db.session.commit()

            return {'message': 'Note added successfully'}, 201


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

        next_lesson_date = next_lesson_datetime.date()
        next_lesson_time = next_lesson_datetime.time()

        clash = Appointment.query.filter_by(date=next_lesson_date).filter_by(time=next_lesson_time).first()
        if clash:
            return {'message': 'clashes with existing appointment'}

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
            return added.json(), 201

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

        @staticmethod
        def delete(id):
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
        @staticmethod
        @token_required
        def get(current_user):
            result = (db.session.query(Teacher, Student, Appointment)
                      .filter(Teacher.id == current_user.id)
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
        @token_required
        def get(current_user, date):
            """
            Gets all appointments for a given date
            """

            result = (db.session.query(Teacher, Student, Appointment)
                      .filter(Teacher.id == current_user.id)
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
        @token_required
        def get(current_user, date):
            """
            Gets all appointments for a given date
            """
            date = datetime.strptime(date, '%Y-%m-%d')

            result = (db.session.query(Teacher, Student, Appointment)
                      .filter(Teacher.id == current_user.id)
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


api.add_resource(Teacher.SingleTeacher, '/teacher')
api.add_resource(Teacher.AllTeachers, '/teachers')
api.add_resource(Teacher.TeacherLogIn, '/user')

api.add_resource(Student.SingleStudent, '/student/<id>')
api.add_resource(Student.AllStudents, '/student')
api.add_resource(Student.AllStudentsPerTeacher, '/my_students')
api.add_resource(Student.UpdateAllStudentsPerTeacher, '/my_students/update')

api.add_resource(Note.SingleNote, '/student/note/<id>')
api.add_resource(Note.AllNotesPerStudent, '/student/notes/<student_id>')

api.add_resource(Appointment.SingleAppointment, '/appointment/<id>')
api.add_resource(Appointment.AllAppointments, '/appointment')

api.add_resource(Appointment.AllAppointmentsPerTeacher, '/my_appointments')
api.add_resource(Appointment.DailyAppointmentsPerTeacher, '/my_appointments/daily/<date>')
api.add_resource(Appointment.WeeklyAppointmentsPerTeacher, '/my_appointments/weekly')
