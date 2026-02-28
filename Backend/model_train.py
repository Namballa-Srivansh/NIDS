import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
import joblib
from pathlib import Path

base_dir = Path(__file__).resolve().parent

df = pd.read_csv(base_dir / 'cicids2017_cleaned.csv') 
print(df.head())
df.columns = df.columns.str.strip()


df.replace([np.inf, -np.inf], np.nan, inplace=True)
df.dropna(inplace=True)

print("3. Sampling data for fast testing...")
df = df.sample(n=100000, random_state=42)

df['Target'] = df['Attack Type'].apply(lambda x: 0 if str(x).strip().upper() == 'NORMAL TRAFFIC' else 1)

df = df.drop(columns=['Attack Type'])

X = df.drop(columns=['Target'])
y = df['Target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train_scaled, y_train)

print("8. Evaluating the model...\n")
y_pred = model.predict(X_test_scaled)


print(confusion_matrix(y_test, y_pred))

print("\n=== Classification Report ===")
print(classification_report(y_test, y_pred))



model_file = base_dir / 'nids_model.pkl'
scaler_file = base_dir / 'nids_scaler.pkl'

joblib.dump(model, model_file)
joblib.dump(scaler, scaler_file)

print(f"Success! Files saved as '{model_file}' and '{scaler_file}'.")