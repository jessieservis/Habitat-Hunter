import { motion } from 'motion/react';
import { Trophy, MapPin, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom'

export default function RoundResult() {
	const navigate = useNavigate()
	const routeLocation = useLocation()
	const result = routeLocation.state?.result

	// If they try to manually type /result without playing, kick them to the start screen
	if (!result)
		return (
			<Navigate
				to='/'
				replace
			/>
		)
	const {
		correct,
		speciesName,
		location,
		conservationStatus,
		population,
		threats,
		mapImage,
		cluesUsed,
		score,
	} = result

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

			{/* Success/Failure ambient glow */}
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1.5, opacity: correct ? 0.15 : 0.08 }}
				transition={{ duration: 1.2, ease: 'easeOut' }}
				className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] ${
					correct ? 'bg-[#4ecdc4]' : 'bg-[#ff6b35]'
				}`}
			/>

			{/* Main content */}
			<div className='relative z-10 w-full max-w-2xl text-center'>
				{/* Result icon and message */}
				<motion.div
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{
						type: 'spring',
						stiffness: 200,
						damping: 15,
						delay: 0.2,
					}}
					className='mb-8'
				>
					{correct ? (
						<div className='flex flex-col items-center gap-4'>
							<motion.div
								animate={{
									scale: [1, 1.1, 1],
									rotate: [0, 5, -5, 0],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							>
								<CheckCircle
									className='w-24 h-24 text-[#4ecdc4]'
									strokeWidth={1.5}
								/>
							</motion.div>
							<h2
								className='text-[#4ecdc4]'
								style={{
									fontFamily: "'Fredoka', sans-serif",
									fontSize: 'clamp(2rem, 5vw, 3rem)',
									fontWeight: 700,
								}}
							>
								Correct! 🎉
							</h2>
						</div>
					) : (
						<div className='flex flex-col items-center gap-4'>
							<XCircle
								className='w-24 h-24 text-[#ff6b35]'
								strokeWidth={1.5}
							/>
							<h2
								className='text-[#ff6b35]'
								style={{
									fontFamily: "'Fredoka', sans-serif",
									fontSize: 'clamp(2rem, 5vw, 3rem)',
									fontWeight: 700,
								}}
							>
								Not quite!
							</h2>
						</div>
					)}
				</motion.div>

				{/* Species and location reveal */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='mb-8'
				>
					<h3
						className='text-[#e8f5e9] mb-3'
						style={{
							fontFamily: "'Fredoka', sans-serif",
							fontSize: 'clamp(2rem, 4vw, 2.8rem)',
							fontWeight: 700,
							textShadow: '0 2px 20px rgba(78, 205, 196, 0.3)',
						}}
					>
						{speciesName}
					</h3>
					<div className='flex items-center justify-center gap-2 mb-4'>
						<MapPin className='w-5 h-5 text-[#ff6b35]' />
						<p
							className='text-[#a8e6cf]'
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: '1.3rem',
								fontWeight: 500,
							}}
						>
							{location}
						</p>
					</div>
				</motion.div>

				{/* Score display */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5 }}
					className='mb-8 flex justify-center gap-8'
				>
					<div className='flex flex-col items-center gap-2'>
						<div className='flex items-center gap-2 text-[#ffd93d]'>
							<Trophy className='w-6 h-6' />
							<span
								style={{
									fontFamily: "'Fredoka', sans-serif",
									fontSize: '2rem',
									fontWeight: 700,
								}}
							>
								{score}
							</span>
						</div>
						<span
							className='text-[#6b9080]'
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: '0.9rem',
							}}
						>
							Points
						</span>
					</div>

					<div className='w-px bg-[#4ecdc4]/20' />

					<div className='flex flex-col items-center gap-2'>
						<span
							className='text-[#a8e6cf]'
							style={{
								fontFamily: "'Fredoka', sans-serif",
								fontSize: '2rem',
								fontWeight: 700,
							}}
						>
							{cluesUsed}
						</span>
						<span
							className='text-[#6b9080]'
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: '0.9rem',
							}}
						>
							Clues Used
						</span>
					</div>
				</motion.div>

				{/* Conservation details */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className='mb-8 max-w-lg mx-auto'
				>
					<div
						className='p-6 rounded-2xl bg-[#235a38]/40 backdrop-blur-md border border-[#4ecdc4]/20 space-y-3'
						style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
					>
						<div>
							<span
								className='text-[#6b9080] text-sm'
								style={{ fontFamily: "'DM Sans', sans-serif" }}
							>
								Conservation Status:
							</span>
							<p
								className={`${conservationStatus.toLowerCase().includes('endangered') ? 'text-[#ff6b35]' : 'text-[#4ecdc4]'} font-semibold`}
								style={{
									fontFamily: "'Fredoka', sans-serif",
									fontSize: '1.1rem',
								}}
							>
								{conservationStatus}
							</p>
						</div>
					</div>
				</motion.div>

				{/* Map display */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className='mb-10'
				>
					<h4
						className='text-[#a8e6cf] mb-4 text-center'
						style={{
							fontFamily: "'Fredoka', sans-serif",
							fontSize: '1.3rem',
							fontWeight: 600,
						}}
					>
						Native Habitat Map
					</h4>

					<div
						className='relative rounded-2xl overflow-hidden border-2 border-[#4ecdc4]/30 max-w-4xl mx-auto'
						style={{
							boxShadow:
								'0 12px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(78, 205, 196, 0.1) inset',
						}}
					>
						<img
							src={mapImage}
							alt={`${speciesName} habitat map`}
							className='w-full h-auto'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-[#0a2e1f]/60 to-transparent' />
					</div>
				</motion.div>

				{/* Next animal button */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1 }}
					whileHover={{ scale: 1.05, y: -2 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => navigate('/play')}
					className='group relative px-10 py-5 rounded-2xl overflow-hidden'
					style={{
						fontFamily: "'Fredoka', sans-serif",
						fontSize: '1.2rem',
						fontWeight: 600,
						background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%)',
						boxShadow: '0 10px 40px rgba(255, 107, 53, 0.3)',
						color: '#fff',
					}}
				>
					<motion.div
						className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20'
						initial={{ x: '-100%' }}
						whileHover={{ x: '100%' }}
						transition={{ duration: 0.6 }}
					/>
					<span className='relative flex items-center gap-2'>
						<RotateCcw className='w-5 h-5' />
						Next Animal
					</span>
				</motion.button>
			</div>
		</div>
	)
}
