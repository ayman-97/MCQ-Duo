import json
import os
import re

def natural_sort_key(s, _nsre=re.compile('([0-9]+)')):
    return [int(text) if text.isdigit() else text.lower() for text in _nsre.split(s)]

with open('D:/MasterMCQ/MCQ-App/src/data/db.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

base_dir = "D:/MasterMCQ"

subject_data = {}

for key, levels in db['subjects'].items():
    if " - " in key:
        parts = key.split(" - ", 1)
        base_subject = parts[0]
        section = parts[1]
    else:
        base_subject = key
        section = key
        
    if base_subject not in subject_data:
        subject_data[base_subject] = {}
        
    subject_data[base_subject][section] = []
    for level in levels:
        for q in level:
            subject_data[base_subject][section].append({
                "question": q["question"],
                "options": q["options"],
                "correctAnswer": q["correctAnswer"],
                "explanation": q["explanation"]
            })

for subj, sections_dict in subject_data.items():
    cache_path = os.path.join(base_dir, subj, f"{subj}_cache.json")
    if os.path.isdir(os.path.join(base_dir, subj)):
        sorted_sections = sorted(sections_dict.keys(), key=natural_sort_key)
        
        all_qs = []
        for sec in sorted_sections:
            all_qs.extend(sections_dict[sec])
            
        print(f"Writing {cache_path} with {len(all_qs)} qs")
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(all_qs, f, ensure_ascii=False, indent=2)
