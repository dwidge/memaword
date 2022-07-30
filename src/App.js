import React, { useState, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	NavLink,
} from 'react-router-dom'
import { Storage } from '@dwidge/lib-react'

import AddPage from './components/AddPage'
import LearnPage from './components/LearnPage'
import ListPage from './components/ListPage'
import './App.css'
const { useStorage } = Storage(useState, useEffect)

const App = () => {
	const listPairs = useStorage('pairs', [])
	const [getnow, setnow] = useState(Date.now())

	useEffect(() => {
		const to = setInterval(() => setnow(Date.now() / 1000 | 0), 2000)
		return () => clearTimeout(to)
	}, [])

	return (
		<Router basename="/memaword">
			<nav>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/add'>Add</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/learn'>Learn</NavLink>
				<NavLink className={({ isActive }) => isActive ? 'link-active' : 'link'} to='/list'>List</NavLink>
			</nav>
			<div>
				<Routes>
					<Route path='/add' element={<AddPage listPairs={listPairs} now={getnow} />} />
					<Route path='/learn' element={<LearnPage listPairs={listPairs} now={getnow} />}/>
					<Route path='/list' element={<ListPage listPairs={listPairs} now={getnow} />}/>
				</Routes>
			</div>
		</Router>
	)
}

export default App
