SELECT employee_manage AS department
FROM department
LEFT JOIN role ON department.id = role.department_id
ON reviews.movie_id = movies.id
ORDER BY movies.movie_name;