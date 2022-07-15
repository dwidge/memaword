import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { transpose, last, dropIfIncluded, onlyHan, unique } from '@dwidge/lib/array'
import { printSecondsRounded } from '@dwidge/lib/date'
import { uuid } from '@dwidge/lib/random'
import { wordsOfString } from '@dwidge/lib/words'
import { onChange } from '@dwidge/lib-react/helpers'

const AddPairs = ({ listPairs, now }) => {
	const [pairs, setpairs] = listPairs
	const [frontWords, setfrontWords] = useState('')
	const [backWords, setbackWords] = useState('')
	const textareaFront = useRef()

	const onExtractWords = () => {
		setfrontWords(wordsOfString(frontWords).sort().join('\n'))
	}

	const onExtractHan = () => {
		const [...chars] = frontWords
		const han = unique(onlyHan(chars)).sort()

		setfrontWords(han.join('\n'))
	}

	const onCopyToClipboard = (e) => {
		textareaFront.current.select()
		document.execCommand('copy')
		e.target.focus()
	}

	const onClear = () => {
		if (window.confirm('Clear database?')) { setpairs([]) }
	}

	const onAddPairs = () => {
		const frontWordsA = frontWords.split('\n').filter(s => s)
		const backWordsA = backWords.split('\n').filter(s => s)

		if (frontWordsA.length !== backWordsA.length) { return }

		const isSamePair = (a, b) =>
			a.front === b.front && a.back === b.back

		const newpairs = transpose([frontWordsA, backWordsA]).map(([front, back]) => ({ id: uuid(), front, back, views: [] }))

		const unseenpairs = dropIfIncluded(newpairs, pairs, isSamePair)

		setpairs(pairs.concat(unseenpairs))
		setfrontWords('')
		setbackWords('')
	}

	return (
		<div>
			<h3>Front</h3>
			<p>Add source words or phrases here, one per line, or paste text document and Extract unknown words from the text.</p>
			<textarea ref={textareaFront} value={frontWords} onChange={onChange(setfrontWords)} data-testid="front"></textarea>
			<button onClick={onExtractWords} data-testid="buttonExtractWords">Words</button>
			<button onClick={onExtractHan} data-testid="buttonExtractHan">Han</button>
			<button onClick={onCopyToClipboard} data-testid="copyButton">Copy</button>
			<h3>Back</h3>
			<p>Add words to learn here. They match up to front words on each line. Or copy the front words to a translator, then paste translated here.</p>
			<textarea value={backWords} onChange={onChange(setbackWords)} data-testid="back"></textarea>
			<button onClick={onAddPairs} data-testid="addButton">Add</button>
			<ul data-testid="pairsList">{pairs.map(({ id, front, back, views }) =>
				(<li key={id}>
					<pair-front>{front}</pair-front> = <pair-back>{back}</pair-back> / review in <pair-next>{last(views) ? printSecondsRounded((last(views).next) - now) : 'future'}</pair-next>
				</li>),
			)}</ul>
			<button data-testid="buttonClear" onClick={onClear}>Clear</button>
		</div>
	)
}

AddPairs.propTypes = {
	listPairs: PropTypes.array.isRequired,
	now: PropTypes.number.isRequired,
}

export default AddPairs
