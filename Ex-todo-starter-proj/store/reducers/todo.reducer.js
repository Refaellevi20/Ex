import { todoService } from "../../services/todo.service.js"
// import { userService } from "../services/user.service.js"

// const { createStore } = Redux

// todo
export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_IS_LOADING = 'SET_IS_LOADING'

// Shopping todo
export const TOGGLE_todoT_IS_SHOWN = 'TOGGLE_todoT_IS_SHOWN'
export const REMOVE_todo_FROM_todoT = 'REMOVE_todo_FROM_todoT'
export const CLEAR_todoT = 'CLEAR_todoT'
export const REMOVE_TODO_UNDO = 'REMOVE_CAR_UNDO'
export const SET_FILTER_BY = 'SET_FILTER_BY'


const initialState = {
    todos: [],
    score: 10000,
    isLoading: false,
    // filterBy: todoService.getDefaultFilter(),
}

export function todoReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return {
                ...state,
                todos: cmd.todos
            }
        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId)
            }
            case REMOVE_TODO_UNDO:
                return {
                    ...state,
                    cars: [...state.prevCars]
                }
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, cmd.todo]
            }
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: cmd.isLoading
            }
        default:return state
    }
}
