# app/utils/hash.py
# Utility functions for hashing and verifying passwords

import bcrypt
def hash_password(reg_password: str) -> str:
    return bcrypt.hashpw(reg_password.encode("utf-8"), bcrypt.gensalt()).decode()
def verify_password(reg_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(reg_password.encode("utf-8"), hashed_password.encode("utf-8"))