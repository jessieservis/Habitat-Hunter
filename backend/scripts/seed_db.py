"""Script to seed the database with initial mock data for species"""

from sqlmodel import Session
from app.config.database import engine
from app.models.species import Species

# Import the decoupled data
from scripts.species_data import MOCK_SPECIES


def seed_animals():
    with Session(engine) as session:
        for animal_data in MOCK_SPECIES:
            # Check if exists to avoid crashing if you run the script twice
            existing = session.get(Species, animal_data["species_id"])
            if not existing:
                # Unpack the dictionary into the Species model
                animal = Species(**animal_data)
                session.add(animal)

        session.commit()
        print(f"Database seeded with {len(MOCK_SPECIES)} species.")


if __name__ == "__main__":
    seed_animals()
