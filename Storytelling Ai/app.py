import os
import google.generativeai as genai
from flask import Flask, request, render_template, send_file
from dotenv import load_dotenv
import glob
import time

# Load API Key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini AI
genai.configure(api_key=API_KEY)

app = Flask(__name__)
STORY_FOLDER = "stories"
MAX_STORIES = 5  # Keep only the last 5 stories

# Ensure the folder exists
os.makedirs(STORY_FOLDER, exist_ok=True)

def clean_old_stories():
    """Keep only the latest MAX_STORIES files and delete older ones."""
    files = sorted(glob.glob(os.path.join(STORY_FOLDER, "*.txt")), key=os.path.getmtime)
    while len(files) > MAX_STORIES:
        os.remove(files.pop(0))  # Delete the oldest file

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


genai.configure(api_key=GEMINI_API_KEY)

@app.route("/", methods=["GET", "POST"])
def generate_story():
    story_text = None
    download_link = None
    prompt = ""
    genre = "fantasy"
    word_limit = ""

    if request.method == "POST":
        prompt = request.form.get("prompt", "")
        genre = request.form.get("genre", "fantasy")
        word_limit = request.form.get("word_limit", "")

        try:
            word_limit = int(word_limit)  # Convert safely
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                f"Write a {genre} story based on: {prompt}. Limit the story to {word_limit} words.make it easy to unserstand. do not use any complex words.",
            )

            generated_story = response.text if hasattr(response, 'text') else response.candidates[0].content
            words = generated_story.split()
            generated_story = " ".join(words[:word_limit])  # Trim the story if it exceeds the limit

            filename = f"story_{int(time.time())}.txt"
            story_path = os.path.join(STORY_FOLDER, filename)
            with open(story_path, "w", encoding="utf-8") as f:
                f.write(generated_story)

            clean_old_stories()

            story_text = generated_story
            download_link = f"/download/{filename}"

        except Exception as e:
            story_text = "Error generating story. Please try again."
            print("Error:", e)

    return render_template("index.html", story=story_text, download_link=download_link, prompt=prompt, genre=genre, word_limit=word_limit)



@app.route("/download/<filename>")
def download_story(filename):
    return send_file(os.path.join(STORY_FOLDER, filename), as_attachment=True, download_name="story.txt")

if __name__ == "__main__":
    app.run(debug=True)
