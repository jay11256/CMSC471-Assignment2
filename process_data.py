import csv
import json
import os
from collections import defaultdict

# Absolute paths to ensure consistency
base_dir = '/Users/jasonliu/CMSC471/CMSC471-Assignment2'
data_path = os.path.join(base_dir, 'data/allegations.csv')
output_path = os.path.join(base_dir, 'data/processed_allegations.json')

# Dictionary structure: { year: { category_outcome: count } }
results = defaultdict(lambda: defaultdict(int))

print(f"Processing granular White Hat data from {data_path}...")

fado_types = ["Abuse of Authority", "Force", "Discourtesy", "Offensive Language"]

try:
    with open(data_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            year = row.get('year_received')
            fado_type = row.get('fado_type')
            disposition = row.get('board_disposition', '')
            
            if year and fado_type in fado_types:
                year_clean = year.strip('"')
                if year_clean.isdigit():
                    # Outcome categorization: Substantiated vs Dismissed/Other
                    is_substantiated = disposition.lower().startswith('substantiated')
                    outcome_suffix = "_Sub" if is_substantiated else "_Dis"
                    
                    key = fado_type + outcome_suffix
                    results[year_clean][key] += 1

    # Convert to a list of objects sorted by year
    final_data = []
    years = sorted(results.keys(), key=int)

    # Define the 8 keys explicitly
    all_keys = []
    for ft in fado_types:
        all_keys.append(ft + "_Sub")
        all_keys.append(ft + "_Dis")

    for year in years:
        entry = {"year": int(year)}
        for key in all_keys:
            entry[key] = results[year].get(key, 0)
        final_data.append(entry)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2)

    print(f"Successfully processed {len(final_data)} years of granular data.")
    print(f"Data saved to {output_path}")

except Exception as e:
    print(f"Error processing granular data: {e}")
