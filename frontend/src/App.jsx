import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import StartScreen from './components/StartScreen'
import ActiveRound from './components/ActiveRound'
import RoundResult from './components/RoundResult'
import AuthScreen from './components/AuthScreen'
import { logout } from './services/api'

// Security wrapper that forces unauthenticated users back to login
const ProtectedRoute = ({ children }) => {
	return localStorage.getItem('token') ? (
		children
	) : (
		<Navigate
			to='/login'
			replace
		/>
	)
}

export default function App() {
	const handleLogout = () => {
		logout()
		window.location.href = '/login' // Hard redirect clears memory
	}

	return (
		<Router>
			<div className='relative min-h-screen bg-[#0a2e1f] font-sans'>
				{localStorage.getItem('token') && (
					<button
						onClick={handleLogout}
						className='absolute top-4 right-4 z-50 px-4 py-2 rounded-lg bg-[#0d1f16]/60 backdrop-blur-md border border-[#4ecdc4]/20 text-[#a8e6cf] hover:text-[#ffd93d] text-sm transition-colors'
					>
						Sign Out
					</button>
				)}

				<Routes>
					<Route
						path='/login'
						element={<AuthScreen />}
					/>
					<Route
						path='/'
						element={
							<ProtectedRoute>
								<StartScreen />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/play'
						element={
							<ProtectedRoute>
								<ActiveRound />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/result'
						element={
							<ProtectedRoute>
								<RoundResult />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</div>
		</Router>
	)
}
