import os
from typing import List, Dict, Any, Optional
import chromadb
from app.services.chunk_service import Chunk

class ChromaStore:
    def __init__(self):
        # Configure local persistent storage for ChromaDB
        self.storage_path = os.path.join(os.getcwd(), "storage", "chroma")
        os.makedirs(self.storage_path, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=self.storage_path)
        
        self.collection = self.client.get_or_create_collection(
            name="proposal_chunks",
            metadata={"hnsw:space": "cosine"}
        )

    def add_chunks(self, proposal_id: str, chunks: List[Chunk]):
        """
        Store chunk text and embeddings into ChromaDB collection.
        """
        if not chunks:
            return

        documents = []
        embeddings = []
        metadatas = []
        ids = []

        for chunk in chunks:
            if chunk.embedding is None:
                continue
                
            chunk_id = f"{proposal_id}_{chunk.chunk_index}"
            
            documents.append(chunk.text)
            embeddings.append(chunk.embedding)
            ids.append(chunk_id)
            
            # Prepare metadata (Chroma requires string/int/float)
            meta = {
                "proposal_id": proposal_id,
                "chunk_index": chunk.chunk_index,
                "section": chunk.section,
                "length": chunk.length
            }
            if chunk.subsection:
                meta["subsection"] = chunk.subsection
            if chunk.is_table is not None:
                # ChromaDB requires boolean as string or int to be stored correctly in some versions.
                # It handles boolean securely in 0.4.x but we cast to bool just to be safe.
                meta["is_table"] = bool(chunk.is_table)
                
            metadatas.append(meta)

        if ids:
            # Batch upsert into Chroma
            self.collection.upsert(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )

    def search(self, query_embedding: List[float], top_k: int = 5, where: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Perform a semantic similarity search.
        """
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"]
        )
        
        formatted_results = []
        
        if not results['ids'] or not results['ids'][0]:
            return formatted_results

        # Extract the matched data (batch size 1 so index 0)
        ids = results['ids'][0]
        documents = results['documents'][0]
        metadatas = results['metadatas'][0]
        distances = results['distances'][0]
        
        for i in range(len(ids)):
            # Convert cosine distance back to similarity (1 - distance)
            similarity = 1.0 - distances[i] if distances[i] is not None else 0.0
            
            res = {
                "id": ids[i],
                "text": documents[i],
                "similarity": similarity
            }
            if metadatas[i]:
                res.update(metadatas[i])
                
            formatted_results.append(res)
            
        return formatted_results

# Singleton pattern for the vector store
vector_store = ChromaStore()
