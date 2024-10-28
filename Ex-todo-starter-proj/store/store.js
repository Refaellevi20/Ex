import { userService } from "../services/user.service.js"

const { createStore } = Redux

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE_BY = 'CHANGE_BY'

// todo
export const SET_TODOS = 'SET_Todos'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_IS_LOADING = 'SET_IS_LOADING'

// User
export const SET_USER = 'SET_USER'
export const SET_USER_SCORE = 'SET_USER_SCORE'

// Shopping todo
export const TOGGLE_todoT_IS_SHOWN = 'TOGGLE_todoT_IS_SHOWN'
export const ADD_todo_TO_todoT = 'ADD_todo_TO_todoT'
export const REMOVE_todo_FROM_todoT = 'REMOVE_todo_FROM_todoT'
export const CLEAR_todoT = 'CLEAR_todoT'


const initialState = {
    count: 101,
    todos: [],
    score: 10000,
    isLoading: false,
}

function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        //* Count
        case INCREMENT:
            return { ...state, count: state.count + 1 }
        case DECREMENT:
            return { ...state, count: state.count - 1 }
        case CHANGE_BY:
            return { ...state, count: state.count + cmd.diff }
        //! TODO
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
        //! User
        case SET_USER:
            return {
                ...state,
                loggedInUser: cmd.user
            }

        case SET_USER_SCORE:
            const loggedInUser = { ...state.loggedInUser, score: cmd.score }
            return { ...state, loggedInUser }

        default:
            return state
    }
}


export const store = createStore(appReducer)
console.log('store:', store)

window.gStore = store
