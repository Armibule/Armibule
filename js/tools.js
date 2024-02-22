const storage = window.localStorage;
const mainElement = document.getElementById("#main");

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

function isHovered(elm) {
  return elm.matches(':hover')
}

// section animations

const sections = document.querySelectorAll(".section");

let observer;
for (var i = 0 ; i < sections.length ; i++) {
  observer = new IntersectionObserver((entries, _observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting == true) {
        entry.target.classList.add("sectionSeen");
      }
    });
  }, {
    root: mainElement,
    rootMargin: "0px",
    threshold: 0.4,
  });

  observer.observe(sections[i]);
}