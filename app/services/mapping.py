import plotly.express as px
import pandas as pd
import base64


def generate_comparison_map(guessed_country: str, actual_country: str) -> str:
    """
    Generates a choropleth map comparing the guessed location to the actual location.
    Returns the map as a Base64 encoded PNG string.
    """
    # 1. Handle correct vs. incorrect guesses
    if guessed_country.lower() == actual_country.lower():
        data = {"Country": [actual_country.title()], "Status": ["Correct Location"]}
    else:
        data = {
            "Country": [guessed_country.title(), actual_country.title()],
            "Status": ["Your Guess", "Actual Location"],
        }

    df = pd.DataFrame(data)

    # 2. Build the Plotly map
    fig = px.choropleth(
        df,
        locations="Country",
        locationmode="country names",
        color="Status",
        color_discrete_map={
            "Correct Location": "green",
            "Actual Location": "green",
            "Your Guess": "red",
        },
        title="Habitat Comparison",
        projection="natural earth",  # Gives the map a nice rounded globe look
    )

    # Customize the layout for a cleaner game UI look
    fig.update_layout(
        margin={"r": 0, "t": 40, "l": 0, "b": 0},
        geo=dict(showframe=False, showcoastlines=True),
    )

    # 3. Export to Base64 using Kaleido
    # This renders the figure to a PNG in memory, without writing to the hard drive
    img_bytes = fig.to_image(format="png", engine="kaleido")
    encoded_string = base64.b64encode(img_bytes).decode("utf-8")

    return encoded_string
