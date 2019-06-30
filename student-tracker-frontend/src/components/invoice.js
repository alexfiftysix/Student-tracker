import React, {useEffect} from 'react'
import './invoice.css'

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function Invoice(props) {
    const [invoice, setInvoice] = React.useState(null);
    // TODO: Get year from url also
    let student_id = props.match.params.student_id;
    let month = '' + props.match.params.month;
    if (month.length === 1) {
        month = '0' + month;
    }

    const url = 'http://localhost:5000/my_students/invoice/' + student_id + '/2019-' + month;
    useEffect(() => {
        fetch(url,
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(results => results.json())
            .then(data => {
                setInvoice(data);
            })
    }, [url]);

    if (!invoice) {
        return <div><h1>Invoice not loaded!</h1></div>
    }

    return (
        <Paper className={'classes.root invoice'}>
            <h1>Tax Invoice</h1>
            <p>Invoice number: {invoice.invoice_number}</p>
            <p>Date: {invoice.date}</p>
            <aside className={'teacher-details'}>
                <h3>From</h3>
                <p>Name: {invoice.teacher.name}</p>
                <p>Business: {invoice.teacher.business_name}</p>
                {invoice.teacher.abn ? <p>ABN :{invoice.teacher.abn}</p> : null}
            </aside>

            <aside className={'student-details'}>
                <h3>To</h3>
                <p>Name: {invoice.student.name}</p>
                <p>Address: {invoice.student.address}</p>
            </aside>

            <h3>Lessons:</h3>
            <Paper className={'table'}>
                <Table className={'classes.table'}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date and time</TableCell>
                            <TableCell align={'right'}>Attended</TableCell>
                            <TableCell align={'right'}>Cost</TableCell>
                            <TableCell align={'right'}>Payed</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoice.bookings.map(b =>
                            <TableRow key={b.dateTime}>
                                <TableCell>{b.datetime}</TableCell>
                                <TableCell align={'right'}>{b.attended === 'True' ? 'Yes' : 'No'}</TableCell>
                                <TableCell align={'right'}>${b.price}</TableCell>
                                <TableCell align={'right'}>${b.payed}</TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell colSpan={'2'}>Subtotals</TableCell>
                            <TableCell align={'right'}>${invoice.total_price}</TableCell>
                            <TableCell align={'right'}>${invoice.total_payed}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={'4'}/>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={'3'}>Amount owing</TableCell>
                            <TableCell align={'right'}>${invoice.total_outstanding}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Paper>
    )
}

