import json
import os

base = 'D:/MasterMCQ'
missing = []

for s in os.listdir(base):
    if os.path.isdir(os.path.join(base, s)) and os.path.exists(os.path.join(base, s, s+'_cache.json')):
        with open(os.path.join(base, s, s+'_cache.json'), encoding='utf-8') as f:
            data = json.load(f)
            for idx, q in enumerate(data):
                exp_en = q.get('explanation', {}).get('en', '')
                if not exp_en or 'This option best answers' in exp_en:
                    a_text = next((o['text'] for o in q['options'] if o['letter'] == q['correctAnswer']), '')
                    missing.append({
                        'subject': s,
                        'idx': idx,
                        'q': q['question']['en'],
                        'a': a_text
                    })

with open('missing.json', 'w', encoding='utf-8') as f:
    json.dump(missing, f, indent=2, ensure_ascii=False)
