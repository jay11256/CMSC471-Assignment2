import json
import os

# Absolute paths to ensure consistency
base_dir = '/Users/jasonliu/CMSC471/CMSC471-Assignment2'
input_path = os.path.join(base_dir, 'data/processed_allegations.json')
output_path = os.path.join(base_dir, 'data/misleading_allegations.json')

print(f"Reading processed data from {input_path}...")

try:
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Cherry-picking: Only keep 2017 to 2020 to focus on the 2020 drop
    filtered_data = [d for d in data if d['year'] >= 2017]

    # Intentional transformation: Rename misconduct categories to positive-sounding metrics
    mapping = {
        "Abuse of Authority": "Public Order Efficiency",
        "Force": "Safety Optimization",
        "Discourtesy": "Community Directness",
        "Offensive Language": "Authentic Engagement"
    }

    misleading_data = []
    for d in filtered_data:
        new_d = {"year": d['year']}
        for old_key, new_key in mapping.items():
            new_d[new_key] = d.get(old_key, 0)
        misleading_data.append(new_d)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(misleading_data, f, indent=2)

    print(f"Successfully processed {len(misleading_data)} years of misleading data.")
    print(f"Misleading data saved to {output_path}")

except Exception as e:
    print(f"Error processing misleading data: {e}")
