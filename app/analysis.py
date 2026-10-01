from typing import Any, Dict, List


def score_symbol(stock: Dict[str, Any]) -> Dict[str, Any]:
    price_action = stock.get("trend_score", 50)
    fundamental = min(100, max(0, int((stock.get("eps_growth", 0) * 1.5) + (60 if stock.get("pe_ratio", 0) < 40 else 40))))
    event_sentiment = int(stock.get("news_sentiment", 0.5) * 100)
    iv_score = max(0, 100 - stock.get("iv_percentile", 50))
    gamma_score = stock.get("gamma_score", 50)
    composite = int((price_action * 0.30) + (fundamental * 0.20) + (event_sentiment * 0.15) + (iv_score * 0.15) + (gamma_score * 0.20))
    bias = "BUY" if composite >= 75 else "WATCH" if composite >= 55 else "SELL"
    low_iv = stock.get("iv_percentile", 100) < 40
    gamma_blast = gamma_score >= 75 or (gamma_score >= 65 and stock.get("days_to_expiry", 99) < 10)
    return {
        "symbol": stock["symbol"], "name": stock["name"], "asset_type": stock.get("asset_type", "stock"),
        "price": stock.get("price", 0), "daily_change_pct": stock.get("daily_change_pct", 0),
        "iv_percentile": stock.get("iv_percentile", 0), "iv_rank": stock.get("iv_rank", 0),
        "gamma_score": gamma_score, "trend_score": price_action, "mtf_alignment": stock.get("mtf_alignment", "Neutral"),
        "event_type": stock.get("event_type", "Macro"), "event_label": stock.get("event_label", "Catalyst"),
        "signal": bias, "score": composite, "low_iv": low_iv, "gamma_blast": gamma_blast,
        "fundamental_score": fundamental, "event_score": event_sentiment, "iv_score": iv_score,
        "watchlist": stock.get("watchlist", "General"),
    }


def build_dashboard_data(stocks: List[Dict[str, Any]]) -> Dict[str, Any]:
    scored = [score_symbol(stock) for stock in stocks]
    low_iv = [item for item in scored if item["low_iv"]]
    gamma_blast = [item for item in scored if item["gamma_blast"]]
    return {
        "summary": {
            "total_symbols": len(scored), "low_iv_count": len(low_iv), "gamma_blast_count": len(gamma_blast),
            "buy_count": sum(item["signal"] == "BUY" for item in scored),
            "watch_count": sum(item["signal"] == "WATCH" for item in scored),
            "avg_score": round(sum(item["score"] for item in scored) / max(len(scored), 1), 2),
            "top_pick": max(scored, key=lambda item: item["score"], default={"symbol": "N/A"}),
        },
        "signals": scored, "low_iv": low_iv, "gamma_blast": gamma_blast,
    }
