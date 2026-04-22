import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function StartScreen({ onStart }) {
  return (
		<div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
			{/* Organic background with gradient and texture */}
			<div className='absolute inset-0 bg-gradient-to-br from-[#0a2e1f] via-[#1a4d2e] to-[#0d1f16]' />

			{/* Animated grain texture overlay */}
			<div
				className='absolute inset-0 opacity-[0.03] mix-blend-overlay'
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
					backgroundRepeat: 'repeat',
				}}
			/>

			{/* Glowing orbs floating in background */}
			<motion.div
				className='absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ff6b35] opacity-10 blur-[100px]'
				animate={{
					x: [0, 30, 0],
					y: [0, -40, 0],
					scale: [1, 1.1, 1],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				className='absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#4ecdc4] opacity-10 blur-[120px]'
				animate={{
					x: [0, -40, 0],
					y: [0, 30, 0],
					scale: [1, 1.15, 1],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>

			{/* Main content */}
			<div className='relative z-10 text-center px-6 max-w-2xl'>
				{/* Decorative leaf elements */}
				<motion.div
					initial={{ opacity: 0, rotate: -20 }}
					animate={{ opacity: 0.3, rotate: 0 }}
					transition={{ duration: 1.2, delay: 0.2 }}
					className='absolute -top-16 -left-16 text-[#4ecdc4] text-8xl'
				>
					🌿
				</motion.div>
				<motion.div
					initial={{ opacity: 0, rotate: 20 }}
					animate={{ opacity: 0.3, rotate: 0 }}
					transition={{ duration: 1.2, delay: 0.4 }}
					className='absolute -top-12 -right-12 text-[#ff6b35] text-7xl'
				>
					🍃
				</motion.div>

				{/* Title */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				>
					<h1
						className='mb-4 tracking-tight'
						style={{
							fontFamily: "'Fredoka', sans-serif",
							fontSize: 'clamp(3rem, 8vw, 5.5rem)',
							fontWeight: 700,
							background:
								'linear-gradient(135deg, #4ecdc4 0%, #ff6b35 50%, #ffd93d 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							lineHeight: 1.1,
							textShadow: '0 0 40px rgba(78, 205, 196, 0.3)',
						}}
					>
						Habitat Hunter
					</h1>
				</motion.div>

				{/* Subtitle */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.5 }}
					className='text-[#a8e6cf] mb-12 tracking-wide'
					style={{
						fontFamily: "'DM Sans', sans-serif",
						fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
						fontWeight: 400,
						letterSpacing: '0.05em',
					}}
				>
					Guess where animals live based on mysterious clues
				</motion.p>

				{/* Start button */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.7 }}
					whileHover={{ scale: 1.05, y: -2 }}
					whileTap={{ scale: 0.98 }}
					onClick={onStart}
					className='group relative px-12 py-5 rounded-2xl overflow-hidden'
					style={{
						fontFamily: "'Fredoka', sans-serif",
						fontSize: '1.3rem',
						fontWeight: 600,
						background: 'linear-gradient(135deg, #4ecdc4 0%, #44a89e 100%)',
						boxShadow:
							'0 10px 40px rgba(78, 205, 196, 0.3), 0 0 80px rgba(78, 205, 196, 0.1)',
						color: '#0a2e1f',
					}}
				>
					<motion.div
						className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20'
						initial={{ x: '-100%' }}
						whileHover={{ x: '100%' }}
						transition={{ duration: 0.6 }}
					/>
					<span className='relative flex items-center gap-2'>
						<Sparkles className='w-5 h-5' />
						Start Game
					</span>
				</motion.button>

				{/* Floating hint text */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.5 }}
					transition={{ duration: 1, delay: 1.2 }}
					className='mt-8 text-[#6b9080] text-sm'
					style={{ fontFamily: "'DM Sans', sans-serif" }}
				>
					Use clues wisely • Earn more points with fewer hints
				</motion.p>
			</div>

			{/* Bottom decorative elements */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 0.15, y: 0 }}
				transition={{ duration: 1.5, delay: 0.8 }}
				className='absolute bottom-0 left-0 right-0 text-center text-8xl pb-8'
			>
				🌍
			</motion.div>
		</div>
	)
}
