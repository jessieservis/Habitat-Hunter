"""Tests for the game services (guess evaluation, clue generation, etc)"""

from app.services.mapping import generate_comparison_map
from app.services.score import calculate_score, evaluate_guess


def test_calculate_score_applies_clue_penalty_and_floor():
    # Tests that the score is calculated correctly based on clues used and correctness
    assert calculate_score(True, 0) == 1000
    assert calculate_score(True, 3) == 400
    assert calculate_score(True, 6) == 100
    assert calculate_score(False, 3) == 0


def test_evaluate_guess_normalizes_inputs():
    # Tests that evaluate_guess correctly normalizes and evaluates a guess
    is_correct, score, cleaned_guess, cleaned_location = evaluate_guess(
        "  TestLand  ",
        "testland",
        2,
    )

    assert is_correct is True
    assert score == 600
    assert cleaned_guess == "testland"
    assert cleaned_location == "testland"


def test_generate_comparison_map_rejects_blank_input():
    # Tests that generate_comparison_map raises an error if the guessed country is blank
    try:
        generate_comparison_map("", "testland")
    except ValueError as exc:
        assert str(exc) == "guessed_country cannot be empty"
    else:
        raise AssertionError("Expected generate_comparison_map to reject blank input")
