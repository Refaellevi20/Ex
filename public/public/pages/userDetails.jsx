const { useState, useEffect } = React
const { Link, useParams, useNavigate } = ReactRouterDOM
const { useSelector, } = ReactRedux

import { todoService } from '../services/todo.service.js'
import { TodoList } from '../cmps/TodoList.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { ActivityList } from '../cmps/ActivityList.jsx'
import { utilService } from '../services/util.service.js'


export function UserDetails() {
    const { userId } = useParams()
    const [user, setUser] = useState(null)
    const [userTodos, setUserTodos] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()
    // const loggedInUser = userService.getLoggedinUser()
    // const [userToEdit, setUserToEdit] = useState(null)
    const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)

    useEffect(() => {
        if (loggedInUser) loadUser()
        else navigate('/')
        // loadUser()
        loadUserTodos()
    }, [userId,loggedInUser])

    function loadUser( ) {
        userService.getById(userId).then(chooseUser  => {
            console.log(chooseUser)
            setUser(chooseUser )
        }).catch(err => {
            console.error('Error  user:', err)
            showErrorMsg('Cannot  user details')
        })
    }

    function loadUserTodos() {
        todoService.query({ creator: userId }).then(todos => {
            const doneTodos = todos.filter(todo => todo.isDone)
            setUserTodos(doneTodos)
        }).catch(err => {
            console.error('Error fetching todos:', err)
            showErrorMsg('Cannot fetch todos')
        })
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setUser({ ...user, [name]: value })
    }

    function handlePrefChange(ev) {
        const { name, value } = ev.target
        setUser({ ...user, prefs: { ...user.prefs, [name]: value } })
    }

    function saveUser() {
        userService.update(user)
            .then(updatedUser => {
                setUser(updatedUser)
                showSuccessMsg('User details updated')
                setIsEditing(false)
            })
            .catch(err => {
                console.error('Error updating user:', err)
                showErrorMsg('Cannot update user details')
            })
    }

    if (!user) return <div>Loading...</div>

    const userP = user.prefs || { color: 'black', bgColor: 'white' }
    // const userAct = user.activitie [{ txt: 'Added a Todo', at: Date.now() }]

    function getActivityTime(activity) {
        const { at } = activity
        return utilService.getFormattedTime(at)
    }

    if (!loggedInUser || !user) return <div>'no user</div>
    const { activities = [] } = user
    console.log(activities);

    return (
        <div>
            <h1 style={{ color: userP.color, backgroundColor: userP.bgColor }}>{user.fullname}'s Profile</h1>
            {loggedInUser && loggedInUser._id === user._id && (
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            )}
            {isEditing ? (
                <div>
                    <label>
                        Fullname:
                        <input type="text" name="fullname" value={user.fullname} onChange={handleChange} />
                    </label>
                    <label>
                        Text Color:
                        <input type="color" name="color" value={userP.color} onChange={handlePrefChange} />
                    </label>
                    <label>
                        Background Color:
                        <input type="color" name="bgColor" value={userP.bgColor} onChange={handlePrefChange} />
                    </label>
                    <button onClick={saveUser}>Save</button>
                </div>
            ) : (
                <div>
                    <h2>Preferences</h2>
                    <p>Text Color: {userP.color}</p>
                    <p>Background Color: {userP.bgColor}</p>
                </div>
            )}
            <h2>Todos Created by {user.fullname} = all the dons here</h2>
            <TodoList todos={userTodos} showActions={false} onToggleTodo={() => { }} onRemoveTodo={() => { }} />
            <h2>Activities</h2>

            <ActivityList
                activities={activities}
                getActivityTime={getActivityTime}
            />
        </div>
    )
}
