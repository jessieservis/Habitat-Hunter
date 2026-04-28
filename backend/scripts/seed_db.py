"""Script to seed the database with initial mock data for species"""

from sqlmodel import Session
from app.config.database import engine
from app.models.species import Species


def seed_animals():
    mock_data = [
        Species(
            species_id="red-panda",
            name="Red Panda",
            location="China",
            clues=[
                "I have a highly specialized diet, but I am technically classified as a carnivore.",
                "I possess an extended wrist bone that functions like a 'false thumb' to help me grip stalks.",
                "My thick, ringed tail helps me balance in trees and acts as a built-in blanket in the cold.",
                "Despite my name, I am not closely related to the famous black-and-white bear that shares my diet.",
                "I have rust-colored fur and spend most of my time in the high-altitude bamboo forests of the Himalayas and southwestern regions.",
            ],
            conservation_info="Endangered. The global population has declined by 50% over the last 20 years. Primary threats include severe habitat fragmentation due to logging and agriculture, as well as poaching for the illegal pet trade. Conservation efforts focus on creating protected forest corridors.",
        ),
        Species(
            species_id="snow-leopard",
            name="Snow Leopard",
            location="Mongolia",
            clues=[
                "My exceptionally large paws act as natural snowshoes to distribute my weight on soft ground.",
                "Unlike many of my close relatives, the physical structure of my vocal cords means I cannot roar.",
                "I am perfectly adapted to harsh, rugged alpine climates and can leap up to 50 feet across ravines.",
                "My smoky-gray coat is covered in dark rosettes, providing perfect camouflage against rocky mountain slopes.",
                "I am famously known as the 'Ghost of the Mountains' in the high ranges of Central and South Asia.",
            ],
            conservation_info="Vulnerable. An estimated 4,000 to 6,500 remain in the wild. Threats include retaliatory killings by herders protecting livestock, poaching for bones and fur, and climate change warming their alpine habitats.",
        ),
        Species(
            species_id="galapagos-penguin",
            name="Galapagos Penguin",
            location="Ecuador",
            clues=[
                "I am the second smallest species of my kind in the world.",
                "To escape the intense heat of my environment, I nest in caves and crevices made of volcanic rock.",
                "I rely heavily on the cold, nutrient-rich waters brought by the Cromwell Current to survive.",
                "I am an anomaly among my family, as I do not live in an icy, polar environment.",
                "I am the only species of my kind found exclusively north of the equator.",
            ],
            conservation_info="Endangered. Less than 2,000 individuals remain. They are highly susceptible to climate change and severe El Niño events, which disrupt their marine food web and lead to widespread starvation.",
        ),
        Species(
            species_id="sumatran-orangutan",
            name="Sumatran Orangutan",
            location="Indonesia",
            clues=[
                "I am highly intelligent and have been observed using sticks to extract honey and insects from tree bark.",
                "I am almost exclusively arboreal, rarely coming down from the forest canopy.",
                "When mature, males of my species develop distinctive, wide, fleshy cheek pads.",
                "My name translates to 'person of the forest' in the local language.",
                "I am a critically endangered great ape with reddish-orange hair, found only on one specific island.",
            ],
            conservation_info="Critically endangered. Massive population drops are driven by illegal logging and widespread deforestation for palm oil plantations, leaving populations trapped and isolated in fragmented forest patches.",
        ),
        Species(
            species_id="axolotl",
            name="Axolotl",
            location="Mexico",
            clues=[
                "I am an amphibian, but I exhibit neoteny, meaning I never undergo metamorphosis.",
                "I am studied extensively by scientists because of my incredible ability to regenerate limbs, spinal cords, and even my heart.",
                "I breathe through large, feathery external gills that protrude from the sides of my head.",
                "While popular in captivity, my wild population is nearly extinct due to heavy urbanization.",
                "I am natively found in only one specific place on Earth: the high-altitude lake complex of Xochimilco.",
            ],
            conservation_info="Critically endangered. Wild populations are nearly extinct due to the heavy urbanization of the surrounding city, severe water pollution, and the introduction of invasive predatory fish like tilapia and carp that eat their young.",
        ),
    ]

    with Session(engine) as session:
        for animal in mock_data:
            # Check if exists to avoid crashing if you run the script twice
            existing = session.get(Species, animal.species_id)
            if not existing:
                session.add(animal)

        session.commit()
        print("Database seeded with mock species.")


if __name__ == "__main__":
    seed_animals()
