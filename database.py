import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional

DB_PATH = "chat_history.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            user TEXT NOT NULL,
            title TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT,
            timestamp TIMESTAMP NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        )
    """)
    
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id)")
    
    conn.commit()
    conn.close()

def save_conversation(user: str, convo_id: str, title: str, created_at: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT OR REPLACE INTO conversations (id, user, title, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
    """, (convo_id, user, title, created_at, now))
    
    conn.commit()
    conn.close()

def save_message(msg_id: str, conversation_id: str, role: str, content: str, timestamp: str, image: Optional[str] = None):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT OR REPLACE INTO messages (id, conversation_id, role, content, image, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (msg_id, conversation_id, role, content, image, timestamp))
    
    conn.commit()
    conn.close()

def get_conversations(user: str) -> List[Dict]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, title, created_at, updated_at
        FROM conversations
        WHERE user = ?
        ORDER BY updated_at DESC
    """, (user,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [{"id": r[0], "title": r[1], "createdAt": r[2], "updatedAt": r[3]} for r in rows]

def get_messages(conversation_id: str) -> List[Dict]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, role, content, image, timestamp
        FROM messages
        WHERE conversation_id = ?
        ORDER BY timestamp ASC
    """, (conversation_id,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [{"id": r[0], "role": r[1], "content": r[2], "image": r[3], "timestamp": r[4]} for r in rows]

def delete_conversation(conversation_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conversation_id,))
    cursor.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
    
    conn.commit()
    conn.close()

def update_conversation_title(conversation_id: str, title: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    
    cursor.execute("""
        UPDATE conversations
        SET title = ?, updated_at = ?
        WHERE id = ?
    """, (title, now, conversation_id))
    
    conn.commit()
    conn.close()

init_db()
