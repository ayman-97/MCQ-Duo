import os
import json
import time

try:
    import g4f
    from g4f.client import Client
    client = Client()
    G4F_AVAILABLE = True
except ImportError:
    G4F_AVAILABLE = False
    print("g4f not available, using generic explanations.")

base_dir = "D:/MasterMCQ"

for subject in os.listdir(base_dir):
    subj_path = os.path.join(base_dir, subject)
    if os.path.isdir(subj_path) and subject not in ["MCQ-App", "mcq-app", ".git", ".next", "node_modules"]:
        cache_file = os.path.join(subj_path, f"{subject}_cache.json")
        if os.path.exists(cache_file):
            with open(cache_file, "r", encoding="utf-8") as f:
                questions = json.load(f)
                
            modified = False
            for q in questions:
                if not q.get("explanation", {}).get("en") or q["explanation"]["en"].strip() == "":
                    correct_letter = q.get("correctAnswer", "")
                    correct_text = next((o["text"] for o in q.get("options", []) if o["letter"] == correct_letter), correct_letter)
                    
                    exp_en = ""
                    exp_ar = ""
                    
                    if G4F_AVAILABLE:
                        prompt = f"Question: {q['question']['en']}\nCorrect Answer: {correct_text}\nWrite a 1-sentence explanation of why this is correct."
                        try:
                            print(f"Generating explanation for: {q['question']['en'][:30]}...")
                            response = client.chat.completions.create(
                                model="gpt-3.5-turbo",
                                messages=[{"role": "user", "content": prompt}]
                            )
                            exp_en = response.choices[0].message.content.strip()
                            
                            if exp_en:
                                prompt_ar = f"Translate this to Arabic: {exp_en}"
                                response_ar = client.chat.completions.create(
                                    model="gpt-3.5-turbo",
                                    messages=[{"role": "user", "content": prompt_ar}]
                                )
                                exp_ar = response_ar.choices[0].message.content.strip()
                        except Exception as e:
                            print(f"Failed to generate: {e}")
                    
                    if not exp_en:
                        exp_en = f"The correct answer is '{correct_text}'. This option best answers the question."
                        exp_ar = f"الإجابة الصحيحة هي '{correct_text}'. هذا الخيار هو الأنسب للسؤال."
                        
                    if "explanation" not in q:
                        q["explanation"] = {}
                    q["explanation"]["en"] = exp_en
                    q["explanation"]["ar"] = exp_ar
                    modified = True
                    
            if modified:
                with open(cache_file, "w", encoding="utf-8") as f:
                    json.dump(questions, f, ensure_ascii=False, indent=2)
                print(f"-> Generated missing explanations for {subject}")
