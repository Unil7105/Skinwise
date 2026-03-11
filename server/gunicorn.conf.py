import os

# Render dynamically assigns a PORT environment variable.
port = os.environ.get("PORT", "10000")

# Gunicorn defaults to 127.0.0.1, which Render cannot reach.
# Binding to 0.0.0.0 ensures the app is accessible to Render's port scanner.
bind = f"0.0.0.0:{port}"

# Use a longer timeout just in case it takes a few seconds to load the AI model
timeout = 120
