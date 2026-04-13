import csv
import json
import os
from collections import Counter

# Absolute paths
base_dir = '/Users/jasonliu/CMSC471/CMSC471-Assignment2'
data_path = os.path.join(base_dir, 'data/allegations.csv')
output_path = os.path.join(base_dir, 'data/race_complaints.json')

print(f"Processing race distribution from {data_path}...")

counts = Counter()

try:
    with open(data_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            race = row.get('mos_ethnicity')
            if race:
                counts[race] += 1

    # Convert to sorted list of objects
    # Sorting by complaints descending makes the disparity more visually striking (Black Hat)
    final_data = [{"ethnicity": k, "complaints": v} for k, v in counts.items()]
    final_data.sort(key=lambda x: x['complaints'], reverse=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2)

    print(f"Successfully processed {len(final_data)} ethnic categories.")
    print(f"Race complaints data saved to {output_path}")

except Exception as e:
    print(f"Error: {e}")
