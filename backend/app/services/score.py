"""Scoring helpers for Habitat Hunter."""


BASE_SCORE = 1000
CLUE_PENALTY = 200
MINIMUM_SCORE = 100


def normalize_location(value: str) -> str:
    # Normalize free-text location input for comparison
    cleaned = value.strip().lower()
    if not cleaned:
        raise ValueError("Location cannot be empty")
    return cleaned


def calculate_score(
	is_correct: bool,
	clues_used: int,
	*,
	base_score: int = BASE_SCORE,
	clue_penalty: int = CLUE_PENALTY,
	minimum_score: int = MINIMUM_SCORE,
) -> int:
    # Calculate the final score for a guess
    if clues_used < 0:
        raise ValueError("clues_used cannot be negative")

    if not is_correct:
        return 0

    return max(minimum_score, base_score - (clues_used * clue_penalty))


def evaluate_guess(
	guess: str, actual_location: str, clues_used: int
) -> tuple[bool, int, str, str]:
    # Normalize and compare a guess against the actual location
    normalized_guess = normalize_location(guess)
    normalized_location = normalize_location(actual_location)
    is_correct = normalized_guess == normalized_location
    score = calculate_score(is_correct, clues_used)
    return is_correct, score, normalized_guess, normalized_location
