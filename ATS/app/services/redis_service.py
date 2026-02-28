# # redis_client.py
# import redis

# # ✅ Single Redis connection object
# r = redis.Redis(
#     host='localhost',  # or your cloud host
#     port=6379,
#     password='',       # add if needed
#     decode_responses=True
# )


import os

import redis

r = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=os.getenv("REDIS_PORT"),
    decode_responses=True,
    username="default",
    password=os.getenv("REDIS_PASSWORD")
)


def safe_get(key):
    try:
        return r.get(key)
    except Exception as exc:  # noqa: BLE001
        print(f"[Redis] GET failed for key '{key}': {exc}")
        return None


def safe_setex(key, ttl_seconds, value):
    try:
        return r.setex(key, ttl_seconds, value)
    except Exception as exc:  # noqa: BLE001
        print(f"[Redis] SETEX failed for key '{key}': {exc}")
        return None


def safe_mget(keys):
    try:
        return r.mget(keys)
    except Exception as exc:  # noqa: BLE001
        print(f"[Redis] MGET failed: {exc}")
        return [None] * len(keys)


def safe_delete(key):
    try:
        return r.delete(key)
    except Exception as exc:  # noqa: BLE001
        print(f"[Redis] DELETE failed for key '{key}': {exc}")
        return None



