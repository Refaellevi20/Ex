import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'



export const todoService = {
    query,
    getById,
    remove,
    save
}

const todos = utilService.readJsonFile('data/todo.json')
const PAGE_SIZE = 3

//!definition of new RegExp
//*Use Regex for searching words/phrases in text.
//* Use Simple Comparison for checking numbers.
//* This approach helps you efficiently filter data based on its type
//* in filterBy.severity it is very simple so that is why i do not need => new RegExp

//~ i could active here  getDefaultFilter⬇️ as a pointer
function query(filterBy = { txt: '', severity: 0, labels: [] }, sortBy = { type: '' , dir: 1 }) {
    let todosToReturn = todos

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        todosToReturn = todosToReturn.filter(todo => regex.test(todo.title))
    }
    if (filterBy.severity) {
        todosToReturn = todosToReturn.filter(todo => todo.severity >= filterBy.severity)
    }
    if (filterBy.description) {
        const regex = new RegExp(filterBy.description, 'i')
        todosToReturn = todosToReturn.filter(todo => regex.test(todo.description))
    }
    if (filterBy.labels.length > 0) {
        const regex = new RegExp(filterBy.labels, 'i')
        //^ or to use with else if
        //* promise only Array becouse it is only an Array the label
        //* with no Array isArray he doesnot know what to look for so
        //* runtime errors when the variable might be of a different type (e.g., undefined, null, or an object)
        //! safe belt
        todosToReturn = todosToReturn.filter(todo => Array.isArray(todo.labels) && todo.labels.some(label => regex.test(label)))
    }

    //*SortBy
    if (sortBy.type === 'createdAt') {
        todos.sort((a, b) => (+sortBy.dir) * (a.createdAt - b.createdAt))
    } else if (sortBy.type === 'severity') {
        todos.sort((a, b) => (+sortBy.dir) * (a.severity - b.severity))
    } else if (sortBy.type === 'title') {
        todos.sort((a, b) => {
            const titleA = a.title || ''
            const titleB = b.title || ''
            return sortBy.dir * titleA.localeCompare(titleB)
        })
    }
    // else {
    //     todos.sort((a, b) => sortBy.dir * (a[sortBy.type] - b[sortBy.type]))
    // }

    if (filterBy.pageIdx !== undefined) {
        const pageIdx = +filterBy.pageIdx
        const startIdx = pageIdx * PAGE_SIZE
        todosToReturn = todosToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    //! or 
    // if (filterBy.pageIdx !== undefined) {

    //     const startIdx = +filterBy.pageIdx * PAGE_SIZE // 0,3,6
    //     todos = todos.slice(startIdx, startIdx + PAGE_SIZE)
    // }

    return Promise.resolve(todosToReturn)
}

//! or this way
// function query(filterBy) {
//     return Promise.resolve(todos)
//         .then(todos => {
//             if (filterBy.txt) {
//                 const regex = new RegExp(filterBy.txt, 'i')
//                 todosToReturn = todosToReturn.filter(todo => regex.test(todo.title))
//             }
//             return todos
//         })
// }



// function query() {
//     return Promise.resolve(todos)
// }

function getById(todoId) {
    const todo = todos.find(todo => todo._id === todoId)
    if (!todo) return Promise.reject('Cannot find todo', todoId)
    return Promise.resolve(todo)
}

//*SortBy
//  if (sortBy.type === 'createdAt') {
//     todos.sort((a, b) => (+sortBy.dir) * (a.createdAt - b.createdAt))
// } else if (sortBy.type === 'severity') {
//     todos.sort((a, b) => (+sortBy.dir) * (a.severity - b.severity))
// }


function remove(todoId,loggedInUser) {
    const todoIdx = todos.findIndex(todo => todo._id === todoId)
    if (todoIdx < 0) return Promise.reject('Cannot find todo', todoId)
        const todo = todos[todoIdx]
    if (!loggedInUser.isAdmin &&
        todo.creator._id !== loggedInUser._id) {
        return Promise.reject('Not your todo')
    }
    todos.splice(todoIdx, 1)
    return _savetodosToFile()
}

function save(todoToSave,loggedInUser) {
    if (todoToSave._id) {
        const todoIdx = todos.findIndex(todo => todo._id === todoToSave._id)
        todos[todoIdx] = { ...todos[todoIdx], ...todoToSave }
        if (!loggedInUser.isAdmin &&
            todoToUpdate.creator._id !== loggedInUser._id) {
            return Promise.reject('Not your todo')
        }
    } else {
        todoToSave._id = utilService.makeId()
        todoToSave.createdAt = Date.now()
        todoToSave.creator = loggedInUser
        todoToSave.labels = todoToSave.labels?.length ? todoToSave.labels : ['no label']
        todos.unshift(todoToSave)
    }

    return _savetodosToFile().then(() => todoToSave)
}


function _savetodosToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(todos, null, 4)
        fs.writeFile('data/todo.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to todos file', err)
                return reject(err)
            }
            console.log('The file was saved!yup yap')
            resolve()
        })
    })
}