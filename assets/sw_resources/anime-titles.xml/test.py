import tvdb_v4_official
import os
from dotenv import load_dotenv

load_dotenv()
TVDB_KEY = os.getenv("TVDB_KEY")
tvdb = tvdb_v4_official.TVDB(TVDB_KEY)

movie = tvdb.get_movie_extended(31)
characters = []
for c in movie["characters"]:
    characters.append(c)

person = tvdb.get_person_extended(characters[0]["peopleId"])
print(person)
