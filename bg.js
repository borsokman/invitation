// Background: all photos in random order, crossfading every 3 seconds.
(function () {
  const INTERVAL = 3000;
  // index page uses BG_PHOTOS; other pages (gallery) use the full PHOTOS list
  const isIndex = !!document.getElementById("rsvp");
  const photos = ((isIndex && window.BG_PHOTOS) || window.PHOTOS || []).slice();
  const layers = document.querySelectorAll(".bg-layer");
  if (!photos.length || layers.length < 2) return;

  // Fisher–Yates shuffle; reshuffled each time the whole set has been shown
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  let order = shuffle(photos.slice());
  let pos = 0;
  function nextSrc() {
    if (pos >= order.length) {
      const last = order[order.length - 1];
      order = shuffle(photos.slice());
      if (order.length > 1 && order[0] === last) order.push(order.shift());
      pos = 0;
    }
    return "photos/" + order[pos++];
  }

  // Only swap once the next image has finished downloading, so there is never a blank frame.
  function preload(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => resolve(src);
      img.src = src;
    });
  }

  let front = 0;
  let pending = preload(nextSrc());

  async function step() {
    const src = await pending;
    const layer = layers[1 - front];
    layer.style.backgroundImage = 'url("' + src + '")';
    layer.classList.add("show");
    layers[front].classList.remove("show");
    front = 1 - front;
    pending = preload(nextSrc());           // start loading the next one now
    setTimeout(step, INTERVAL);
  }
  step();
})();
