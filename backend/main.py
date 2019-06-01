from flask import Flask, request, make_response, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from datetime import datetime, date, timedelta
import time
import psycopg2
import json
import requests
from flask_cors import CORS
import _sha256
from passlib.hash import sha256_crypt
from functools import wraps

from .utilities.weekdays import next_weekday, all_days_in_week, weekdays, weekdays_abbreviated, to_weekday

# import .ut

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
        return {
            'public_id': self.public_id,
            'email': self.email,
            'name': self.name,
            'standard_rate': str(self.standard_rate),
            'address': str(self.address)
        }

    @staticmethod
    def get(public_id):
        found = Teacher.query.filter_by(public_id=public_id).first()
        if not found:
            return {'message': 'Teacher does not exist'}, 404
        return found

    def weekly_schedule(self, start_date):
        """
        gets a view of the teacher's weekly schedule for the given start date.
        Gives 7 days, can start at any day of the week
        """
        return NotImplemented

    class TeacherLogIn(Resource):
        @staticmethod
        def get():
            """Teacher logs in here - gets JWT in response"""
            # Auth idea from here https://www.youtube.com/watch?v=WxGBoY5iNXY
            auth = request.authorization

            if not auth or not auth.username or not auth.password:
                return {'message': "Must provide username and password"}, 401, {
                    'WWW-Authenticate': 'Basic realm="Login Required"'}

            teacher = Teacher.query.filter_by(email=auth.username).first()
            if not teacher:
                return {'message': "Username or password incorrect"}, 401, {
                    'WWW-Authenticate': 'Basic realm="Login Required"'}

            if check_password_hash(teacher.password, auth.password):
                token = jwt.encode({
                    # 'user': auth.username,
                    'public_id': teacher.public_id,
                    'exp': datetime.utcnow() + timedelta(minutes=30)},
                    app.config['SECRET_KEY']
                )

                return {'token': token.decode('UTF-8')}
            return {'message': "Username or password incorrect"}, 401, {
                'WWW-Authenticate': 'Basic realm="Login Required"'}

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

            # Is having accurate messages inviting spammers/bad actors creating accounts?
            if not email:
                return {'message': '"email" must be provided when adding new teacher'}, 400
            if not password:
                return {'message': '"password" must be provided'}, 400
            if not standard_rate:
                return {'message': '"standard_rate" must be provided'}, 400
            if not name:
                return {'message': '"name" must be provided'}, 400

            password_encrypted = generate_password_hash(password, method='sha256')

            try:
                to_add = Teacher(email=email, name=name, public_id=public_id, password=password_encrypted,
                                 standard_rate=standard_rate, address=address)
                db.session.add(to_add)
                db.session.commit()
                return {'message': 'Teacher added successfully'}, 201
            except IntegrityError as e:
                print('duplicate email provided from new user')
                return {'message': 'Please provide a unique email'}, 409

        @staticmethod
        @token_required
        def get(current_user):
            """Get list of all teachers"""
            teachers = Teacher.query.all()
            output = []
            for t in teachers:
                output.append(t.json())
            return output


class DailySchedule(Resource):
    @staticmethod
    @token_required
    def get(current_user, lesson_date):
        lesson_date = datetime.strptime(lesson_date, "%Y-%m-%d").date()
        teacher = current_user
        my_students = [x for x in Student.query.filter_by(teacher=teacher.id)]
        to_ret = []
        for student in my_students:
            if student.get_lesson_time(lesson_date):
                to_ret.append(student.json())

        return to_ret


