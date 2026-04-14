import { useCallback, useState } from 'react'
import ActiveRound from './components/ActiveRound'
import RoundResult from './components/RoundResult'
import StartScreen from './components/StartScreen'
import { getNextClue, startNewRound, submitGuess } from './services/api'

const STAGES = {
	start: 'start',
	active: 'active',
	result: 'result',
}

function App() {
	const [stage, setStage] = useState(STAGES.start)
	const [round, setRound] = useState(null)
	const [result, setResult] = useState(null)
	const [loading, setLoading] = useState(false)

	const beginRound = useCallback(async () => {
		if (loading) {
			return
		}
		setLoading(true)
		const response = await startNewRound()
		setLoading(false)

		if (!response?.success) {
			return
		}

		setRound({
			currentClue: response.clue,
			clueNumber: response.clueNumber,
			totalClues: response.totalClues,
		})
		setResult(null)
		setStage(STAGES.active)
	}, [loading])

	const handleGetClue = useCallback(async () => {
		if (loading) {
			return null
		}
		setLoading(true)
		const response = await getNextClue()
		setLoading(false)

		if (!response?.success) {
			return null
		}

		setRound((prev) => ({
			...prev,
			currentClue: response.clue,
			clueNumber: response.clueNumber,
			totalClues: response.totalClues,
		}))

		return response.clue
	}, [loading])

	const handleGuess = useCallback(
		async (guess) => {
			if (loading) {
				return
			}
			setLoading(true)
			const response = await submitGuess(guess)
			setLoading(false)

			if (!response?.success) {
				return
			}

			setResult(response)
			setStage(STAGES.result)
		},
		[loading],
	)

	const handleNextRound = useCallback(async () => {
		await beginRound()
	}, [beginRound])

	return (
		<>
			{stage === STAGES.start && <StartScreen onStart={beginRound} />}
			{stage === STAGES.active && round && (
				<ActiveRound
					currentClue={round.currentClue}
					clueNumber={round.clueNumber}
					totalClues={round.totalClues}
					onGuess={handleGuess}
					onGetClue={handleGetClue}
					loading={loading}
				/>
			)}
			{stage === STAGES.result && result && (
				<RoundResult result={result} onNextRound={handleNextRound} />
			)}
		</>
	)
}

export default App
