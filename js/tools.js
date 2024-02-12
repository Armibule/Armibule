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
