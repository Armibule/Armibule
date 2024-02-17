const storage = window.localStorage

// not perfect but it works
function randint(min, max) {
    return min + Math.round((max-min) * Math.random())
}

var mouseDown = 0;
document.body.onmousedown = function() { 
  mouseDown += 1;
}
document.body.onmouseup = function() {
  mouseDown -= 1;
}

function isVisible(elm) {
  let rect = elm.getBoundingClientRect();
  let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return 0 <= rect.bottom && rect.top <= viewHeight;
}
