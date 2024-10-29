import { DetailsIcon,EditIcon,RemoveIcon } from "../lib/Icons.js"
import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, onRemoveTodo, onToggleTodo, showActions = true }) {
    return (
        <ul className="todo-list">
            {todos.map(todo => (
                <li key={todo._id} style={{ backgroundColor: todo.color, opacity: 0.9 }}>
                    <TodoPreview
                        todo={todo}
                        onToggleTodo={() => onToggleTodo(todo)}
                        showActions={showActions}
                    />
                    {showActions && (
                        <section>
                            <button onClick={() => onRemoveTodo(todo._id)}>
                                <RemoveIcon />
                            </button>
                            <button>
                                <Link to={`/todo/${todo._id}`}>
                                    <DetailsIcon />
                                </Link>
                            </button>
                            <button>
                                <Link to={`/todo/edit/${todo._id}`}>
                                    <EditIcon />
                                </Link>
                            </button>
                        </section>
                    )}
                </li>
            ))}
        </ul>
    )
}