class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column('id', db.Integer, primary_key=True)
    teacher = db.Column('teacher', db.Integer, db.ForeignKey(Teacher.id, onupdate="CASCADE", ondelete="CASCADE"))
    name = db.Column('name', db.String(200), nullable=False)
    address = db.Column('address', db.String(200), nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    email = db.Column(db.String(200), nullable=True)
    phone = db.Column(db.String(20), nullable=True)

    def json(self):
        plan: LessonPlan = self.get_lesson_plan()
        teacher = Teacher.query.filter_by(id=self.teacher).first().public_id  # Maybe don't release this info

        student = {
            'id': str(self.id),
            'teacher': str(teacher),
            'name': str(self.name),
            'address': str(self.address),
            'end_date': str(self.end_date),
            'email': str(self.email),
        }

        if plan:
            student['lesson_plan'] = plan.json()

        return student

    def __repr__(self):
        return f'Student: {self.name}.  {self.lesson_day}. {self.lesson_time}. ${self.price}'

    def __str__(self):
        return self.__repr__()

    def account(self):
        """
        Gets account balance of student.
        Looks at all payment and attendance objects to figure this out.
        """
        payments = Payment.query.filter_by(student=self.id)

        return NotImplemented

    def payment_total(self):
        """
        returns total amount student has payed
        """
        total = 0
        for x in Payment.query.all():
            print(x.amount)
            total += x.amount

        return total

    def get_lesson_plan(self):
        plans = [x for x in LessonPlan.query.filter_by(student=self.id)]
        now = datetime.now().date()
        for plan in plans:
            if plan.start_date >= now:
                return plan

        return None

    def get_lesson_time(self, requested_date: date):
        """
        Gets the lesson time on the given date, or none if no lesson on that date
        """
        weekday = weekdays[(requested_date.weekday() + 1) % 7]
        print(weekday)

        plans = [x for x in LessonPlan.query.filter_by(student=self.id).order_by(LessonPlan.start_date.desc())]
        current_plan = None
        for plan in plans:
            if plan.start_date <= requested_date:
                current_plan = plan
                break

        if not current_plan:
            return None

        if current_plan.lesson_day == weekday:
            return current_plan.lesson_time
        else:
            return None

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

    class StudentPayments(Resource):
        def get(self, id):
            s: Student = Student.query.filter_by(id=int(id)).first()
            return {'total': str(s.payment_total())}

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
            """
            Adds a new student to the logged in teacher
            """
            # TODO: Check for schedule clash when adding new student
            name = request.form.get('name')
            address = request.form.get('address')
            end_date = None  # TODO: Implement this as optional
            email = request.form.get('email')
            start_date = None  # TODO: Implement this as optional
            lesson_time = request.form.get('lesson_time')
            lesson_day = request.form.get('lesson_day')
            length_minutes = request.form.get('lesson_length_minutes')
            price = request.form.get('price')

            if not name:
                return {'message': 'name must be provided'}

            if not address:
                return {'message': 'address must be provided'}

            if not start_date:
                start_date = datetime.now().date()

            try:
                time.strptime(lesson_time, "%H:%M")
            except (TypeError, ValueError):
                return {'message': 'lesson_time must be in format HH:MM (24 hour time)'}

            if not lesson_day:
                return {'message': 'lesson_day must be provided'}

            # TODO: Use util function instead of this
            lesson_day = lesson_day.lower()
            if lesson_day not in weekdays:
                if lesson_day not in weekdays_abbreviated:
                    return {'message': 'lesson day must be a day Eg. Monday'}
                lesson_day = weekdays_abbreviated[lesson_day]

            if not price:
                price = current_user.standard_rate

            # TODO: Handle end_date

            new_student = Student(
                teacher=current_user.id,
                name=name,
                address=address,
                end_date=None,
                email=email
            )
            db.session.add(new_student)
            db.session.commit()

            new_lt = LessonPlan(
                student=new_student.id,
                start_date=start_date,
                lesson_time=lesson_time,
                lesson_day=lesson_day,
                length_minutes=length_minutes,
                price=price
            )
            db.session.add(new_lt)
            db.session.commit()

            return new_student.json(), 201

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


class LessonPlan(db.Model):
    __tablename__ = 'lesson_plan'
    id = db.Column(db.Integer, primary_key=True)
    student = db.Column(db.ForeignKey(Student.id, onupdate='CASCADE', ondelete='CASCADE'))
    start_date = db.Column(db.Date, nullable=False)  # When the student starts using this lesson time
    end_date = db.Column(db.Date, nullable=True, default=None)  # Null when no end-date set
    lesson_time = db.Column(db.String(50), nullable=False)
    lesson_day = db.Column(db.String, nullable=False)  # Only days of the week allowed here
    length_minutes = db.Column('length_minutes', db.Integer, nullable=False, default=30)
    price = db.Column(db.DECIMAL, nullable=False)

    def json(self):
        # TODO: Return student in readable format maybe

        return {
            'id': str(self.id),
            'lesson_time': str(self.lesson_time),
            'lesson_day': self.lesson_day,
            'start_date': str(self.start_date),
            'end_date': str(self.end_date),
            'end_time': 'XX:YY',
            'price': str(self.price),
            'student': self.student,
        }

    @staticmethod
    def get_current_lesson_time(student: Student):
        """
        Get current lesson time for a student - based on now
        """
        times = LessonPlan.query.filter_by(student=student.id).order_by(LessonPlan.start_date)
        now = datetime.now()
        for time in times:
            if now >= time.start_Date:
                return time

        return None

    class StudentLessonPlanResource(Resource):
        @staticmethod
        def get(student_id):
            """
            Gets all lesson times attached to a particular student
            """
            return [x.json() for x in LessonPlan.query.filter_by(student=student_id)]

        @staticmethod
        def post(student_id):
            # TODO: Error checking
            # TODO: Don't allow multiple with the same start time
            start_date = request.form.get('start_date')
            lesson_time = request.form.get('lesson_time')
            lesson_day = request.form.get('lesson_day')
            lesson_length_minutes = request.form.get('lesson_length_minutes')
            lesson_price = request.form.get('price')

            if not start_date:
                start_date = datetime.now().date()
            elif start_date:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()

            if not lesson_time:
                return {'message': '"lesson_time" must be included'}
            elif lesson_time:
                lesson_time = datetime.strptime(lesson_time, "%H:%M")

            if not lesson_day:
                return {'message': '"lesson_day" must be included'}
            elif lesson_day:
                lesson_day = to_weekday(lesson_day)

            if not lesson_length_minutes:
                return {'message': '"lesson_length_minutes" must be included'}

            if not lesson_price:
                return {'message': '"lesson_price" must be included'}
            else:
                # TODO: try-catch for parsing errors
                lesson_price = float(lesson_price)

            # TODO: Wrap in try-catch
            lesson_length_minutes = int(lesson_length_minutes)

            to_add = LessonPlan(student=student_id, start_date=start_date, lesson_time=lesson_time,
                                lesson_day=lesson_day, lesson_length_minutes=lesson_length_minutes, price=lesson_price)
            db.session.add(to_add)
            db.session.commit()

            return to_add.json()

    class LessonPlanResource(Resource):
        @staticmethod
        def get(lesson_time_id):
            return LessonPlan.query.filter_by(id=lesson_time_id).first().json()

        @staticmethod
        def delete(lesson_time_id):
            lt = LessonPlan.query.filter_by(id=lesson_time_id).first().json()
            db.session.remove(lt)
            db.session.commit()
            return {'message': 'Lesson Time deleted successfully'}


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


class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.Integer, primary_key=True)
    student = db.Column(db.ForeignKey(Student.id, onupdate='CASCADE', ondelete='CASCADE'))
    datetime = db.Column(db.DateTime, nullable=False)
    lesson_length = db.Column(db.Integer, nullable=False)
    attended = db.Column(db.Boolean, default=False, nullable=False)
    cancelled = db.Column(db.Boolean, default=False, nullable=False)
    price = db.Column(db.DECIMAL, nullable=False)  # Price of the lesson attended/cancelled

    def json(self):
        return {
            'student': str(self.student.id),
            'datetime': str(self.datetime),
            'attended': str(self.attended),
            'cancelled': str(self.cancelled)
        }


