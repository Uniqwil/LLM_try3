#!/bin/bash
source .venv/bin/activate
uvicorn app.main:app --reload
read -p "Press Enter to close..."
