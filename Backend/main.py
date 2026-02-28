from fastapi import FastAPI, UploadFile, File # Added UploadFile and File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import time
import io # Added to read the uploaded file

app = FastAPI(title="AMD Cyber-AI NIDS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Loading the model
model = joblib.load('nids_model.pkl')
scaler = joblib.load('nids_scaler.pkl')

class NetworkPacket(BaseModel):
    features: list[float] 

@app.post("/predict")
def predict_traffic(packet: NetworkPacket):
    try:
        df = pd.DataFrame([packet.features])
        scaled_data = scaler.transform(df)
        start_time = time.perf_counter()
        prediction = model.predict(scaled_data)[0]
        end_time = time.perf_counter()
        latency_ms = round((end_time - start_time) * 1000, 3)
        
        if prediction == 1:
            return {"status": "danger", "message": "ATTACK DETECTED", "code": 1, "latency": latency_ms}
        else:
            return {"status": "safe", "message": "Normal Traffic", "code": 0, "latency": latency_ms}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/predict_batch")
async def predict_batch(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        df.columns = df.columns.str.strip()
        
        if 'Attack Type' in df.columns:
            df = df.drop(columns=['Attack Type'])
            
        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.fillna(0, inplace=True) 


        start_time = time.perf_counter()
        scaled_data = scaler.transform(df)
        predictions = model.predict(scaled_data)
        end_time = time.perf_counter()
        
        latency_ms = round((end_time - start_time) * 1000, 3)

        results = []
        for i in range(len(predictions)):
            results.append({
                "id": i + 1,
                "port": int(df['Destination Port'].iloc[i]) if 'Destination Port' in df.columns else "Unknown",
                "duration": float(df['Flow Duration'].iloc[i]) if 'Flow Duration' in df.columns else 0,
                "status": "danger" if predictions[i] == 1 else "safe"
            })
            
        return {
            "total_processed": len(predictions),
            "total_danger": int(sum(predictions)),
            "total_safe": int(len(predictions) - sum(predictions)),
            "latency": latency_ms,
            "results": results
        }
        
    except Exception as e:
        return {"error": str(e)}