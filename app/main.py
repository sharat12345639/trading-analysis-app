from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.analysis import build_dashboard_data
from app.data.sample_data import MARKET_DATA

app = FastAPI(title="TradingAnalysisApp", version="0.1.0")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/overview")
async def overview():
    return build_dashboard_data(MARKET_DATA)

@app.get("/api/scan")
async def scan():
    return build_dashboard_data(MARKET_DATA)

@app.get("/health")
async def health():
    return {"status": "ok"}
