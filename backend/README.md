# Rostera
### Overview
Rostera is for keeping track of student appointments for private teachers.

Appointments can be marked off as attended or payed, and monthly invoices 
generated based on these records.  

### Database Migrations
For database migrations use `flask-migrate`
```
$ export FLASK_APP=run.py
$ flask db migrate
$ flask db upgrade
```