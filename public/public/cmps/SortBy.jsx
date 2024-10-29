const { useState, useEffect } = React

import './home.scss'
export function TodoSort({ onSetSort, sortBy }) {
	const [sortByToEdit, setSortByToEdit] = useState({ ...sortBy })

	useEffect(() => {
		onSetSort(sortByToEdit)
	}, [sortByToEdit,onSetSort])

	function handleChange({ target }) {
		const field = target.name
		const value = target.value

		if (field === 'dir')
			setSortByToEdit(prevSort => ({
				...prevSort,
				dir: -prevSort.dir,
			}))
		else
			setSortByToEdit(prevSort => ({
				...prevSort,
				[field]: value,
			}))
	}

	return (
		<form className="bug-sort">
			<label htmlFor="sortType" className="sort-label">Sort By:</label>
			<select
				className="sort-type"
				name="type"
				id="sortType"
				value={sortByToEdit.type}
				onChange={handleChange}
			>
				<option value="">---</option>
				<option value="txt">txt</option>
				<option value="createdAt">createdAt</option>
				<option value="importance">importance</option>
			</select>
			
			<div className="sort-direction">
				<label className="sort-checkbox">
					<input 
						type="checkbox" 
						name="dir" 
						checked={sortByToEdit.dir === -1} 
						onChange={handleChange} 
					/>
					Descending
				</label>
			</div>
		</form>
	)
}


