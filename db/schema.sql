drop database if exists employee_manage.db;
create database employee_manage.db;

use employee_manage.db;

create table department (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
name varchar (30) NOT NULL

);

create table role (
id int NOT NULL AUTO_INCREMENT PRIMARY KEY
title varchar(30) NOT NULL
salary decimal 
department_id INT
FOREIGN KEY (department_id) REFERENCES department(department_id)
ON DELETE SET NULL
);

create table employee (
id int NOT NULL AUTO_INCREMENT PRIMARY KEY
first_name varchar(30) NOT NULL
last_name varchar(30) NOT NULL
role_id int NOT NULL
manager_id int  NOT NULL
FOREIGN KEY (role_id) REFERENCES role(role_id)
)