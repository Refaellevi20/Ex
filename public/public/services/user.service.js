import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    updateScore,
    getEmptyCredentials,
    update,
    addActivity
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}


function updateScore(diff) {
    const loggedInUserId = getLoggedinUser()._id
    return userService.getById(loggedInUserId)
        .then(user => {
            // if (user.score + diff < 0) return Promise.reject('No credit')
            user.score += diff
            return storageService.put(STORAGE_KEY, user)
        })
        .then(user => {
            _setLoggedinUser(user)
            return user.score
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname, score: 10000,activities: [new Date ],  prefs: {color: 'black', bgColor: 'white'} }
    user.createdAt = user.updatedAt = Date.now()
    user.score = 10000
    // user. activities = [{ txt: 'Added a Todo', at: 1523873242735 }] || []

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, score: user.score,activities: user.activities }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}

function update(user) {
    return storageService.put(STORAGE_KEY, user)
        .then(updatedUser => {
            if (getLoggedinUser()._id === updatedUser._id) {
                _setLoggedinUser(updatedUser)
            }
            return updatedUser
            // return _saveUser(user)

        })
}

function addActivity(txt) {
    const activity = {
        txt,
        at: Date.now()
    }
    const loggedInUser = getLoggedinUser()
    if (!loggedInUser) return Promise.reject('No loggedin user')
    return getById(loggedInUser._id)
        .then(user => {
            if (!user.activities) user.activities = []
            user.activities.unshift(activity)
            return _saveUser(user)
        })
}

function _saveUser(user) {
    return storageService.put(STORAGE_KEY, user)
        .then((user) => {
            _setLoggedinUser(user)
            return user
        })
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }