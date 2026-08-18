/**
 * relay.js
 * ------------------------------------------------------------
 * Runs on your PHONE inside Termux.
 * Listens on 127.0.0.1:PORT and forwards every request to your
 * Render backend over the phone's mobile data / wifi.
 *
 * Your offline PC never touches the internet directly — it only
 * talks to this relay through the USB cable (via `adb forward`).
 *
 * No npm install needed — uses only Node's built-in http/https.
 * ------------------------------------------------------------
 * Usage (in Termux):
 *   RENDER_URL="https://your-backend.onrender.com" node relay.js
 *
 * Or edit the DEFAULT_RENDER_URL below and just run:
 *   node relay.js
 * ------------------------------------------------------------
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");

const DEFAULT_RENDER_URL = "https://your-backend.onrender.com"; // <-- put your real Render URL here
const RENDER_URL = process.env.RENDER_URL || DEFAULT_RENDER_URL;
const PORT = process.env.PORT || 5000;

const target = new URL(RENDER_URL);

const server = http.createServer((req, res) => {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));

    req.on("end", () => {
        const body = Buffer.concat(chunks);

        const options = {
            hostname: target.hostname,
            port: target.port || 443,
            path: req.url,
            method: req.method,
            headers: {
                ...req.headers,
                host: target.hostname
            }
        };

        const proxyReq = https.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxyReq.on("error", (err) => {
            console.error("Relay -> backend error:", err.message);
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success: false,
                error: "Relay could not reach the backend. Check your phone's internet connection."
            }));
        });

        if (body.length) proxyReq.write(body);
        proxyReq.end();
    });
});

server.listen(PORT, "127.0.0.1", () => {
    console.log("========================================");
    console.log("        USB RELAY SERVER (on phone)");
    console.log("========================================");
    console.log(`Listening on: http://127.0.0.1:${PORT}`);
    console.log(`Forwarding to: ${RENDER_URL}`);
    console.log("Keep this window open while using the bot.");
    console.log("========================================");
});
