import { useState } from 'react'
import { motion } from 'motion/react'
import { login, register } from '../services/api'
import { Sparkles, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AuthScreen() {
	const navigate = useNavigate()
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
				if (result.success) Maps('/')
				else setError(result.message)
			} else {
				const result = await register(username, password)
				if (result.success) {
					await login(username, password)
					Maps('/')
				} else setError(result.message)
			}
		} catch (err) {
			setError('A network error occurred.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='relative min-h-screen flex items-center justify-center overflow-hidden p-6'>
			<div className='absolute inset-0 bg-gradient-to-br from-[#0a2e1f] via-[#1a4d2e] to-[#0d1f16]' />
			<div
				className='absolute inset-0 opacity-[0.03] mix-blend-overlay'
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
					backgroundRepeat: 'repeat',
				}}
			/>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='relative z-10 w-full max-w-md p-8 rounded-3xl bg-[#235a38]/40 backdrop-blur-md border border-[#4ecdc4]/20 shadow-2xl'
			>
				<div className='text-center mb-8'>
					<h2
						className='text-4xl font-bold text-[#4ecdc4] mb-2'
						style={{ fontFamily: "'Fredoka', sans-serif" }}
					>
						{isLoginMode ? 'Welcome Back' : 'Join the Hunt'}
					</h2>
					<p
						className='text-[#a8e6cf]'
						style={{ fontFamily: "'DM Sans', sans-serif" }}
					>
						{isLoginMode
							? 'Sign in to track habitats'
							: 'Create an account to begin'}
					</p>
				</div>

				{error && (
					<div className='mb-6 p-4 rounded-xl bg-[#ff6b35]/20 border border-[#ff6b35]/40 flex items-center gap-3'>
						<AlertCircle className='w-5 h-5 text-[#ff6b35]' />
						<p className='text-[#ff6b35] text-sm'>{error}</p>
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<input
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						minLength={3}
						className='w-full px-6 py-4 rounded-xl bg-[#0d1f16]/50 border border-[#4ecdc4]/20 text-[#e8f5e9] placeholder:text-[#6b9080] focus:border-[#4ecdc4] focus:outline-none transition-all'
						style={{ fontFamily: "'DM Sans', sans-serif" }}
					/>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={6}
						className='w-full px-6 py-4 rounded-xl bg-[#0d1f16]/50 border border-[#4ecdc4]/20 text-[#e8f5e9] placeholder:text-[#6b9080] focus:border-[#4ecdc4] focus:outline-none transition-all'
						style={{ fontFamily: "'DM Sans', sans-serif" }}
					/>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={loading}
						className='w-full py-4 mt-4 rounded-xl bg-gradient-to-br from-[#4ecdc4] to-[#44a89e] text-[#0a2e1f] font-bold flex justify-center items-center gap-2 disabled:opacity-50'
						style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem' }}
					>
						<Sparkles className='w-5 h-5' />
						{loading ? 'Processing...' : isLoginMode ? 'Login' : 'Register'}
					</motion.button>
				</form>

				<button
					onClick={() => setIsLoginMode(!isLoginMode)}
					className='w-full mt-6 text-[#a8e6cf] hover:text-[#ffd93d] transition-colors text-sm'
					style={{ fontFamily: "'DM Sans', sans-serif" }}
				>
					{isLoginMode
						? "Don't have an account? Register here"
						: 'Already have an account? Login here'}
				</button>
			</motion.div>
		</div>
	)
}
