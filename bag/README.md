# este-dls.com — luggage recovery page

A single static page. Someone finds the bag, scans the QR on the tag, and gets
one tap to reach me. No build step, no dependencies, no network requests.

## Before deploying

Edit the config at the top of the `<script>` in `index.html`:

```js
var MODE = "username";   // "phone" | "username"  — currently: username

var CONTACT = {
  name:         "Esteban",
  phone:        "+33600000000",      // unused in username mode — leave as-is
  phoneDisplay: "+33 6 00 00 00 00", // unused in username mode — leave as-is
  whatsapp:     "+33600000000",      // unused in username mode — leave as-is
  username:     "este.dls",          // WhatsApp username, no @
  email:        "este3112008@gmail.com"
};
```

The whole config ships to the browser whichever mode is active, so the phone
fields must stay placeholders while `MODE` is `"username"` — a real number there
would be published in the page source even though nothing renders it.

Use a **dedicated email alias**. This address ends up on a public page and will
attract spam; an alias keeps it out of the main inbox and can be thrown away.

## Choosing MODE

Both modes give the finder **one tap**. `wa.me` accepts a username directly —
undocumented, but verified against WhatsApp's own redirect:

```
wa.me/este.dls      → api.whatsapp.com/send/?text=…&username=este.dls&type=username
wa.me/33612345678   → api.whatsapp.com/send/?phone=33612345678&text=…&type=phone_number
```

Two distinct branches, and the prefilled `?text=` survives on both. So the
username costs the finder nothing in friction.

**`"username"`** (current) — one tap, and no phone number anywhere on the page.
The handle sits in the button's meta slot so the finder can see who they are
about to message.

**`"phone"`** — one tap plus a number to ring, which helps a finder with no
WhatsApp. Cost: the number is published, will eventually be scraped, and a phone
number is painful to change.

> `wa.me` classifies the *shape* of the string; it does not check that the handle
> exists. `wa.me/zzz.not.a.real.handle` also returns `type=username`. So the
> redirect proves the link format works, not that `este.dls` is reachable —
> that needs the end-to-end test below.

> **If you use `"username"`, leave the WhatsApp "username key" (the PIN) OFF.**
> The key is optional, and WhatsApp suggests enabling it precisely when you
> publish your username on a website — but with it on, a stranger who has your
> username *still* cannot message you without the PIN. The two settings are
> contradictory for this page. Publishing the username without the key is still
> a real gain over publishing a number: nothing leaks that ties to you
> elsewhere, no automated calls or SMS are possible, and a username takes ten
> seconds to change.

Usernames only started rolling out in mid-2026, so before trusting `"username"`
on a real bag: open `https://wa.me/este.dls` from a phone that has never
messaged you, ideally someone else's, and check the chat actually opens on you.
If it doesn't, the username key is on — turn it off.

## Where it lives, and the QR code

Deployed at **https://este-dls.com/bag/** — the `bag/` directory of the
`esteban3114/portfolio` repo, which GitHub Pages serves verbatim on push to
`master`.

An unguessable path (`/b/k7f2qm9x/`) was considered and rejected: **the repo is
public**, so anyone can read the path straight out of it. It would have hidden
nothing while making the URL impossible to remember or regenerate a QR for. A
readable path is the honest choice here.

What actually limits exposure:

- `MODE = "username"` — no phone number is on the page at all.
- The email was already published on `este-dls.com` (the portfolio's CONTACT
  section) before this page existed, so this adds no new exposure.
- `noindex, nofollow, noarchive` keeps the page out of search results, which is
  about not being *found by accident*, not about secrecy.

Generate the QR from the full URL including the trailing slash. Print it large
enough to scan in bad light — 3 cm minimum, with a white quiet zone around it.
Error-correction level Q or H so it still reads once the tag is scuffed.

The URL never has to change. If the username or email changes, edit the page —
don't reprint the tag.

## Design notes

The finder is a stranger in a hurry, one hand on the bag, probably not a French
or English speaker, doing me a favour. Everything follows from that.

- **One fixed palette, no dark mode.** This is a signal object like the hi-vis
  label it descends from; it looks the same in every condition. High-contrast
  warm orange also stays readable in direct sunlight, which is where a bag
  abandoned on a kerb actually gets found.
- **System fonts on purpose.** The page has to paint instantly on hostile
  airport wifi and never flash a fallback. The character comes from the setting
  — weight, width, tracking — not from a downloaded face.
- **Actions live in the bottom half.** Thumb zone, one-handed, no scroll needed
  to reach the primary action (`100dvh`, safe-area insets respected).
- **The two edge strips need two different mechanisms.** iOS Safari paints both
  the strip under the status bar and the strip behind the bottom toolbar from the
  *page background* — not from the nearest child, and not from `theme-color`
  (setting that to the panel colour left the top orange anyway). One background
  cannot be orange at the top and pale at the bottom, so:
  - `html, body` stay `--signal`, which handles the top.
  - `.panel` carries `box-shadow: 0 100vh 0 var(--stock)`, extending its own
    colour downwards past the bottom of the page box. A shadow costs nothing in
    layout and starts exactly at the panel's edge, so nothing has to guess where
    the split falls. The wide layout sets `box-shadow: none`, where the panel
    floats as a card and the orange is meant to surround it.

  Three attempts got here: canvas colour on `html` alone did nothing; moving the
  orange onto `.field` and the pale onto the page fixed the bottom and broke the
  top. `.field` is kept because it states the two-field composition in the
  markup, but the page background is what the phone actually reads.
- **WhatsApp ranks first.** It's free internationally and it's text, so a finder
  who shares no language with me can still make contact — and the message is
  pre-filled in their own language, so they only have to hit send.
- **The routing strip is the one bold move.** `FOUND ─────┐` elbowing down into
  the name is the origin/destination device off a real bag tag, encoding the
  journey the bag still has to make. It draws once on load, then nothing else on
  the page ever moves. `prefers-reduced-motion` skips it.

## Languages

Detected from `navigator.languages`, first supported match wins, English is the
fallback. Region subtags collapse to the base language, so `pt-BR` gets
Portuguese rather than falling through to English. A picker in the corner lets
the finder override it.

English, French, Spanish, German, Italian, Portuguese, Dutch, Polish, Turkish,
Russian, Arabic (RTL), Chinese, Japanese, Korean.

To add one, copy any entry in `STRINGS` and translate the values. The key is a
two-letter ISO 639-1 code; add `rtl:true` for right-to-left scripts.

## Possible additions

- A photo of the bag, so the finder can confirm they've matched the right owner
  when several bags are involved. Inline it as a data URI to keep the page
  self-contained.
- A second page on another path for a wallet or a laptop sleeve — same file,
  different `CONTACT` and a different QR.
