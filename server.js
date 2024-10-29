import { todoService } from "./services/todo.service.js"
import { loggerService } from "./services/logger.service.js"
import { userService } from "./services/user.service.js" 

import { pdfService } from "./services/pdf.service.js"

import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'


const app = express()
const PORT = process.env.PORT || 3020
// const PORT =  3020

app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())

app.get('/api/todo', (req, res) => {
    // console.log('hi from get api')

    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || 0,
        description: req.query.description || '',
        labels: req.query.labels ? req.query.labels : [],
        pageIdx: req.query.pageIdx
    }

    //* defult is 1 insted of undifind or idk
    const sortBy = {
        type: req.query.type || '',
        dir: +req.query.dir || 1
    }

    todoService.query(filterBy, sortBy)
        .then(todos => {
            // pdfService.buildtodoPDF(todos)
            res.send(todos)
        })
        .catch(err => {
            loggerService.error('Cannot get todos', err)
            res.status(500).send('Cannot get todos')
        })
})

// add
app.post("/api/todo", (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot add todo')
    // console.log("req.body:", req.body)
    const todoToSave = req.body
    todoService
        .save(todoToSave,loggedInUser)
        .then((todo) => res.send(todo))
        .catch((err) => {
            loggerService.error("Cannot save todo", err)
            res.status(400).send("Cannot save todo")
        })
})

//* UPDATE 
app.put('/api/todo/:id', (req, res) => {
    const loggedInUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot UPDATE todo')
    const todoToSave = {
        //^only the severity
        //^ 
        _id: req.body._id,
        title: req.body.title || '',
        //* i can do it also with a libery of Number
        severity: +req.body.severity || 0,
        description: req.body.description || '',
        labels: req.body.labels || '', // []
    }

    todoService.save(todoToSave,loggedinUser)
        .then(savedTodo => res.send(savedTodo))
        .catch(err => {
            loggerService.error('Cannot save todo', err)
            res.status(500).send('Cannot save todo')
        })
})

//* READ
app.get("/api/todo/:todoId", (req, res) => {
    // todoId = req.params.id
    const { todoId } = req.params
    const { visitedTodos = [] } = req.cookies
    console.log(visiTedtodos)

    if (!visitedtodos.includes(todoId)) {
        if (visitedTodos.length >= 3) return res.status(401).send('Wait for a bit')
        //* if not already present push to the arr
        else visitedtodos.push(todoId)
        console.log(todoId)
    }

    //* Reset cookies after 10 seconds
    res.cookie('visitedTodos', visitedTodos, { maxAge: 5000 * 2 })

    todoService.getById(todoId)
        .then(todo => res.send(todo))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Cannot get todo")
        })
})


//* REMOVE
app.delete('/api/todo/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove todo')
    // const { todoId } = req.params
    const todoId = req.params.id
    todoService.remove(todoId,loggedinUser)
        .then(() => res.send(`todo ${todoId} removed successfully!`))
        .catch(err => {
            loggerService.error('Cannot remove todo', err)
            res.status(500).send('Cannot remove todo')
        })
})

// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



// const port = 3040
// app.listen(port, () =>
//     loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
// )

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    // loggerService.info(`Server is running on http://localhost:${PORT}`)
})

// "dev": "set PORT=3030&nodemon --ignore \"./data\" server.js",
