.PHONY: dev migrate revision

dev:
	uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

migrate:
	uv run alembic upgrade head

revision:
	@read -p "Enter migration message: " msg; \
	uv run alembic revision --autogenerate -m "$$msg"
