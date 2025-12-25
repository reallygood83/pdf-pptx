import os
from cryptography.fernet import Fernet
from typing import Optional

class KeyManager:
    def __init__(self):
        # In production, this MASTER_KEY must be a 32-byte base64 encoded string
        # You can generate one using Fernet.generate_key()
        self.master_key = os.getenv("ENCRYPTION_MASTER_KEY")
        if not self.master_key:
            # Fallback for dev, but warn user
            print("WARNING: ENCRYPTION_MASTER_KEY not found in environment variables!")
            # Temporary key for development only
            self.master_key = b'h3-u5Y6mH8_R0h7J-b2S1A8D4F5G6H7J8K9L0M1N2O3=' 
        
        if isinstance(self.master_key, str):
            self.master_key = self.master_key.encode()
            
        self.cipher_suite = Fernet(self.master_key)

    def encrypt_key(self, api_key: str) -> str:
        """Encrypt an API key to a string."""
        if not api_key:
            return ""
        encrypted_text = self.cipher_suite.encrypt(api_key.encode())
        return encrypted_text.decode()

    def decrypt_key(self, encrypted_key: str) -> str:
        """Decrypt an encrypted API key string."""
        if not encrypted_key:
            return ""
        try:
            decrypted_text = self.cipher_suite.decrypt(encrypted_key.encode())
            return decrypted_text.decode()
        except Exception as e:
            print(f"Decryption error: {e}")
            return ""

key_manager = KeyManager()
