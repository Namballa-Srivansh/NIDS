import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Activity, Wifi, Terminal, Server, Zap, UploadCloud, Cpu, AlertOctagon, TerminalSquare } from 'lucide-react';
import './App.css';

function App() {
  // --- Single Packet State ---
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(0);

  // --- Batch Upload State ---
  const [batchResult, setBatchResult] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);

  // --- DEMO DATA ---
  const normalPacket = [22, 1266342, 41, 2664, 456, 0, 64.9, 109.8, 976, 0, 158.0, 312.6, 7595.1, 67.1, 15075.5, 104051.3, 948537, 0, 1266342, 31658.5, 159355.2, 996324, 2, 317671, 7387.6, 19636.4, 104616, 1, 1328, 1424, 32.3, 34.7, 0, 976, 111.8, 239.6, 57449.7, 0, 1, 0, 113.1, 2664, 29200, 243, 24, 32, 0.0, 0, 0, 0.0, 0, 0]; 
  const attackPacket = [80, 5000000, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 1000, 500, 2000, 100, 5000000, 1000, 500, 2000, 100, 0, 0, 0, 0, 0, 4000, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29200, 0, 0, 20, 0.0, 0, 0, 0.0, 0, 0]; 

  const sendTraffic = async (type) => {
    setLoading(true);
    setResult(null);

    const payload = type === 'normal' ? normalPacket : attackPacket;
    const startTime = performance.now();

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: payload })
      });
      
      const data = await response.json();
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setResult(data);
    } catch (error) {
      console.error("API Error:", error);
      setResult({ status: 'error', message: 'Connection Error', code: -1 });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBatchLoading(true);
    setBatchResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/predict_batch', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setBatchResult(data);
    } catch (error) {
      console.error("Batch API Error:", error);
    }
    setBatchLoading(false);
  };

  return (
    <>
      <div className="cyber-grid" />
      <div className="scanlines" />

      <div className="relative z-10 min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-10">
        
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[var(--border-color)] pb-6 relative">
          <div className="absolute top-0 left-0 w-8 h-1 bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]" />
          <div className="absolute top-0 right-0 w-8 h-1 bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]" />
          
          <div className="flex items-center gap-4">
            <TerminalSquare className="w-12 h-12 text-[var(--neon-cyan)] text-glow-cyan" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold glitch-text uppercase m-0 leading-tight" data-text="NEURAL TRAFFIC ANALYZER">
                NEURAL TRAFFIC ANALYZER
              </h1>
              <p className="text-[var(--neon-cyan)] opacity-80 text-sm tracking-widest uppercase animate-pulse">
                [ AI Intrusion Detection Active ]
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="cyber-panel p-3 min-w-[160px]">
              <div className="corner-tl" /><div className="corner-tr" /><div className="corner-bl" /><div className="corner-br" />
              <div className="text-xs uppercase text-[var(--neon-cyan)] opacity-70 mb-1">Sys.Status</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-ping absolute" />
                <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] relative" />
                <span className="text-[var(--neon-green)] font-bold tracking-wider">ONLINE</span>
              </div>
            </div>
            
            <div className="cyber-panel p-3 min-w-[160px]">
              <div className="corner-tl" /><div className="corner-tr" /><div className="corner-bl" /><div className="corner-br" />
              <div className="text-xs uppercase text-[var(--neon-cyan)] opacity-70 mb-1">Node</div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[var(--neon-cyan)]" />
                <span className="text-white font-bold tracking-wider">EDGE-01</span>
              </div>
            </div>
          </div>
        </header>

        <main className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column: Single Packet Simulator */}
          <section className="cyber-panel p-6 flex flex-col gap-6">
            <div className="corner-tl" /><div className="corner-tr" /><div className="corner-bl" /><div className="corner-br" />
            
            <div className="flex items-center justify-between border-b border-[rgba(0,255,255,0.2)] pb-4">
              <h2 className="text-xl text-[var(--neon-cyan)] uppercase flex items-center gap-2 m-0">
                <Activity className="w-5 h-5" /> Live Intercept
              </h2>
              <span className="text-xs tracking-widest opacity-50 uppercase">Manual Sim Engine</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="cyber-button cyber-button-safe flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => sendTraffic('normal')} 
                disabled={loading || batchLoading}
              >
                <Terminal className="w-5 h-5" /> Sim Normal
              </button>
              <button 
                className="cyber-button cyber-button-danger flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => sendTraffic('attack')} 
                disabled={loading || batchLoading}
              >
                <Zap className="w-5 h-5" /> Inject Threat
              </button>
            </div>

            <div className="flex-1 bg-[rgba(0,0,0,0.6)] border border-[rgba(0,255,255,0.1)] p-4 min-h-[250px] flex flex-col items-center justify-center relative overflow-hidden">
              
              {!loading && !result && (
                <div className="text-[rgba(0,255,255,0.3)] text-center animate-pulse">
                  <Server className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>AWAITING TRAFFIC INPUT...</p>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-transparent border-t-[var(--neon-cyan)] rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[var(--neon-cyan)] text-glow-cyan font-bold tracking-widest screen-flicker">ANALYZING PACKET DATA_</p>
                </div>
              )}

              {result && !loading && result.status !== 'error' && (
                <div className={`w-full h-full flex flex-col items-center justify-center ${result.status === 'danger' ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'}`}>
                  {result.status === 'danger' ? (
                    <ShieldAlert className="w-16 h-16 mb-4 filter drop-shadow-[0_0_10px_var(--neon-red)] screen-flicker" />
                  ) : (
                    <ShieldCheck className="w-16 h-16 mb-4 filter drop-shadow-[0_0_10px_var(--neon-green)]" />
                  )}
                  
                  <h3 className="text-2xl font-bold uppercase tracking-widest mb-2 font-orbitron">
                    {result.status === 'danger' ? 'THREAT DETECTED' : 'TRAFFIC CLEAR'}
                  </h3>
                  
                  <div className="w-full mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.1)] p-3">
                      <div className="opacity-50 uppercase text-xs mb-1">VERDICT</div>
                      <div className="font-bold text-lg">{result.message}</div>
                    </div>
                    <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.1)] p-3">
                      <div className="opacity-50 uppercase text-xs mb-1">INFERENCE ID</div>
                      <div className="font-bold text-lg">{result.code}</div>
                    </div>
                    <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.1)] p-3 col-span-2 flex justify-between items-center">
                      <div>
                        <div className="opacity-50 uppercase text-xs mb-1">LATENCY</div>
                        <div className="font-bold text-lg text-[var(--neon-cyan)]">{latency} ms</div>
                      </div>
                      <div className={`status-badge ${result.status === 'danger' ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'}`}>
                        {result.status === 'danger' ? 'DROPPED' : 'ALLOWED'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {result?.status === 'error' && (
                <div className="text-[var(--neon-red)] text-center">
                  <AlertOctagon className="w-12 h-12 mx-auto mb-2 text-glow-red screen-flicker" />
                  <p className="font-bold uppercase tracking-widest text-glow-red">SYSTEM ERROR / CONNECTION REFUSED</p>
                </div>
              )}
            </div>
          </section>

          <section className="cyber-panel p-6 flex flex-col gap-6">
            <div className="corner-tl" /><div className="corner-tr" /><div className="corner-bl" /><div className="corner-br" />
            
            <div className="flex items-center justify-between border-b border-[rgba(0,255,255,0.2)] pb-4">
              <h2 className="text-xl text-[var(--neon-cyan)] uppercase flex items-center gap-2 m-0">
                <Cpu className="w-5 h-5" /> Telemetry Ingestion
              </h2>
              <span className="text-xs tracking-widest opacity-50 uppercase">Bulk CSV Analyser</span>
            </div>

            <label className="border border-[var(--border-color)] bg-[rgba(0,50,50,0.2)] hover:bg-[rgba(0,255,255,0.1)] transition-colors cursor-pointer p-8 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,255,255,0.1)] to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <UploadCloud className="w-10 h-10 text-[var(--neon-cyan)] mb-4" />
              <span className="uppercase tracking-widest font-bold text-white z-10">UPLOAD TELEMETRY DATA</span>
              <span className="text-xs opacity-50 mt-2 z-10">Select .CSV file containing raw packet logs</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={batchLoading || loading} />
            </label>

            {batchLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-[var(--neon-cyan)]">
                <div className="w-full h-1 bg-[rgba(0,0,0,0.5)] mb-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[var(--neon-cyan)] w-1/3 animate-[grid-scroll_1s_linear_infinite]" />
                </div>
                <p className="font-mono text-sm uppercase tracking-widest screen-flicker">PARSING TELEMETRY DATASTREAM...</p>
              </div>
            )}

            {batchResult && !batchLoading && (
              <div className="flex-1 flex flex-col gap-4 animate-[fade-in-up_0.5s_ease-out]">
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] p-2 text-center">
                    <div className="text-[10px] opacity-60 uppercase mb-1">TOTAL</div>
                    <div className="font-bold text-white text-xl">{batchResult.total_processed}</div>
                  </div>
                  <div className="bg-[rgba(255,0,60,0.1)] border border-[rgba(255,0,60,0.3)] p-2 text-center">
                    <div className="text-[10px] text-[var(--neon-red)] uppercase mb-1">THREATS</div>
                    <div className="font-bold text-[var(--neon-red)] text-xl text-glow-red">{batchResult.total_danger}</div>
                  </div>
                  <div className="bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] p-2 text-center">
                    <div className="text-[10px] text-[var(--neon-green)] uppercase mb-1">SAFE</div>
                    <div className="font-bold text-[var(--neon-green)] text-xl">{batchResult.total_safe}</div>
                  </div>
                  <div className="bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] p-2 text-center">
                    <div className="text-[10px] opacity-60 uppercase mb-1">LATENCY</div>
                    <div className="font-bold text-[var(--neon-cyan)] text-xl">{batchResult.latency}<span className="text-xs">ms</span></div>
                  </div>
                </div>

                {batchResult.total_danger > 0 && (
                  <div className="mt-2 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-[var(--neon-red)] uppercase tracking-widest mb-2 border-b border-[var(--neon-red)] pb-1 flex justify-between">
                      <span>QUARANTINE_LOG</span>
                      <span className="screen-flicker">[! ACTION REQ !]</span>
                    </div>
                    <div className="overflow-x-auto max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(0,255,255,0.3)] scrollbar-track-transparent">
                      <table className="cyber-table text-xs">
                        <thead>
                          <tr>
                            <th>PKT_ID</th>
                            <th>PORT</th>
                            <th>DUR_µS</th>
                            <th>STAT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batchResult.results.filter(r => r.status === 'danger').map((row, index) => (
                            <tr key={index}>
                              <td className="opacity-70">#{row.id}</td>
                              <td className="text-[var(--neon-cyan)]">{row.port}</td>
                              <td>{row.duration}</td>
                              <td className="text-[var(--neon-red)] text-glow-red font-bold">DROPPED</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

          </section>
        </main>
      </div>
    </>
  );
}

export default App;