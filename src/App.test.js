import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AddPage from './components/AddPage'
import LearnPage from './components/LearnPage'

const now = 60 * 1000
const listPairsInit = [
	{ id: 111, front: 'fronta', back: 'backa', views: [{ date: now, next: now + 30 * 1000 }] },
	{ id: 222, front: 'frontb', back: 'backb', views: [{ date: now, next: now + 50 * 1000 }] },
]
const getTag = (el, name) =>
	el.getElementsByTagName(name)[0]

describe('extract text', () => {
	const Test = () => {
		const listPairs = useState(listPairsInit)

		return <AddPage listPairs={listPairs} now={now + 60 * 1000} onImport={0} onExport={0} />
	}

	beforeEach(async () => {
		render(<Test />)
	})

	it('splits text into random word list', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Frontd? "fronte," frontf. ?',
		)
		userEvent.click(screen.getByTestId('extractButton'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontd', 'fronte', 'frontf'])
	})

	it('does nothing with word list', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Frontd? "fronte," frontf. ?',
		)
		userEvent.click(screen.getByTestId('extractButton'))
		userEvent.click(screen.getByTestId('extractButton'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontd', 'fronte', 'frontf'])
	})

	it.skip('extracts unique words', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Frontd? "fronte," frontf. Frontd frontF: frontf?',
		)
		userEvent.click(screen.getByTestId('extractButton'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontd', 'fronte', 'frontf'])
	})

	it.skip('extracts unknown words', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			'Fronta? "frontb," frontc.',
		)
		userEvent.click(screen.getByTestId('extractButton'))
		expect(screen.getByTestId('front').value.split('\n').sort()).toEqual(['frontc'])
	})
})

describe('submit front/back words', () => {
	const Test = () => {
		const listPairs = useState([])

		return <AddPage listPairs={listPairs} now={now + 60 * 1000} onImport={0} onExport={0} />
	}

	beforeEach(async () => {
		render(<Test />)
	})

	it('disallows mismatched words', async () => {
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
		expect([...screen.getByTestId('pairsList').children].map(c => getTag(c, 'pair-front').textContent)).toEqual([])
		expect([...screen.getByTestId('pairsList').children].map(c => getTag(c, 'pair-back').textContent)).toEqual([])
	})

	it('matches front words to back words', async () => {
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
		expect([...screen.getByTestId('pairsList').children].map(c => getTag(c, 'pair-front').textContent)).toEqual(['fronta', 'frontb', 'frontc'])
		expect([...screen.getByTestId('pairsList').children].map(c => getTag(c, 'pair-back').textContent)).toEqual(['backa', 'backb', 'backc'])
	})

	it('ignores known pairs', async () => {
		await userEvent.type(
			screen.getByTestId('front'),
			['fronta', 'frontb', 'frontc'].join('\n'),
		)
		await userEvent.type(
			screen.getByTestId('back'),
			['backa', 'backb', 'backc'].join('\n'),
		)
		userEvent.click(screen.getByTestId('addButton'))

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
		expect([...screen.getByTestId('pairsList').children].map(c => getTag(c, 'pair-front').textContent)).toEqual(['fronta', 'frontb', 'frontc'])
		expect([...screen.getByTestId('pairsList').children].map(c => getTag(c, 'pair-back').textContent)).toEqual(['backa', 'backb', 'backc'])
	})
})

describe('database', () => {
	// let setlistPairs
	// setlistPairs = jest.fn().mockName('setlistPairs')
	// expect(setlistPairsSpy).toHaveBeenCalledWith(listPairsUpdated)

	const Test = () => {
		const listPairs = useState([])

		return <AddPage listPairs={listPairs} now={now + 60 * 1000} onImport={0} onExport={0} />
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
		const listPairs = useState(listPairsInit)

		return <LearnPage listPairs={listPairs} now={now + 60 * 1000} />
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
		expect(screen.getByTestId('buttonX0').textContent).toEqual('1s')
		expect(screen.getByTestId('buttonX1').textContent).toEqual('1m')
		expect(screen.getByTestId('buttonX2').textContent).toEqual('1d')
	})
})
