# Live Translator - Embeddable Snippet

**Product:** TrustLayer Translator  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $0.50/minute usage-based  

---

## Overview

Real-time speech-to-speech translation using ElevenLabs STT + OpenAI translation + ElevenLabs TTS.

---

## Quick Start

```html
<div id="tl-translator"></div>
<script src="https://tlid.io/widgets/tl-translator.js" 
        data-site-id="YOUR_SITE_ID"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Speech-to-Text** | ElevenLabs STT engine |
| **AI Translation** | OpenAI GPT-4 translation |
| **Text-to-Speech** | Natural voice output |
| **Bidirectional** | Translates both ways |
| **Multiple Languages** | 20+ languages supported |
| **Conversation Mode** | Back-and-forth dialog |
| **Push-to-Talk** | Hold button to speak |
| **Transcription Log** | Written record of conversation |
| **Speaker Detection** | Auto-detect who's talking |

---

## Supported Languages

| Language | Code |
|----------|------|
| English | `en` |
| Spanish | `es` |
| French | `fr` |
| German | `de` |
| Italian | `it` |
| Portuguese | `pt` |
| Chinese | `zh` |
| Japanese | `ja` |
| Korean | `ko` |
| Arabic | `ar` |
| Russian | `ru` |
| Hindi | `hi` |

---

## Configuration Options

```javascript
TLTranslator.init({
  siteId: 'YOUR_SITE_ID',
  theme: 'dark',
  languages: {
    primary: 'en',
    secondary: 'es'
  },
  mode: 'conversation', // or 'one-way'
  voice: {
    primary: 'alloy', // ElevenLabs voice
    secondary: 'nova'
  },
  features: {
    transcription: true,
    speakerDetection: true,
    autoLanguageDetect: true
  },
  onTranslation: function(data) {
    console.log('Translated:', data);
  }
});
```

---

## Usage & Billing

| Component | Cost |
|-----------|------|
| Speech-to-Text | $0.10/min |
| Translation | $0.20/min |
| Text-to-Speech | $0.20/min |
| **Total** | **$0.50/min** |

Billed per second of actual usage.

---

## Credit Packs

| Pack | Price | Minutes | Per Minute |
|------|-------|---------|------------|
| Starter | $10 | 20 | $0.50 |
| Growth | $40 | 100 | $0.40 |
| Business | $150 | 500 | $0.30 |
| Enterprise | $500 | 2000 | $0.25 |

---

## API Access

```
POST https://tlid.io/api/translate/speech
Authorization: Bearer YOUR_API_KEY
Content-Type: audio/webm

[audio data]

Response:
{
  "original": {
    "text": "Hello, how are you?",
    "language": "en"
  },
  "translated": {
    "text": "Hola, ¿cómo estás?",
    "language": "es",
    "audioUrl": "https://..."
  },
  "duration": 2.5,
  "cost": 1.25
}
```

---

## Use Cases

- **Field crews** communicating with Spanish-speaking workers
- **Customer service** for multilingual callers
- **Sales** meetings with international clients
- **Healthcare** patient communication
- **Construction** sites with diverse crews

---

## White-Label Package

$199 setup + 20% markup on usage
- Your branding
- Custom voice selection
- Volume discounts

---

## Source Location

`client/src/components/live-translator.tsx`  
`server/routes.ts` - translation endpoints

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- English/Spanish focus
- Bidirectional translation
- Conversation mode
