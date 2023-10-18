insert into department (department_name)
values ("Manager"), ("Sales"), ("Marketing"), ("Finance"),("Staff")

insert into role (title, salary, department_id)
values ("Designer", 60000, 2),
("Senior Designer", 90000, 1),
("Bookkeeper"75000, 3),
("Floor Worker", 40000, 4),
("Manager", 100000, 5), 
("Senior Manager", 150000, 6), 
("CEO", 200000, 7), 
("Sales", 55000, 8)

insert into employee (first_name, last_name, role_id, manager_id)
values ("John", "Doe", 1, NULL),
    ("Mike", "Smith", 1, 1),
    ("Ashley", "Rodriguez", 3, NULL),
    ("Kevin", "Tipik", 4, 3),
    ("Malia", "Brown", 5, NULL),
    ("Sarah", "Patterson", 6, NULL),
    ("Tim", "Allen", 7, 6),
    ("Yadira", "Ibrahim", 4, 3);