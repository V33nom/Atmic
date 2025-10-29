// src/pages/APIPage.jsx
import React from "react";
import "./Api.css";

export default function APIPage() {
  const baseURL = "https://your-api-domain.example.com"; // replace with your real URL

  return (
    <main className="rv-api-page">
      <section className="rv-api-hero">
        <div className="rv-api-hero-left">
          {/* Inline SVG logo (keeps it single-file, editable) */}
          <div className="rv-api-logo" aria-hidden>
            <svg viewBox="0 0 100 100" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#f8efe3" />
              <g transform="translate(12,12)" fill="none" stroke="#6b3f1b" strokeWidth="3">
                <path d="M10 14 C20 6, 40 6, 50 14" strokeLinecap="round" />
                <path d="M10 24 C20 16, 40 16, 50 24" strokeLinecap="round" />
                <path d="M28 46 L36 30 L44 46 Z" fill="#6b3f1b" stroke="none" />
                <rect x="2" y="4" width="62" height="44" rx="3" stroke="#6b3f1b" />
              </g>
            </svg>
          </div>

          <h1 className="rv-api-title">Rigveda Insights — Public API</h1>
          <p className="rv-api-sub">
            Programmatic access to Rigveda (Mandala 1–10). Fetch hymns, search by deity/theme, ask the Rigveda AI chatbot, and bring ancient wisdom into your app.
          </p>

          <div className="rv-api-cta-row">
            <a className="rv-btn rv-btn-primary" href="#endpoints">See Endpoints</a>
            <a className="rv-btn rv-btn-ghost" href="#examples">Try Example</a>
          </div>
        </div>

        <div className="rv-api-hero-right">
          <div className="rv-api-card">
            <div className="rv-api-card-label">Base URL</div>
            <div className="rv-api-base">{baseURL}</div>

            <div className="rv-api-card-label" style={{ marginTop: 14 }}>Health check</div>
            <div className="rv-api-health">{baseURL}/api/hymns</div>
          </div>

          <div className="rv-api-quick">
            <div className="rv-api-quick-title">Quick curl</div>
            <pre className="rv-code">
{`curl -s ${baseURL}/api/hymns | jq '.'`}
            </pre>
          </div>
        </div>
      </section>

      <section id="endpoints" className="rv-api-section">
        <h2 className="rv-section-title">Endpoints</h2>

        <div className="rv-endpoints-grid">
          <article className="rv-endpoint">
            <h3>/api/hymns</h3>
            <p>GET — Returns all hymns (Mandala 1–10). Includes <code>mandala, hymn, verse, sanskrit, translation, deities, themes</code>.</p>
            <div className="rv-endpoint-ex">Example: <code>{baseURL}/api/hymns</code></div>
          </article>

          <article className="rv-endpoint">
            <h3>/api/hymns/mandala/:id</h3>
            <p>GET — Fetch all hymns for a specific mandala (1–10).</p>
            <div className="rv-endpoint-ex">Example: <code>{baseURL}/api/hymns/mandala/1</code></div>
          </article>

          <article className="rv-endpoint">
            <h3>/api/hymns/search?q=</h3>
            <p>GET — Keyword search across translations, Sanskrit, and meanings.</p>
            <div className="rv-endpoint-ex">Example: <code>{baseURL}/api/hymns/search?q=agni</code></div>
          </article>

          <article className="rv-endpoint">
            <h3>/api/chatbot/ask</h3>
            <p>POST — AI assistant answers only from Rigveda (Mandala 1–10). Request body: <code>{`{ "question": "..." }`}</code></p>
            <div className="rv-endpoint-ex">Example: <code>POST {baseURL}/api/chatbot/ask</code></div>
          </article>

          <article className="rv-endpoint">
            <h3>/api/narration/:id?</h3>
            <p>GET — Retrieve single mantra by id or get a random mantra if no id provided. Includes explanation and life lesson.</p>
            <div className="rv-endpoint-ex">Example: <code>{baseURL}/api/narration/RV1.1.1</code></div>
          </article>
        </div>
      </section>

      <section id="examples" className="rv-api-section">
        <h2 className="rv-section-title">Code Examples</h2>

        <div className="rv-api-examples">
          <div className="rv-example-card">
            <div className="rv-example-title">JavaScript (fetch)</div>
            <pre className="rv-code">
{`fetch("${baseURL}/api/hymns/mandala/1")
  .then(r => r.json())
  .then(data => console.log(data));`}
            </pre>
          </div>

          <div className="rv-example-card">
            <div className="rv-example-title">Node (Chat)</div>
            <pre className="rv-code">
{`fetch("${baseURL}/api/chatbot/ask", {
  method: "POST",
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({question: "What does Rigveda say about creation?"})
})
.then(res => res.json()).then(r => console.log(r));`}
            </pre>
          </div>

          <div className="rv-example-card">
            <div className="rv-example-title">Share / Embed</div>
            <p className="rv-small">Use the Daily Wisdom snippet endpoint to embed daily verse widgets in pages.</p>
            <pre className="rv-code">
{`<iframe src="${baseURL}/embed/dailywisdom" style="width:100%;height:220px;border:0"></iframe>`}
            </pre>
          </div>
        </div>
      </section>

      <section className="rv-api-section rv-api-footer-section">
        <div className="rv-footer-col">
          <h4>Getting started</h4>
          <ol>
            <li>Sign up and get your API key (if you enable auth).</li>
            <li>Use the <code>/api/hymns</code> endpoints to fetch data.</li>
            <li>Try the chatbot but keep questions Rigveda-only.</li>
          </ol>
        </div>

        <div className="rv-footer-col">
          <h4>Notes</h4>
          <p className="rv-small">All translations used are public-domain (Griffith) — attribute if you republish. The AI chatbot is constrained to Mandala 1–10 answers only.</p>
        </div>
      </section>
    </main>
  );
}
            