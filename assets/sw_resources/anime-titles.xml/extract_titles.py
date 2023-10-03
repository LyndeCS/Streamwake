import json

# Load the JSON data from 'anime-titles.json'
with open('anime-titles.json', 'r') as json_file:
    data = json.load(json_file)

# Extract and filter the values
official_english_titles = []
for anime in data['animetitles']['anime']:
    for title in anime['title']:
        if isinstance(title, dict) and title.get('@type') == 'official' and title.get('@xml:lang') == 'en':
            official_english_titles.append(title.get('#text'))

# Sort the official English titles alphabetically
official_english_titles.sort()

# Save official English titles to a new file
with open('official_english_titles.txt', 'w') as file:
    for title in official_english_titles:
        file.write(title + '\n')

print('Official English titles saved to official_english_titles.txt')
