#!/usr/bin/env python3
"""Builds preview.html: every component with real texts, in one self-contained page.
Run after changing tokens.css, components.css or icons.svg:  python3 build_preview.py"""
import pathlib

here = pathlib.Path(__file__).parent
css = (here / "tokens.css").read_text(encoding="utf-8") + "\n" + (here / "components.css").read_text(encoding="utf-8")
icons = (here / "icons.svg").read_text(encoding="utf-8").split("-->", 1)[1]
I = lambda name, sm=False: f'<svg class="icon{" icon--sm" if sm else ""}" aria-hidden="true"><use href="#i-{name}"/></svg>'

body = f"""
<div class="app">
  <header class="app-header">
    <h1 class="app-header__title">Statement</h1>
    <span class="chip-proto">Prototype · demo data</span>
    <div class="app-header__date">Today: 23 September 2025
      <button class="btn btn--ghost" type="button">{I('jump', True)} Jump ahead</button></div>
  </header>

  <h2 class="day">Tuesday, 23 September 2025</h2>
  <ul class="statement">
    <li><button class="line" type="button"><span class="line__main"><span class="line__merchant">Credit card</span><span class="line__original">Kreditkarten-Zahlung 2025-09-23</span></span><span class="line__flag">{I('bulb', True)}<span class="visually-hidden">Worth a look</span></span><span class="line__amount">−10'018.53</span></button></li>
    <li><button class="line" type="button"><span class="line__main"><span class="line__merchant">Employer AG</span><span class="line__original">Salärzahlung Employer AG</span></span><span class="line__flag">{I('bulb', True)}<span class="visually-hidden">Worth a look</span></span><span class="line__amount line__amount--in">+7'464.00</span></button></li>
  </ul>
  <h2 class="day">Thursday, 18 September 2025</h2>
  <ul class="statement">
    <li><button class="line" type="button"><span class="line__main"><span class="line__merchant">Swiss Intl. Airlines</span><span class="line__original">Swiss Intl. Airlines 2025-09-18</span></span><span class="line__flag line__flag--action">{I('action', True)}<span class="visually-hidden">Action needed</span></span><span class="line__amount">−1'766.50</span></button></li>
    <li><button class="line" type="button"><span class="line__main"><span class="line__merchant">Swiss Intl. Airlines</span><span class="line__original">Swiss Intl. Airlines 2025-09-18 #5</span></span><span class="line__flag line__flag--attention">{I('attention', True)}<span class="visually-hidden">Worth a check</span></span><span class="line__amount">−98.00</span></button></li>
    <li><button class="line" type="button"><span class="line__main"><span class="line__merchant">Paypal</span><span class="line__original">Paypal 2025-09-18</span></span><span class="line__amount">−67.00</span></button></li>
  </ul>
</div>

<p class="label">Answer sheet, normal tone (shown inline here; in the app it slides up from the bottom)</p>
<section class="sheet sheet--static is-open" role="dialog" aria-label="Credit card, 10'018.53 CHF">
  <div class="sheet__handle"></div>
  <button class="sheet__close" type="button" aria-label="Close">{I('close')}</button>
  <div class="sheet__head"><p class="sheet__merchant">Credit card</p><p class="sheet__amount">−10'018.53 CHF</p><span class="sheet__meta">23 September 2025 · Credit card payment</span></div>
  <div class="section"><h3 class="section__title">What it is</h3><p>Kreditkarten-Zahlung: paying off your credit card. This one line pays for everything you bought with the card between 24 August and 23 September.</p></div>
  <div class="section"><h3 class="section__title">Your picture</h3><p>Behind it: 28 purchases and 5 refunds, 10'205.97 CHF net. The biggest: Swiss Intl. Airlines 7'458.00 CHF (8 charges) and Apple Online Store 2'273.00 CHF (6 charges). It is the largest card bill so far this year.</p></div>
  <div class="worth">{I('info')}<div><p class="worth__title">Worth knowing</p><p>A card bill feels like one payment, but it is many decisions made weeks earlier. Paying the full amount each month avoids card interest, which is usually much higher than on a normal loan.</p></div></div>
  <p class="wit">Your salary and your card bill met on the same day, 23 September. The bill was 2'554.53 CHF bigger.</p>
  <div class="chips">
    <button class="chip" type="button" aria-pressed="true">What did I buy with the card?</button>
    <button class="chip" type="button" aria-pressed="false">Why is the bill different from my card purchases?</button>
    <button class="chip" type="button" aria-pressed="false">How does this bill compare with the others?</button>
  </div>
  <div class="reply"><p class="reply__q">What did I buy with the card?</p><p>The biggest amounts between 24 August and 23 September: Swiss Intl. Airlines 7'458.00 CHF (8 charges), Apple Online Store 2'273.00 CHF (6 charges), Amazon 246.33 CHF (2 charges), Abercrombie &amp; Fitch 125.19 CHF (2 charges) and Paypal 78.25 CHF (2 charges).</p></div>
  <div class="reply reply--loading"><p>Looking at your lines…</p></div>
  <form class="ask" onsubmit="return false"><label class="ask__label" for="ask1">Ask about this line</label>
    <div class="ask__row"><input class="ask__input" id="ask1" type="text"><button class="ask__send" type="submit" aria-label="Send">{I('send', True)}</button></div></form>
</section>

<p class="label">Answer sheet, action tone</p>
<section class="sheet sheet--static is-open" role="dialog" aria-label="Swiss Intl. Airlines, 1'766.50 CHF">
  <div class="sheet__handle"></div>
  <button class="sheet__close" type="button" aria-label="Close">{I('close')}</button>
  <div class="sheet__head"><p class="sheet__merchant">Swiss Intl. Airlines</p><p class="sheet__amount">−1'766.50 CHF</p><span class="sheet__meta">18 September 2025 · Card purchase</span></div>
  <div class="tone tone--action">{I('action')}<div class="tone__content"><p class="tone__title">Okay, no jokes this time.</p><p class="tone__body">4 charges of 1'766.50 CHF from Swiss Intl. Airlines on 18 September: 7'066.00 CHF together, 24% of a monthly salary. Was this you?</p>
    <div class="tone__actions"><button class="btn btn--primary" type="button">Yes, these are mine</button><button class="btn btn--secondary" type="button">Check with my bank</button></div></div></div>
  <div class="section"><h3 class="section__title">Your picture</h3><p>There are also 4 charges of 98.00 CHF from the same airline on the same day, which suggests one booking with several passengers. The statement alone cannot confirm it.</p></div>
</section>

<p class="label">Answer sheet, attention tone</p>
<section class="sheet sheet--static is-open" role="dialog" aria-label="Swiss Intl. Airlines, 98.00 CHF">
  <div class="sheet__head"><p class="sheet__merchant">Swiss Intl. Airlines</p><p class="sheet__amount">−98.00 CHF</p><span class="sheet__meta">18 September 2025 · Card purchase</span></div>
  <div class="tone tone--attention">{I('attention')}<div class="tone__content"><p class="tone__title">Worth a check</p><p class="tone__body">There are 4 identical charges of 98.00 CHF from Swiss Intl. Airlines on 18 September. That can be normal, such as several tickets or items, or a mistake.</p></div></div>
</section>

<p class="label">Time jump (full screen in the app)</p>
<div class="jump jump--static is-on"><p class="jump__date">23 December 2025</p><p class="jump__sub">Three months later</p></div>
"""
preview_css = """
/* preview only: show overlays inline */
.label { max-width: var(--content-max); margin: var(--sp-xxl) auto var(--sp-sm); padding: 0 var(--sp-lg);
  font-size: var(--fs-caption); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--text-muted); }
.app { min-height: auto; }
.sheet--static { position: relative; transform: none; max-height: none; box-shadow: var(--shadow-sheet); }
.jump--static { position: relative; inset: auto; min-height: 320px; max-width: var(--content-max); margin: 0 auto var(--sp-xxl); }
"""
html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Beyond the List · components</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<style>
{css}
{preview_css}
</style></head>
<body>{icons}{body}</body></html>
"""
(here / "preview.html").write_text(html, encoding="utf-8")
print("wrote preview.html,", len(html), "bytes")
