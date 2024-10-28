const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux


import { logout } from "../store/actions/user.actions.js"
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg,showSuccessMsg } from '../services/event-bus.service.js'


export function AppHeader() {
    const navigate = useNavigate()
    // const [user, setUser] = useState(userService.getLoggedinUser())

    const user = useSelector(storeState => storeState.loggedInUser)
    const todos = useSelector(storeState => storeState.todos)

    function onLogout() {
        logout()
            .then(() => {
                showSuccessMsg('Bye Bye')
            })
            .catch((err) => {
                console.log('err:', err)
                showErrorMsg('OOPs try again')
            })
    }
    
    function todosProgressBar() {
        if (!todos || todos.length === 0) return '0%';

        const completedTodos = todos.filter(todo => todo.isDone).length;
        const progressPercentage = (completedTodos / todos.length) * 100;
        return `${progressPercentage}%`;
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user && (
                    <div className='Progress'>
                        <div className='Progress-bar' style={{ width: todosProgressBar() }}></div>
                    </div>
                )}
                {user ? (
                    < section >
                        <Link
                            to={`/user/${user._id}`}>Hello {user.fullname}
                            <span>${user.score ?
                                user.score.toLocaleString() : 'Loading...'}</span>
                        </Link>
                        <button onClick={onLogout}>Logout</button>
                        <NavLink to={`/user/${user._id}`} style={{ marginLeft: '20px' }}>Profile</NavLink>
                        </ section >
                ) : (
                    <section>
                        <LoginSignup /> 
                    </section>
                )}
                {/* <br /> */}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    {/* <NavLink to="/about" >About</NavLink> */}
                    <NavLink to="/todo" >Todos</NavLink>
                    {/* <NavLink to="/dashboard" >Dashboard</NavLink> */}
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
