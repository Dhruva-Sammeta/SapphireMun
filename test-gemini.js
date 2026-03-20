const fs = require('fs');

async function test() {
  const geminiApiKey = process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE";
  const imageBuff = fs.readFileSync("/tmp/test-screenshot.png");
  const base64Image = imageBuff.toString("base64");

  const prompt = "Analyze this image and return JSON: { \"verified\": true }";

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/png", data: base64Image } }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });
    
    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
