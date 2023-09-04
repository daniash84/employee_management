drop database if exists employee_manage.db;
create database employee_manage.db;

use employee_manage.db;

create table department (
id INT AUTO_INCREMENT PRIMARY KEY
name varchar (30)

);

create table role (
id int AUTO_INCREMENT PRIMARY KEY
title varchar(30)
salary decimal 
department_id INT
);

create table employee (
id int AUTO_INCREMENT PRIMARY KEY
first_name varchar(30)
last_name varchar(30)
role_id int
manager_id int 
)