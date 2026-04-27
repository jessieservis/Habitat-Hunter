import { useState } from 'react'
import { login, register } from '../services/api'

export default function AuthScreen({ onAuthSuccess }) {
	const [isLoginMode, setIsLoginMode] = useState(true)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			if (isLoginMode) {
				const result = await login(username, password)
				if (result.success) {
					onAuthSuccess()
				} else {
					setError(result.message)
				}
			} else {
				const result = await register(username, password)
				if (result.success) {
					await login(username, password)
					onAuthSuccess()
				} else {
					setError(result.message)
				}
			}
		} catch (err) {
			setError('A network error occurred. Is your backend running?')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
			<div className='w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl'>
				<div className='text-center'>
					<h2 className='text-3xl font-extrabold text-gray-900'>
						{isLoginMode ? 'Welcome Back' : 'Create Account'}
					</h2>
					<p className='mt-2 text-sm text-gray-600'>
						{isLoginMode
							? 'Sign in to continue hunting'
							: 'Join the Habitat Hunter community'}
					</p>
				</div>

				{error && (
					<div
						className='p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200'
						role='alert'
					>
						{error}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-5'
				>
					<div>
						<input
							type='text'
							placeholder='Username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							minLength={3}
							className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors duration-200'
						/>
					</div>
					<div>
						<input
							type='password'
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={6}
							className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors duration-200'
						/>
					</div>
					<button
						type='submit'
						disabled={loading}
						className='w-full py-3 px-4 font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md'
					>
						{loading ? 'Processing...' : isLoginMode ? 'Login' : 'Register'}
					</button>
				</form>

				<div className='text-center mt-6'>
					<button
						onClick={() => setIsLoginMode(!isLoginMode)}
						className='text-sm font-semibold text-green-600 hover:text-green-500 hover:underline transition-colors focus:outline-none'
					>
						{isLoginMode
							? "Don't have an account? Register here."
							: 'Already have an account? Login here.'}
					</button>
				</div>
			</div>
		</div>
	)
}
