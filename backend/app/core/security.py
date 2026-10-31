import hmac
import hashlib
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional, Dict
import jwt
import bcrypt
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except Exception:
        return None


def generate_qr_payload(user_id: str, qr_salt: str) -> Dict[str, Any]:
    """
    Generates a secure, non-guessable HMAC signed attendance token payload.
    Contains user_id, salt, timestamp and HMAC signature.
    """
    timestamp = int(time.time())
    data_to_sign = f"{user_id}:{qr_salt}:{timestamp}".encode("utf-8")
    signature = hmac.new(settings.JWT_SECRET_KEY.encode("utf-8"), data_to_sign, hashlib.sha256).hexdigest()
    return {
        "uid": str(user_id),
        "salt": qr_salt,
        "t": timestamp,
        "sig": signature,
    }


def verify_qr_payload(user_id: str, qr_salt: str, timestamp: int, signature: str) -> bool:
    """
    Verifies that the QR payload signature matches HMAC(user_id:qr_salt:timestamp).
    Prevents token forgery while allowing customer to show their dynamic card.
    """
    try:
        data_to_sign = f"{user_id}:{qr_salt}:{timestamp}".encode("utf-8")
        expected_sig = hmac.new(settings.JWT_SECRET_KEY.encode("utf-8"), data_to_sign, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected_sig, signature)
    except Exception:
        return False
