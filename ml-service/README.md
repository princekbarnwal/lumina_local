# ML Sentiment Service

Small Flask service for review sentiment analysis.

## Model Files

If you have model files like:

```text
model.safetensors
config.json
special_tokens_map.json
tokenizer.json
tokenizer_config.json
training_args.bin
vocab.txt
```

Keep them in:

```text
ml-service/models/sentiment-model/
```

The current service uses VADER. The model folder is the right place to store your trained model locally, but `app.py` does not load it yet. To use it, replace the VADER logic with a `transformers` pipeline that loads from `models/sentiment-model`.

## Setup

```bash
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
python app.py
```

The service runs on `http://localhost:8000`.

## Analyze Reviews

```http
POST /analyze
Content-Type: application/json

{
  "reviews": ["Great product", "Not worth the money"]
}
```

Response:

```json
[
  { "sentiment": "positive" },
  { "sentiment": "negative" }
]
```
