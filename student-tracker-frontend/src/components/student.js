import React, {useEffect} from 'react'
import './student.css'

export default function Student(props) {
    const [student, setStudent] = React.useState(null);
    const student_id = props.id;

    // TODO: get student_id from url
    useEffect(() => {
        fetch('http://localhost:5000/student/' + student_id)
            .then(results => results.json())
            .then(data => {
                console.log(data)
                setStudent(data);
            });
    }, []);


    if (!student) {
        return <h1>Student loading...</h1>;
    }

    return (
        <div className={'student'}>
            <h2>{student.name}</h2>
            <ul>
                <li>
                    <h4>Name:</h4>
                    <p>{student.lesson_day}</p>
                </li>
                <li>
                    <h4>Lesson time:</h4>
                    <p>{student.lesson_time} - {student.lesson_end}</p>
                </li>
                <li>
                    <h4>Address:</h4>
                    <p>{student.address}</p>
                </li>
                <li>
                    <h4>Price:</h4>
                    <p>${student.price}</p>
                </li>
            </ul>
        </div>
    );
}