import os
from typing import List, Dict, Any
from app.services.chunk_service import Chunk

class EmbeddingService:
    def __init__(self):
        self.model_name = os.getenv("EMBEDDING_MODEL", "BAAI/bge-base-en-v1.5")
        self.model = None

    def _load_model(self):
        if self.model is None:
            from sentence_transformers import SentenceTransformer
            print(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
    
    def embed_text(self, text: str) -> List[float]:
        """
        Embeds a single string of text.
        """
        self._load_model()
        # model.encode returns a numpy array, we convert to list
        vector = self.model.encode(text).tolist()
        return vector

    def embed_chunks(self, chunks: List[Chunk]) -> List[Dict[str, Any]]:
        """
        Takes a list of Chunk models and generates embeddings for them in batch.
        Returns a list of EmbeddingResult dicts.
        """
        if not chunks:
            return []
            
        self._load_model()
        
        # Extract text for batch encoding
        texts_to_embed = [chunk.text for chunk in chunks]
        
        # Batch encode
        vectors = self.model.encode(texts_to_embed)
        
        dimension = vectors.shape[1] if len(vectors.shape) > 1 else len(vectors[0])
        
        results = []
        for i, chunk in enumerate(chunks):
            vector_list = vectors[i].tolist()
            chunk.embedding = vector_list
            results.append({
                "chunk_index": chunk.chunk_index,
                "vector": vector_list,
                "dimension": dimension
            })
            
        return results

# Singleton instance to be reused across the application
embedding_service = EmbeddingService()
