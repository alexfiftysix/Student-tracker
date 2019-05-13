from flask import Flask, render_template, request
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
import time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://root:password@localhost/student-tracker'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
api = Api(app)
db = SQLAlchemy(app)


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
            return False
        db.session.delete(to_delete)
        db.session.commit()
        return True

    @staticmethod
    def add(name, lesson_day, lesson_time, address, price):
        # TODO: error checking
        to_add = Student(name=name, lesson_day=lesson_day, lesson_time=lesson_time, address=address, price=price)
        db.session.add(to_add)
        db.session.commit()
        return to_add.json()

    @staticmethod
    def get(id: int):
        found = Student.query.filter_by(id=id).first()  # Can only be one, but don't want full list object
        return found.json()
        # return found


class StudentResource(Resource):
    def get(self, id):
        to_show = Student.get(id)
        if not to_show:
            return "Student doesn't exist"
        else:
            return to_show

    def post(self, id):
        # id is ditched
        name = request.form['name']
        lesson_day = request.form['lesson_day']
        lesson_time = request.form['lesson_time']
        address = request.form['address']
        price = request.form['price']

        added = Student.add(name, lesson_day, lesson_time, address, price)
        return added

api.add_resource(StudentResource, '/student/<id>')


@app.route('/')
def hello():
    return '<h1>Howdy</h1>'


@app.route('/add_student')
def add_student():
    Student.add(name='Alex', lesson_day="Monday", lesson_time="15:30",
                address='3/25 davenport St', price=50)
    return '<h1>hey</h1>'


@app.route('/show_student/<id>')
def show_student(id):
    to_show = Student.get(id)
    if not to_show:
        return "Student doesn't exist"
    else:
        print(to_show)
        print(to_show.json())
        return to_show.json()
