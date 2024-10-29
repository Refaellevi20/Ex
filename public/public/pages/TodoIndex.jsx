import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo,removeTodoOptimistic } from '../store/actions/todo.actions.js'
import { TodoSort } from "../cmps/SortBy.jsx"
import { utilService } from "../services/util.service.js"
// import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"

const { useState, useEffect,useRef } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function TodoIndex({onSetFilterBy}) {
    const [sortBy, setSortBy] = useState({ type: '', dir: 1 })

    // const [todos, setTodos] = useState(null)

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const todos = useSelector(storeState => storeState.todoModule.todos)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    const [filterBy, setFilterBy] = useState(defaultFilter)
    // const filterBy = useSelector(storeState => storeState.carModule.filterBy)
    // const debouncedFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))
    // const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500)).current

    const dispatch = useDispatch()

    // setSearchParams(filterBy)

    useEffect(() => {
        loadTodos(filterBy,sortBy)
        .then(() => {
            setSearchParams(filterBy)
        })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load todos')
            })
    }, [filterBy,setSearchParams,sortBy])

    function onRemoveTodo(todoId) {
        if (confirm('Sure you want to delete?')) {
        // removeTodo(todoId)
        removeTodoOptimistic(todoId)
            .then(() => showSuccessMsg(`Todo removed`)) 
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
        }
    }

    useEffect(() => {
        if (todos.length === 0 && filterBy.pageIdx > 0) {
            setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: 0 }))
        }
    }, [todos, filterBy.pageIdx])

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        
        let nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0) {
            nextPageIdx = 0
        }

        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: nextPageIdx }))
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            pageIdx: filterBy.pageIdx === undefined ? 0 : undefined
        }))
    }


    // function onSetSort(newSortBy) {
    //     setSortBy(newSortBy)
    // }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then((savedTodo) => showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`))    
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo.id)
            })
    }

    // useEffect(() => {
    //     console.log("Filter changed:", filterBy)
    //     debouncedSetFilterBy(filterBy)
    // }, [filterBy,debouncedSetFilterBy])

    //! global but no need 
    // function onSetFilterBy(filterBy) {
    //     dispatch({ type: SET_FILTER_BY, filterBy })
    // }

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={setFilterBy} sortBy={sortBy} onSetSort={setSortBy}/>
            {/* <TodoSort onSetSort={onSetSort} sortBy={sortBy} className="bug-sort" /> */}
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <div className="pagination">
                    <button onClick={() => onChangePage(-1)} className="pagination-button">-</button>
                    <span className="pagination-info">{filterBy.pageIdx + 1 || 'No Pagination'}</span>
                    <button onClick={() => onChangePage(1)} className="pagination-button">+</button>
                    <button onClick={onTogglePagination} className="toggle-pagination-button">Toggle Pagination</button>
                </div>
            <h2>Todos List</h2>
            {isLoading
                ? <p>Loading...</p>
                : <TodoList todos={todos}
                    onRemoveTodo={onRemoveTodo}
                    onToggleTodo={onToggleTodo}
                />
            }
            <hr />

            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}