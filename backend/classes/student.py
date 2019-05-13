from backend.main import db
from flask import request
from flask_restful import Resource
import time

weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
]

weekdays_abbreviated = {
    'mon': weekdays[0],
    'tues': weekdays[1],
    'wed': weekdays[2],
    'thurs': weekdays[3],
    'fri': weekdays[4],
    'sat': weekdays[5],
    'sun': weekdays[6]
}


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


class StudentResource(Resource):
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
            time.strptime(lesson_day)  # TODO: Test this better
        except ValueError:
            return {'message': 'Time must be in format HH:MM (24 hour time)'}

        address = request.form['address']
        price = request.form['price']

        added = Student.add(name, lesson_day, lesson_time, address, price)
        return added.json()

    def delete(self, id):
        return Student.delete(id)