import json

# Load the JSON data from 'anime-titles.json'
with open('anime-titles.json', 'r') as json_file:
    data = json.load(json_file)

# Extract and filter the values
official_english_titles_with_aid = {}  # Use a dictionary to store titles with their @aid values
for anime in data['animetitles']['anime']:
    aid = anime.get('@aid')
    for title in anime['title']:
        if isinstance(title, dict) and title.get('@type') == 'official' and title.get('@xml:lang') == 'en':
            title_text = title.get('#text')
            if aid and title_text:
                official_english_titles_with_aid[aid] = title_text

# Sort the official English titles alphabetically
sorted_titles = sorted(official_english_titles_with_aid.items(), key=lambda x: x[1])

# Display the sorted titles with their @aid values
for aid, title in sorted_titles:
    print(f"AID: {aid}, Title: {title}")

# Save the selected official English titles with their @aid values to a new file
with open('official_english_titles_with_aid.txt', 'w') as file:
    for aid, title in sorted_titles:
        file.write(f"{aid}, {title}\n")

print('Official English titles with @aid values saved to official_english_titles_with_aid.txt (sorted)')
