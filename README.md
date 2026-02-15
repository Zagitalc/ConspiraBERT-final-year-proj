# ConspiraBERT Final Year Project

Flask web app for sentence-level conspiracy classification using a fine-tuned BERT model, with an optional summarise-then-classify route.

## What this repo contains
- `project/app.py`: Flask app and API routes.
- `project/templates/` and `project/static/`: Web UI.
- `project/tokenizer/`: tokenizer files used by summarisation.
- Training notebooks and project artifacts for report evidence.

## Required model folders
The app expects these folders before startup:
- `project/models/` (BERT classifier + tokenizer files)
- `project/tm-small-cnn-model/` (summarisation model files)

This repo includes empty placeholder folders (`.gitkeep` only). Add the actual model files to those folders.

## API routes
- `GET /` renders the landing UI.
- `GET /1` renders classify-only UI.
- `GET /2` renders summarise-and-classify UI.
- `POST /1/classify` classifies each sentence from input text.
- `POST /2/summarize-and-classify` summarises input then classifies sentences in the summary.

Input format for both POST routes:
```json
{
  "text": "your text here",
  "model": "bert"
}
```

## Run locally
From repo root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python project/app.py
```

Open:
- `http://127.0.0.1:5000/1`
- `http://127.0.0.1:5000/2`

## Run with Docker
From repo root:

```bash
docker compose up --build
```

Open:
- `http://localhost:5000/1`
- `http://localhost:5000/2`

Stop:

```bash
docker compose down
```

## Notes on compatibility
- `requirements.txt` is pinned for stable runtime with this legacy code path.
- `nltk==3.8.1` is pinned so `nltk.download("punkt")` in `project/app.py` works as written.
