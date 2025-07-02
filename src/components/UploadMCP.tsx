// src/components/UploadMCP.tsx
// This component is for testing MCP functionality - not used in main app
import { useState } from 'react';

export default function UploadMCP() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      // MCP functionality disabled - use fetch instead of axios
      const response = await fetch('https://f452-49-196-176-162.ngrok-free.app/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Upload failed', err);
      setResult({ error: 'Failed to analyze file' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white shadow space-y-4">
      <input type="file" onChange={handleFile} />
      {loading && <p className="text-blue-500">Analyzing...</p>}
      {result && (
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
