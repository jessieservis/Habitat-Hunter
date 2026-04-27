import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lightbulb, Send, Plus, AlertCircle } from 'lucide-react'
import { startNewRound, getNextClue, submitGuess } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function ActiveRound() {
	const navigate = useNavigate()
	const [guess, setGuess] = useState('')
	const [clues, setClues] = useState([])
	const [loading, setLoading] = useState(true)
	const [guessLoading, setGuessLoading] = useState(false)
	const [error, setError] = useState('')
	const [clueCount, setClueCount] = useState(0)
	const totalClues = 5

	useEffect(() => {
		const initRound = async () => {
			const result = await startNewRound()
			if (result.success) {
				setClues([result.clue])
				setClueCount(result.clueNumber)
			} else {
				setError('Failed to start round. Check your connection.')
			}
			setLoading(false)
		}
		initRound()
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (guess.trim() && !guessLoading) {
			setGuessLoading(true)
			const result = await submitGuess(guess)
			if (result.success) {
				Maps('/result', { state: { result } })
			} else {
				setError('Failed to submit guess. Try again.')
				setGuessLoading(false)
			}
		}
	}

	const handleGetClue = async () => {
		setLoading(true)
		const result = await getNextClue()
		if (result.success) {
			setClues((prev) => [...prev, result.clue])
			setClueCount(result.clueNumber)
		} else {
			setError(result.message)
		}
		setLoading(false)
	}

	const canGetMoreClues = clueCount < totalClues

	return (
		<div className='relative min-h-screen flex items-center justify-center overflow-hidden p-6'>
			{/* Background */}
			<div className='absolute inset-0 bg-gradient-to-br from-[#0a2e1f] via-[#1a4d2e] to-[#0d1f16]' />

			{/* Grain texture */}
			<div
				className='absolute inset-0 opacity-[0.03] mix-blend-overlay'
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
					backgroundRepeat: 'repeat',
				}}
			/>

			{/* Ambient glow */}
			<motion.div
				className='absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-[#ffd93d] opacity-10 blur-[140px]'
				animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
				transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
			/>

			{/* Main content container */}
			<div className='relative z-10 w-full max-w-3xl'>
				{/* Header with clue counter */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center mb-8'
				>
					<div className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a4d2e]/60 backdrop-blur-sm border border-[#4ecdc4]/20'>
						<Lightbulb className='w-5 h-5 text-[#ffd93d]' />
						<span
							className='text-[#a8e6cf]'
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: '1rem',
								fontWeight: 500,
							}}
						>
							{loading && clues.length === 0
								? 'Loading Habitat...'
								: `Clue ${clueCount} of ${totalClues}`}
						</span>
					</div>
				</motion.div>

				{error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='mb-6 p-4 rounded-xl bg-[#ff6b35]/20 border border-[#ff6b35]/40 flex items-center gap-3'
					>
						<AlertCircle className='w-5 h-5 text-[#ff6b35]' />
						<p className='text-[#ff6b35] font-medium'>{error}</p>
					</motion.div>
				)}

				{/* Clues list */}
				<div className='mb-8 space-y-4'>
					<AnimatePresence mode='popLayout'>
						{clues.map((clue, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -30, scale: 0.95 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className='relative p-6 rounded-2xl bg-gradient-to-br from-[#235a38]/40 to-[#1a4d2e]/40 backdrop-blur-md border border-[#4ecdc4]/20'
								style={{
									boxShadow:
										'0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(78, 205, 196, 0.1)',
								}}
							>
								<div
									className='absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c61] flex items-center justify-center border-2 border-[#0a2e1f]'
									style={{
										fontFamily: "'Fredoka', sans-serif",
										fontSize: '0.9rem',
										fontWeight: 600,
										color: '#fff',
										boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
									}}
								>
									{index + 1}
								</div>
								<p
									className='text-[#e8f5e9] leading-relaxed'
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: '1.15rem',
									}}
								>
									{clue}
								</p>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* Get next clue button */}
				{canGetMoreClues && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='mb-6 flex justify-center'
					>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleGetClue}
							disabled={loading}
							className='flex items-center gap-2 px-6 py-3 rounded-xl bg-[#235a38]/60 backdrop-blur-sm border border-[#ffd93d]/30 text-[#ffd93d] disabled:opacity-50 disabled:cursor-not-allowed'
							style={{
								fontFamily: "'Fredoka', sans-serif",
								fontSize: '1rem',
								fontWeight: 600,
								boxShadow: '0 4px 20px rgba(255, 217, 61, 0.2)',
							}}
						>
							<Plus className='w-5 h-5' />
							{loading ? 'Fetching...' : 'Get Another Clue'}
						</motion.button>
					</motion.div>
				)}

				{/* Guess form */}
				<motion.form
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					onSubmit={handleSubmit}
					className='relative'
				>
					<div className='relative flex gap-3'>
						<div className='flex-1 relative'>
							<input
								type='text'
								value={guess}
								onChange={(e) => setGuess(e.target.value)}
								placeholder='Where does this animal live?'
								disabled={guessLoading}
								className='w-full px-6 py-5 rounded-2xl bg-[#1a4d2e]/60 backdrop-blur-md border-2 border-[#4ecdc4]/30 text-[#e8f5e9] placeholder:text-[#6b9080] focus:border-[#4ecdc4] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all'
								style={{
									fontFamily: "'DM Sans', sans-serif",
									fontSize: '1.1rem',
									boxShadow:
										'0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(78, 205, 196, 0.1)',
								}}
							/>
						</div>
						<motion.button
							type='submit'
							disabled={guessLoading || !guess.trim()}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className='px-8 py-5 rounded-2xl bg-gradient-to-br from-[#4ecdc4] to-[#44a89e] text-[#0a2e1f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
							style={{
								fontFamily: "'Fredoka', sans-serif",
								fontSize: '1.1rem',
								fontWeight: 600,
								boxShadow: '0 8px 32px rgba(78, 205, 196, 0.4)',
							}}
						>
							<Send className='w-5 h-5' />
							{guessLoading ? '...' : 'Guess'}
						</motion.button>
					</div>
				</motion.form>

				{/* Helpful hint */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.6 }}
					transition={{ delay: 0.5 }}
					className='mt-6 text-center text-[#6b9080]'
					style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem' }}
				>
					💡 Fewer clues = Higher score
				</motion.p>
			</div>
		</div>
	)
}
