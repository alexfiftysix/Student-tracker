import React, {useEffect} from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import {makeStyles} from "@material-ui/core"
import config from '../config'

const useStyles = makeStyles(theme => ({
    invoice: {
        background: 'white',
        padding: theme.spacing(3),
        margin: theme.spacing(2),
        borderRadius: '5px',
        textAlign: 'left',
    },
    owing: {
        fontWeight: 'bold',
    },
    table: {
        '& *': {
            marginLeft: 0,
            paddingLeft: 0,
        }
    }
}));

export default function Invoice(props) {
    const [invoice, setInvoice] = React.useState(null);
    const classes = useStyles();
    // TODO: Get year from url also
    let student_id = props.match.params.student_id;
    let month = '' + props.match.params.month;
    if (month.length === 1) {
        month = '0' + month;
    }

    const url = config.serverHost + 'my_students/invoice/' + student_id + '/2019-' + month;
    useEffect(() => {
        fetch(url,
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(results => results.json())
            .then(data => {
                console.log(data);
                setInvoice(data);
            })
    }, [url]);

    if (!invoice) {
        return <div><h1>Invoice not loaded!</h1></div>
    }

    return (
        <Paper className={classes.invoice}>
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
                <p>Address: {invoice.student.address.printable}</p>
            </aside>

            <h3>Lessons:</h3>
                <Table className={classes.table}>
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
                            <TableRow key={b.datetime}>
                                <TableCell>{b.datetime}</TableCell>
                                {console.log(b)}
                                <TableCell align={'right'}>{b.cancelled === 'True' ? 'Cancelled' : b.attended === 'True' ? 'Yes' : 'No'}</TableCell>
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
                        <TableRow >
                            <TableCell colSpan={'3'}>Amount owing</TableCell>
                            <TableCell className={classes.owing} align={'right'}>${invoice.total_outstanding}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
        </Paper>
    )
}

