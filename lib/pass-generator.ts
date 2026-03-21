import QRCode from "qrcode"
import { getServiceSupabase } from "@/lib/supabase"

interface PassData {
  delegate_id: string
  name: string
  institution: string
  committee_pref: string
  country_pref: string
}

/**
 * Generates a delegate pass as an HTML page, converts to PDF via Puppeteer,
 * uploads to Supabase Storage, and returns the public URL.
 */
export async function generatePass(data: PassData): Promise<string> {
  // 1. Generate QR Code as data URL
  const qrContent = `SMUN2026_${data.delegate_id.replace(/-/g, "_")}`
  const qrDataUrl = await QRCode.toDataURL(qrContent, {
    width: 200,
    margin: 2,
    color: { dark: "#050a2a", light: "#ffffff" },
  })

  // 2. Build HTML pass template
  const html = buildPassHTML(data, qrDataUrl)

  // 3. Render to PDF using Puppeteer
  let pdfBuffer: Buffer

  try {
    const puppeteer = await import("puppeteer")
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })
    const pdf = await page.pdf({
      width: "600px",
      height: "900px",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })
    await browser.close()
    pdfBuffer = Buffer.from(pdf)
  } catch (err) {
    console.error("Puppeteer PDF generation error:", err)
    throw new Error("Failed to generate delegate pass PDF.")
  }

  // 4. Upload PDF to Supabase Storage
  const supabase = getServiceSupabase()
  const fileName = `${data.delegate_id.replace(/-/g, "_")}_pass.pdf`

  const { error: uploadError } = await supabase.storage
    .from("delegate-passes")
    .upload(fileName, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    })

  if (uploadError) {
    console.error("Pass upload error:", uploadError)
    throw new Error("Failed to upload delegate pass.")
  }

  const { data: urlData } = supabase.storage
    .from("delegate-passes")
    .getPublicUrl(fileName)

  return urlData?.publicUrl || ""
}

function buildPassHTML(data: PassData, qrDataUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    width: 600px; 
    height: 900px; 
    background-color: #000000;
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }
  
  .container {
    padding: 60px 40px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  /* Logo Section */
  .logo-section {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }
  .logo-img {
    width: 220px;
    height: auto;
    filter: drop-shadow(0 0 10px rgba(29, 78, 216, 0.3));
  }

  /* Title */
  .title {
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    color: #1d4ed8;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin: 20px 0;
    text-align: center;
    line-height: 1.1;
  }

  /* Name Plate - Stylized Hexagon/Pill */
  .name-plate {
    position: relative;
    padding: 15px 60px;
    margin: 30px 0;
    border: 3px solid #1d4ed8;
    background: rgba(40, 40, 40, 0.4);
    clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%);
    min-width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(29, 78, 216, 0.15);
  }
  .name {
    font-size: 32px;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #e2e8f0;
    text-align: center;
  }

  /* Info Section */
  .info-section {
    text-align: center;
    width: 100%;
    margin-top: 20px;
  }
  .info-value {
    font-size: 28px;
    font-weight: 700;
    color: #1d4ed8;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 30px;
  }

  /* QR Section */
  .qr-section {
    margin-top: auto;
    background: white;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(29, 78, 216, 0.2);
  }
  .qr-img {
    width: 140px;
    height: 140px;
    display: block;
  }
  
  .footer-text {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.2);
    margin-top: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="logo-section">
      <img src="https://sapphiremun.com/images/sapphire-mun-hero-logo.png" class="logo-img" alt="Logo">
    </div>

    <h1 class="title">Delegate<br>Pass</h1>

    <div class="name-plate">
      <div class="name">${escapeHtml(data.name)}</div>
    </div>

    <div class="info-section">
      <div class="info-value">${escapeHtml(data.committee_pref.split(' - ')[0])}</div>
      <div class="info-value" style="font-size: 24px;">ID: ${escapeHtml(data.delegate_id)}</div>
    </div>

    <div class="qr-section">
      <img src="${qrDataUrl}" class="qr-img" alt="QR Code">
    </div>

    <div class="footer-text">Official Digital Access • Hyderabad 2.0</div>
  </div>
</body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
