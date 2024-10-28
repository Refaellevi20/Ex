import '../assets/img/todo.png'

export function TodoPreview({ todo, onToggleTodo }) {
    return (
        <article className="todo-preview">
            <h2 className={(todo.isDone)? 'done' : ''} onClick={onToggleTodo}>
                Todo: {todo.txt}
            </h2>
            <h4>Todo Importance: {todo.importance}</h4>
            {/* <img src={`../assets/img/${'todo'}.png`} alt="todo image" /> */}
            <img src={`https://robohash.org/${todo._id}`}/>
            
            {/* <img src={`https://unsplash.org/
${todo._id}`} alt="Todo Image" /> */}
            {/* <img src={`https://unsplash.org/${todo._id}`} /> */}

            {/* <img src="https://picsum.photos/200/200?random=2" alt="Random Image 5" /> */}
            {/* <img src={`https://placekitten.com/${todo._id}`} alt="" /> */}

                        {/* <img src={`../assets/img/${'todo'}.png`} alt="vv" /> */}
            {/* <img src={`../assets/img/`} alt="" /> */}
        </article>
    )
}
