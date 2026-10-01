# Trading Analysis App

A lightweight trading analysis dashboard prototype for:
- price action signals
- multi-timeframe analysis
- fundamental and event-driven signals
- IV/low-IV scanner
- gamma blast detection
- earnings and event-based screening

This project is a starter MVP and is intended for educational analytics only. It does not provide financial advice or guaranteed trade signals.

## Features

- Price action trend and momentum scoring
- Multi-timeframe alignment (5m, 15m, 1h, 1D, 1W)
- Fundamental score based on valuation and quality metrics
- Earnings / event / news impact scoring
- Low-IV stock filtering
- Gamma blast scanner logic
- Dashboard with summary cards and watchlist

## Tech stack

- Python 3.11+
- FastAPI
- Jinja2 templates
- HTML/CSS/JavaScript dashboard

## Quick start

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the app:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Open the browser:
   ```text
   http://localhost:8000
   ```

## API endpoints

- `GET /` — dashboard UI
- `GET /api/overview` — summary and watchlist data
- `GET /api/scan` — scanner results

## Disclaimer

This app is a research/analysis prototype. Signals are heuristic and not legal, financial, or investment advice.
