import { todoService } from "../../services/todo.service.js" 
import { ADD_TODO,REMOVE_TODO, SET_TODOS, SET_IS_LOADING, UPDATE_TODO, REMOVE_TODO_UNDO} from "../reducers/todo.reducer.js"
import {store } from "../store.js"

export function loadTodos(filterBy,sortBy) {

    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    return todoService.query(filterBy,sortBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
        })
        .catch(err => {
            console.log('todo actions -> Cannot load todos:', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function removeTodo(todoId) {

    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })
        })
        // .then(() => addActivity('Removed the Todo: ' + todoId))
        .catch(err => {
            console.log('todo actions => Cannot remove todo:', err)
            throw err
        })
}

export function removeTodoOptimistic(todoId) {
    store.dispatch({ type: REMOVE_TODO, todoId })

    return todoService.remove(todoId)
        .catch(err => {
            store.dispatch({ type: REMOVE_TODO_UNDO, todoId })
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todo) {
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        .then(savedTodo => {
            store.dispatch({ type, todo: savedTodo })
            return savedTodo
        })
        // .then(res => {
        //     const actionName = (todo._id) ? 'Updated' : 'Added'
        //     return addActivity(`${actionName} a Todo: ` + todo.txt)
        //         .then(() => res)
        // })
        .catch(err => {
            console.log('todo actions => Cannot save todo:', err)
            throw err
        })
}