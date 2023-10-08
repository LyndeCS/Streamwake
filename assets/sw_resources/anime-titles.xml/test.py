import tvdb_v4_official
import os
from dotenv import load_dotenv

load_dotenv()
TVDB_KEY = os.getenv("TVDB_KEY")
tvdb = tvdb_v4_official.TVDB(TVDB_KEY)

results = tvdb.search("demon slayer", type="series")
for result in results:
    for key, val in result.items():
        print(key, "->", val, "\n")
