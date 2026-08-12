"""
Sho Music AI Worker
Classification + embedding pipeline.
AI NEVER decides rights — only produces Music Intelligence records.
"""
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
import hashlib
import random
import time

app = FastAPI(
    title="Sho Music AI Worker",
    description="Music Information Retrieval, classification & embeddings. Rights are out of scope.",
    version="0.1.0",
)

class AnalyzeRequest(BaseModel):
    track_id: str
    audio_url: Optional[str] = None
    object_key: Optional[str] = None

class Classification(BaseModel):
    value: str
    confidence: float

class MusicIntelligenceResponse(BaseModel):
    track_id: str
    genres: List[Classification]
    moods: List[Classification]
    energy: float = Field(ge=0, le=1)
    tempo_bpm: Optional[float] = None
    key: Optional[str] = None
    languages: List[Classification] = []
    vocal_presence: str
    instruments: List[Classification] = []
    era: Optional[str] = None
    danceability: Optional[float] = None
    acousticness: Optional[float] = None
    explicit_detected: bool = False
    embedding: List[float]
    confidence_overall: float
    model_version: str
    processing_ms: int

GENRE_VOCAB = [
    "Afrobeats", "Amapiano", "Highlife", "Afro-fusion", "Hip-Hop", "R&B",
    "Gospel", "Pop", "Electronic", "Dancehall", "Reggae", "Jazz", "Classical",
]
MOOD_VOCAB = ["Happy", "Calm", "Energetic", "Romantic", "Focused", "Dark", "Nostalgic", "Melancholic"]
INSTRUMENT_VOCAB = ["drums", "bass", "guitar", "synth", "piano", "percussion", "vocals", "brass"]

def fake_embedding(seed: str, dim: int = 128) -> List[float]:
    rng = random.Random(int(hashlib.sha256(seed.encode()).hexdigest()[:8], 16))
    vec = [rng.uniform(-1, 1) for _ in range(dim)]
    norm = sum(x * x for x in vec) ** 0.5 or 1.0
    return [x / norm for x in vec]

@app.get("/health")
def health():
    return {"status": "ok", "service": "sho-ai-worker", "version": "0.1.0"}

@app.post("/analyze", response_model=MusicIntelligenceResponse)
def analyze(req: AnalyzeRequest):
    t0 = time.time()
    seed = req.track_id
    rng = random.Random(int(hashlib.sha256(seed.encode()).hexdigest()[:8], 16))
    genres = [
        Classification(value=GENRE_VOCAB[rng.randint(0, 3)], confidence=round(rng.uniform(0.75, 0.97), 2)),
        Classification(value=GENRE_VOCAB[rng.randint(4, 8)], confidence=round(rng.uniform(0.4, 0.7), 2)),
    ]
    moods = [
        Classification(value=MOOD_VOCAB[rng.randint(0, 3)], confidence=round(rng.uniform(0.7, 0.95), 2)),
    ]
    instruments = [
        Classification(value=i, confidence=round(rng.uniform(0.6, 0.95), 2))
        for i in rng.sample(INSTRUMENT_VOCAB, k=rng.randint(2, 4))
    ]
    energy = round(rng.uniform(0.25, 0.95), 3)
    tempo = round(rng.uniform(80, 130), 1)
    return MusicIntelligenceResponse(
        track_id=req.track_id,
        genres=genres,
        moods=moods,
        energy=energy,
        tempo_bpm=tempo,
        key=rng.choice(["C", "G", "D", "A", "F", "Bb", "Em", "Am"]),
        languages=[Classification(value="en", confidence=0.6)],
        vocal_presence=rng.choice(["vocal", "vocal", "instrumental", "mixed"]),
        instruments=instruments,
        era=rng.choice(["2020s", "2010s", "2000s", None]),
        danceability=round(rng.uniform(0.3, 0.95), 3),
        acousticness=round(rng.uniform(0.05, 0.7), 3),
        explicit_detected=rng.random() < 0.15,
        embedding=fake_embedding(seed),
        confidence_overall=round(rng.uniform(0.7, 0.92), 2),
        model_version="sho-ai-stub-0.1",
        processing_ms=int((time.time() - t0) * 1000),
    )

@app.post("/embed")
def embed_text(payload: dict):
    text = payload.get("text", "")
    return {"embedding": fake_embedding(text), "dim": 128}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
