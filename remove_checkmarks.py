import os
import json
import re

base_dir = "D:/MasterMCQ"

for subject in os.listdir(base_dir):
    subj_path = os.path.join(base_dir, subject)
    if os.path.isdir(subj_path) and subject not in ["MCQ-App", "mcq-app", ".git", ".next", "node_modules"]:
        cache_file = os.path.join(subj_path, f"{subject}_cache.json")
        if os.path.exists(cache_file):
            print(f"Cleaning {cache_file}...")
            with open(cache_file, "r", encoding="utf-8") as f:
                questions = json.load(f)
                
            modified = False
            for q in questions:
                for opt in q["options"]:
                    original_text = opt["text"]
                    # Remove checkmarks and specific strings
                    cleaned_text = re.sub(r'[✓✔]', '', original_text)
                    cleaned_text = re.sub(r'\s*\(Correct\)', '', cleaned_text, flags=re.IGNORECASE)
                    cleaned_text = re.sub(r'\s*\(Correct Answer\)', '', cleaned_text, flags=re.IGNORECASE)
                    cleaned_text = cleaned_text.strip()
                    
                    if cleaned_text != original_text:
                        opt["text"] = cleaned_text
                        modified = True
                        
            if modified:
                with open(cache_file, "w", encoding="utf-8") as f:
                    json.dump(questions, f, ensure_ascii=False, indent=2)
                print(f"  -> Saved changes for {subject}")
