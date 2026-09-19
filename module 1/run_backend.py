import os
import sys
import uvicorn

# Ensure backend directory is in python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    print("Starting NHAA 14566 Module 1 FastAPI Backend on http://127.0.0.1:8000 ...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, app_dir=backend_dir)