class Payment(db.Model):
    __tablename__ = 'payment'
    id = db.Column(db.Integer, primary_key=True)
    student = db.Column(db.ForeignKey(Student.id, onupdate='CASCADE', ondelete='CASCADE'))
    datetime = db.Column(db.DateTime, nullable=False)
    amount = db.Column(db.DECIMAL, nullable=False)

    def json(self):
        return {
            'student': str(self.student),
            'datetime': str(self.datetime),
            'amount': str(self.amount)
        }

    @staticmethod
    def add_payment(student: Student, amount):
        now = datetime.now()
        payment = Payment(student=student, datetime=now, amount=amount)
        db.session.add(payment)
        return payment

    class PaymentResource(Resource):
        @staticmethod
        def post(student_id):
            """
            Adds a payment to a student
            """
            date_and_time = datetime.now()
            amount = request.form.get('amount')

            to_add = Payment(student=student_id, datetime=date_and_time, amount=amount)
            db.session.add(to_add)
            db.session.commit()

            return to_add.json()

        @staticmethod
        def get(student_id):
            """
            Gets all payments for the specified student
            """
            return [x.json() for x in Payment.query.filter_by(student=student_id)]


api.add_resource(Teacher.SingleTeacher, '/teacher')
api.add_resource(Teacher.AllTeachers, '/teachers')
api.add_resource(Teacher.TeacherLogIn, '/user')

api.add_resource(DailySchedule, '/my_appointments/daily/<lesson_date>')

api.add_resource(Student.SingleStudent, '/student/<id>')
api.add_resource(Student.AllStudents, '/student')
api.add_resource(Student.AllStudentsPerTeacher, '/my_students')
api.add_resource(Student.StudentPayments, '/my_students/payments/<id>')

api.add_resource(Note.SingleNote, '/student/note/<id>')
api.add_resource(Note.AllNotesPerStudent, '/student/notes/<student_id>')

api.add_resource(Payment.PaymentResource, '/payment/<student_id>')

api.add_resource(LessonPlan.StudentLessonPlanResource, '/my_students/lesson_time/<student_id>')
