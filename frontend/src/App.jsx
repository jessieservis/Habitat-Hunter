import { useState } from 'react'
import StartScreen from './components/StartScreen'
import ActiveRound from './components/ActiveRound'
import RoundResult from './components/RoundResult'
import AuthScreen from './components/AuthScreen'
import { logout } from './services/api'

function App() {
	// Check if user is logged in
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!localStorage.getItem('token'),
	)
	const [currentScreen, setCurrentScreen] = useState('start')
	const [resultData, setResultData] = useState(null)

	const handleLogout = () => {
		logout()
		setIsAuthenticated(false)
		setCurrentScreen('start')
	}

	const handleStartGame = () => setCurrentScreen('playing')

	const handleGuessResult = (result) => {
		setResultData(result)
		setCurrentScreen('result')
	}

	const handleNextRound = () => setCurrentScreen('playing')

	if (!isAuthenticated) {
		return <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />
	}

	return (
		<div className='relative min-h-screen bg-[#0a2e1f] font-sans'>
			{/* Optional: A simple logout button layered over the game screens */}
			<button
				onClick={handleLogout}
				className='absolute top-4 right-4 z-50 px-4 py-2 rounded-lg bg-[#0d1f16]/60 backdrop-blur-md border border-[#4ecdc4]/20 text-[#a8e6cf] hover:text-[#ffd93d] text-sm transition-colors'
				style={{ fontFamily: "'DM Sans', sans-serif" }}
			>
				Sign Out
			</button>

			{currentScreen === 'start' && <StartScreen onStart={handleStartGame} />}
			{currentScreen === 'playing' && (
				<ActiveRound onGuessResult={handleGuessResult} />
			)}
			{currentScreen === 'result' && (
				<RoundResult
					result={resultData}
					onNextRound={handleNextRound}
				/>
			)}
		</div>
	)
}

export default App
