import xmltodict
import json

# Replace 'your_input.xml' with the path to your XML file
xml_file_path = 'anime-titles.xml'

# Replace 'output.json' with the desired JSON output file path
json_file_path = 'anime-titles.json'

# Specify the character encoding (e.g., 'utf-8')
encoding = 'utf-8'

with open(xml_file_path, 'r', encoding=encoding) as xml_file:
    xml_data = xml_file.read()
    json_data = json.dumps(xmltodict.parse(xml_data), indent=4)

with open(json_file_path, 'w') as json_file:
    json_file.write(json_data)

print(f'Conversion completed. JSON data saved to {json_file_path}')
