use employees;

INSERT INTO department
    (name)
VALUES
    ('Driver'),
    ('Dispatch'),
    ('Finance'),
    ('Safety');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Driver', 70000, 1),
    ('Dispatcher', 50000, 2),
    ('Account Manager', 100000, 3),
    ('Safety Officer', 25, 4),

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Brian', 'K', 2, 1),
    ('Brandon', 'R', 1, NULL),
    ('Kevin', 'R', 1, NULL),
    ('Jerrel', 'C', 1, NULL),
    ('Tez', '', 1,NULL ),
    ('Brian', 'K', 3, 1),
    ('Brian', 'K', 4, 1);
