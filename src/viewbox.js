// Pure framing math for the SVG "camera". Every box matches the screen
// aspect ratio so `preserveAspectRatio="xMidYMid slice"` never crops it.

export const isPortrait = (aspect) => aspect < 0.9;

/** Frame a part: landscape → part on the right (card on the left); portrait → part near the top (card below). */
export function focusBox({ cx, cy, size }, aspect) {
  if (isPortrait(aspect)) {
    const w = size * 1.15;
    const h = w / aspect;
    return { x: cx - w / 2, y: cy - h * 0.3, w, h };
  }
  const h = size * 1.25;
  const w = h * aspect;
  return { x: cx - w * 0.66, y: cy - h / 2, w, h };
}

/** Smallest box of `aspect` that is completely filled by `rect`. */
export function coverBox(rect, aspect) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  let w = rect.w;
  let h = w / aspect;
  if (h > rect.h) { h = rect.h; w = h * aspect; }
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** Box of `aspect` that shows all of `rect`, padded by factor `pad`. */
export function containBox(rect, aspect, pad = 1.1) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  let w = rect.w * pad;
  let h = w / aspect;
  if (h < rect.h * pad) { h = rect.h * pad; w = h * aspect; }
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

export const toViewBox = ({ x, y, w, h }) =>
  `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`;
