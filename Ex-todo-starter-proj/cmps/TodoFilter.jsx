import { TodoSort } from "./SortBy.jsx"

const { useState, useEffect } = React

export function TodoFilter({ filterBy, onSetFilterBy,sortBy,onSetSort,setSortBy  }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    // const [sortBy, setSortBy] = useState({ type: '', dir: 1 })

    //* n

    useEffect(() => {
        // Notify parent
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit,onSetFilterBy])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    // function onSetSort(newSortBy) {
    //     setSortBy(newSortBy)
    // }

    const { txt, importance,isDone  } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
                <input value={txt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input value={importance} onChange={handleChange}
                    type="number" placeholder="By Importance" id="importance" name="importance"
                />
                <label htmlFor="isDone">Is Done: </label>
                <select
                    value={isDone}
                    onChange={handleChange}
                    id="isDone"
                    name="isDone"
                >
                    <option value="">All</option>
                    <option value="true">Done</option>
                    <option value="false">Not Done</option>
                </select>
                <button hidden>Set Filter</button>
            </form>
            <TodoSort onSetSort={onSetSort} sortBy={sortBy} className="bug-sort" />

        </section>
    )
}