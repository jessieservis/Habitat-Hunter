const API_BASE_URL = 'http://127.0.0.1:8000'

// Store session state locally in memory
let gameId = null
let roundId = null
let currentClueNumber = 0

// Helper function to easily grab the token for our requests
function getAuthHeader() {
	const token = localStorage.getItem('token')
	return token ? { Authorization: `Bearer ${token}` } : {}
}

// --- AUTHENTICATION ROUTES ---

export async function register(username, password) {
	const res = await fetch(`${API_BASE_URL}/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password }),
	})

	if (!res.ok) {
		const error = await res.json()
		return { success: false, message: error.detail || 'Registration failed' }
	}
	return { success: true }
}

export async function login(username, password) {
	// OAuth2 requires form-urlencoded data, not standard JSON
	const params = new URLSearchParams()
	params.append('username', username)
	params.append('password', password)

	const res = await fetch(`${API_BASE_URL}/auth/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params,
	})

	if (!res.ok) {
		return { success: false, message: 'Invalid username or password' }
	}

	const data = await res.json()
	localStorage.setItem('token', data.access_token) // Save the token!
	return { success: true }
}

export function logout() {
	localStorage.removeItem('token')
	gameId = null
	roundId = null
}

// --- GAME ROUTES ---

export async function startNewRound() {
	try {
		if (!gameId) {
			const gameRes = await fetch(`${API_BASE_URL}/game`, {
				method: 'POST',
				headers: getAuthHeader(), // Attach token
			})
			if (!gameRes.ok) return { success: false }
			const gameData = await gameRes.json()
			gameId = gameData.game_id // Match your backend's exact response key
		}

		const roundRes = await fetch(`${API_BASE_URL}/game/${gameId}/round`, {
			method: 'POST',
			headers: getAuthHeader(), // Attach token
		})
		if (!roundRes.ok) return { success: false }

		const roundData = await roundRes.json()
		roundId = roundData.round_id
		currentClueNumber = 0

		return await getNextClue()
	} catch (error) {
		console.error('Failed to start round:', error)
		return { success: false }
	}
}

export async function getNextClue() {
	try {
		const res = await fetch(`${API_BASE_URL}/game/${gameId}/${roundId}/clue`, {
			headers: getAuthHeader(), // Attach token
		})
		if (!res.ok) return { success: false, message: 'No more clues available' }

		const data = await res.json()
		currentClueNumber++

		return {
			success: true,
			clue: data.clue,
			clueNumber: currentClueNumber,
			totalClues: 5,
		}
	} catch (error) {
		return { success: false }
	}
}

export async function submitGuess(guess) {
	try {
		const formData = new FormData()
		formData.append('guess', guess)

		const res = await fetch(`${API_BASE_URL}/game/${gameId}/${roundId}/guess`, {
			method: 'POST',
			headers: getAuthHeader(), // Attach token (DO NOT set Content-Type manually when using FormData)
			body: formData,
		})

		if (!res.ok) return { success: false }
		const data = await res.json()

		return {
			success: true,
			correct: data.correct,
			speciesName: data.species_name,
			location: data.location,
			conservationStatus: data.conservation_info,
			population: 'See status above',
			threats: 'See status above',
			mapImage: `data:image/png;base64,${data.map_image}`,
			cluesUsed: data.clues_used,
			score: data.score,
		}
	} catch (error) {
		return { success: false }
	}
}
