# Force UTF-8 encoding for stdout
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from googletrans import Translator

# Initialize the translator
translator = Translator()

# Translate function
def translate_text(text, lang):
    try:
        translation = translator.translate(text, dest=lang)
        return translation.text
    except Exception as e:
        return f"Translation failed: {e}"

if __name__ == "__main__":
    text = sys.argv[1]
    lang = sys.argv[2]
    print(translate_text(text, lang))
