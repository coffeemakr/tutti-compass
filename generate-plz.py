import requests

#r = requests.get("https://swisspost.opendatasoft.com/api/v2/catalog/datasets/plz_verzeichnis_v2/exports/csv", stream=True)
#r.raise_for_status()

import csv
import json


csv.field_size_limit(1000000)

result = {}
with open('plz.csv', newline='') as csvfile:
	reader = csv.reader(csvfile, delimiter=';')
	first = True
	for row in reader:
		if first:
			first = False
			continue
		plz = row[4].strip()
		name = row[7].strip()
		canton = row[9].strip()
		point = row[17]
		if point:
			point = tuple(map(float, point.split(', ')))
		else:
			point = None
		if name.endswith(canton):
			name = name[:-len(canton)].strip()
		name += ' (' + canton + ')'
		
		if plz in result:
			existing = result[plz]
			if existing['point'] is not None or point is None:
				continue
			
		result[plz] = {
			'name': name,
			'point': point,
		}
	

with open('plz.js', "w") as outfile:
	outfile.write('''
// This file is autogenerated.
const plz = 
''')
	json.dump(result, outfile)
