import { userService } from "../../services/user.service.js" 
import { SET_USER, SET_USER_SCORE } from "../reducers/user.reducer.js"

import {store } from "../store.js"

export function login(credentials) {
    return userService.login(credentials)
        .then((user) => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch((err) => {
            console.log('user actions -> Cannot login', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then((user) => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch((err) => {
            console.log('user actions => Cannot signup', err)
            throw err
        })
}

export function logout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
            throw err
        })
}

export function addActivity(txt) {

    return userService.addActivity(txt)
        .then((updatedUser) => {
            store.dispatch({ type: SET_USER, user: updatedUser, })
        })
        .catch(err => {
            console.error('Cannot add activity:', err)
            throw err
        })

}

export function changeUserScore(diff) {
    return userService.updateScore(+diff)
        .then((newScore) => {
            store.dispatch({ type: SET_USER_SCORE, score: newScore })
            // const user = store.getState().loggedInUser
            // store.dispatch({ type: SET_USER, user: { ...user, score: newScore } })
            // return newScore
        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
            throw err
        })
}