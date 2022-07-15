import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AddPage from './components/AddPage'
import LearnPage from './components/LearnPage'
import * as Random from '@dwidge/lib/random'

const now = 60
const listPairsA = [
	{ id: 1, front: 'fronta', back: 'backa', views: [{ date: now, next: now + 30 }] },
	{ id: 2, front: 'frontb', back: 'backb', views: [{ date: now, next: now + 50 }] },
]
const listPairsB = [
	{ id: 1, front: 'fronta', back: 'backa', views: [] },
	{ id: 2, front: 'frontb', back: 'backb', views: [] },
	{ id: 3, front: 'frontc', back: 'backc', views: [] },
]

beforeEach(async () => {
	jest.spyOn(Random, 'uuid').mockImplementationOnce(() => 1)
		.mockImplementationOnce(() => 2)
		.mockImplementationOnce(() => 3)
})
afterEach(() => {
	jest.restoreAllMocks()
})

describe('extract text', () => {
	beforeEach(async () => {
		const listPairs = [listPairsA, () => {}]

		render(<AddPage listPairs={listPairs} now={now + 60} onImport={0} onExport={0} />)
	})

	it('splits text into word list', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Frontd? "fronte," frontf. ?',
		)
		userEvent.click(screen.getByTestId('buttonExtractWords'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontd', 'fronte', 'frontf'])
	})

	it('splits text into character list', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'受欢迎的? "受欢迎的," 受欢迎的!',
		)
		userEvent.click(screen.getByTestId('buttonExtractHan'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['受', '欢', '的', '迎'])
	})

	it('does nothing with word list', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Frontd? "fronte," frontf. ?',
		)
		userEvent.click(screen.getByTestId('buttonExtractWords'))
		userEvent.click(screen.getByTestId('buttonExtractWords'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontd', 'fronte', 'frontf'])
	})

	it.skip('extracts unique words', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Frontd? "fronte," frontf. Frontd frontF: frontf?',
		)
		userEvent.click(screen.getByTestId('buttonExtractWords'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontd', 'fronte', 'frontf'])
	})

	it.skip('extracts unknown words', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Fronta? "frontb," frontc.',
		)
		userEvent.click(screen.getByTestId('buttonExtractWords'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontc'])
	})
})

describe('submit front/back words', () => {
	it('disallows mismatched words', async () => {
		const setlistPairs = jest.fn()
		const listPairs = [[], setlistPairs]
		render(<AddPage listPairs={listPairs} now={now + 60} />)

		await userEvent.type(
			screen.getByTestId('front'),
			['fronta', 'frontb', 'frontc'].join('\n'),
		)
		await userEvent.type(
			screen.getByTestId('back'),
			['backa', 'backb'].join('\n'),
		)
		userEvent.click(screen.getByTestId('addButton'))

		expect(screen.getByTestId('front').textContent).toEqual(['fronta', 'frontb', 'frontc'].join('\n'))
		expect(screen.getByTestId('back').textContent).toEqual(['backa', 'backb'].join('\n'))
		expect(setlistPairs).not.toHaveBeenCalled()
	})

	it('matches front words to back words', async () => {
		const setlistPairs = jest.fn()
		const listPairs = [[], setlistPairs]
		render(<AddPage listPairs={listPairs} now={now + 60} />)

		await userEvent.type(
			screen.getByTestId('front'),
			['fronta', 'frontb', 'frontc'].join('\n'),
		)
		await userEvent.type(
			screen.getByTestId('back'),
			['backa', 'backb', 'backc'].join('\n'),
		)
		userEvent.click(screen.getByTestId('addButton'))

		expect(screen.getByTestId('front').textContent).toEqual('')
		expect(screen.getByTestId('back').textContent).toEqual('')
		expect(setlistPairs).toHaveBeenCalledWith(listPairsB)
	})

	it('ignores known pairs', async () => {
		const setlistPairs = jest.fn()
		const listPairs = [listPairsB, setlistPairs]
		render(<AddPage listPairs={listPairs} now={now + 60} />)

		await userEvent.type(
			screen.getByTestId('front'),
			['fronta', 'frontb', 'frontc'].join('\n'),
		)
		await userEvent.type(
			screen.getByTestId('back'),
			['backa', 'backb', 'backc'].join('\n'),
		)
		userEvent.click(screen.getByTestId('addButton'))

		expect(screen.getByTestId('front').textContent).toEqual('')
		expect(screen.getByTestId('back').textContent).toEqual('')
		expect(setlistPairs).toHaveBeenCalledWith(listPairsB)
	})
})

describe('database', () => {
	const Test = () => {
		const listPairs = useState([])

		return <AddPage listPairs={listPairs} now={now + 60} onImport={0} onExport={0} />
	}

	beforeEach(async () => {
		render(<Test />)
	})

	it.skip('imports file', () => {
		userEvent.click(screen.getByTestId('importButton'))
	})
})

describe('LearnPage', () => {
	const Test = () => {
		const listPairs = useState(listPairsA)

		return <LearnPage listPairs={listPairs} now={now + 60} />
	}

	beforeEach(async () => {
		render(<Test />)
	})

	it('shows front of 1st pair', () => {
		expect(screen.getByTestId('front').textContent).toEqual('fronta')
		expect(screen.queryByTestId('back')).not.toBeInTheDocument()
	})

	it('shows back of 1st pair when button clicked', () => {
		userEvent.click(screen.getByTestId('buttonShow'))
		expect(screen.getByTestId('back').textContent).toEqual('backa')
	})

	it('shows front of 2nd pair', () => {
		userEvent.click(screen.getByTestId('buttonShow'))
		userEvent.click(screen.getByTestId('buttonX1'))
		expect(screen.getByTestId('front').textContent).toEqual('frontb')
		expect(screen.queryByTestId('back')).not.toBeInTheDocument()
	})

	it('shows 3 buttons', () => {
		userEvent.click(screen.getByTestId('buttonShow'))
		expect(screen.getByTestId('buttonX0').textContent).toEqual('5s')
		expect(screen.getByTestId('buttonX1').textContent).toEqual('1m')
		expect(screen.getByTestId('buttonX2').textContent).toEqual('1d')
	})
})
