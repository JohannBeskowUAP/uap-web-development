import { useState } from "react";
import { ethers } from "ethers";

const API_BASE_URL = "http://localhost:3001/api";

export default function AuthButton() {
  const [loading, setLoading] = useState(false);

  const getAuthMessage = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/message`, {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Message request failed');

    const json = await res.json();
    return json.data;
  };

  const signIn = async () => {
    try {
      setLoading(true);

      console.log("📝 Fetching SIWE message...");
      const { message, nonce } = await getAuthMessage();

      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();

      console.log("✍️ Signing SIWE message...");
      const signature = await signer.signMessage(message);
      const address = await signer.getAddress();

      console.log("🔐 Sending signature to backend...");
      const verifyRes = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message,
          signature,
          nonce,
          address,
        }),
      });

      const verifyJson = await verifyRes.json();
      console.log("💬 Backend response:", verifyJson);
    } catch (err) {
      console.error("❌ Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={signIn} disabled={loading}>
      {loading ? "Cargando..." : "Iniciar sesión"}
    </button>
  );
}
