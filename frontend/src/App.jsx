import { useState } from 'react'
import StartScreen from './components/StartScreen'
import ActiveRound from './components/ActiveRound'
import RoundResult from './components/RoundResult'
import AuthScreen from './components/AuthScreen' // Import the new Auth screen
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

	// Traffic Cop Logic
	if (!isAuthenticated) {
		return <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />
	}

	return (
		<div className='min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col'>
			<header className='bg-white shadow-sm border-b border-gray-200'>
				<div className='max-w-5xl mx-auto px-4 h-16 flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<span className='text-2xl font-black text-green-700 tracking-tight'>
							Habitat
						</span>
						<span className='text-2xl font-light text-gray-500 tracking-tight'>
							Hunter
						</span>
					</div>
					<button
						onClick={handleLogout}
						className='text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors'
					>
						Sign Out
					</button>
				</div>
			</header>

			<main className='flex-1 max-w-5xl mx-auto w-full px-4 py-8'>
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
			</main>
		</div>
	)
}

export default App
