const Joi = require('joi');
const express = require('express');
const app = express();
const got = require('got');

app.use(express.json());

const courses = [{
    id: 1,
    name: 'Course #1'
},
{
    id: 2,
    name: 'Course #2'
},
{
    id: 3,
    name: 'Course #3'
},
];

//get all courses
// app.get('/api/courses', (req, res) => {
//     res.send(courses)
// });

// (async () => {
//     try {
//         const response = await got('/api/courses');
//         res.send(courses)

//         console.log(response.body);
//         //=> '<!doctype html> ...'
//     } catch (error) {
//         console.log(error.response.body);
//         //=> 'Internal server error ...'
//     }
// })();

// const port = process.env.PORT || 4000;

// app.listen(port, () => console.log(`Listening to port: ${port}...`));



app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

// get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses)
});

// get course by id
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the requested id was not found.');
    res.send(course);
    //res.send(req.params);
    //res.send(req.query);
});

// add new course 
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); // equivalent to result.error (object destructuring)
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const newCourse = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(newCourse)
    res.send(courses);
    if(courses) res.status(200).send('The courses are present at the output');
});

// get course by id
app.put('/api/courses/:id', (req, res) => {

    // finding the course if it exist else status 404 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the requested id was not found.');

    // validate
    //const result = validateCourse(req.body);
    // if (result.error) {
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }

    const { error } = validateCourse(req.body); // equivalent to result.error (object destructuring)
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // update selected course
    course.name = req.body.name;
    res.send(courses);
});

// get course by id
app.delete('/api/courses/:id', (req, res) => {

    // finding the course if it exist else status 404 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the requested id was not found.');

    // delete selected course
    const courseIndex = courses.indexOf(course);
    courses.splice(courseIndex, 1)

    // return updated list
    res.send(courses)
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

//setting port if available else 4000
const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Listening to port: ${port}...`));