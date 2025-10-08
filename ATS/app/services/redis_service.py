# # redis_client.py
# import redis

# # ✅ Single Redis connection object
# r = redis.Redis(
#     host='localhost',  # or your cloud host
#     port=6379,
#     password='',       # add if needed
#     decode_responses=True
# )


import redis
import os
r = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=os.getenv("REDIS_PORT"),
    decode_responses=True,
    username="default",
    password=os.getenv("REDIS_PASSWORD")
)



