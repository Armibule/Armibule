const storage = window.localStorage;
const mainElement = document.getElementById("#main");

// not perfect but it works
function randint(min, max) {
    return min + Math.round((max-min) * Math.random())
}

// async sleep
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), ms)
  });
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

for (var i = 0 ; i < sections.length ; i++) {
  let sectionRect = sections[i].getBoundingClientRect();

  let observer = new IntersectionObserver((entries, _observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting == true) {
        entry.target.classList.add("sectionSeen");
      }
    });
  }, {
    root: mainElement,
    rootMargin: "0px",
    threshold: Math.min(300/sectionRect.height, 0.8),
  });

  observer.observe(sections[i]);
}


const sectionsH2 = document.querySelectorAll(".section h2");

for (var i = 0 ; i < sectionsH2.length ; i++) {

  sectionsH2[i].style.opacity = "0";

  let observer = new IntersectionObserver((entries, _observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting == true) {
        let h2 = entry.target;

        h2.animate([
          {
            opacity: 0,
            transform: "translateY(10px)"
          },
          {
            opacity: 1,
            transform: "translateY(0)"
          }
        ], {
          duration: 800,
          easing: "cubic-bezier(0.08, 1.26, 0.69, 1.08)"
        });

        h2.style.opacity = "";
        observer.unobserve(h2);
      }
    });
  }, {
    root: mainElement,
    rootMargin: "0px",
    threshold: 0.9,
  });

  observer.observe(sectionsH2[i]);
}

const sectionsUl = document.querySelectorAll(".section ul");

for (var i = 0 ; i < sectionsUl.length ; i++) {

  sectionsUl[i].style.opacity = "0";

  let observer = new IntersectionObserver((entries, _observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting == true) {
        let ul = entry.target;

        ul.animate([
          {
            opacity: 0,
            transform: "translateX(-20px)"
          },
          {
            opacity: 1,
            transform: "translatXY(0)"
          }
        ], {
          duration: 500,
          easing: "cubic-bezier(0.08, 1.26, 0.69, 1.08)"
        });

        for (i=0 ; i < ul.children.length ; i++) {
          ul.children[i].style.opacity = "0";
          ul.children[i].animate([
            {
              opacity: 0,
              transform: "translateX(-10px)"
            },
            {
              opacity: 1,
              transform: "translateX(0)"
            }
          ], {
            delay: 100 + i*100,
            duration: 800,
            easing: "cubic-bezier(0.08, 1.26, 0.69, 1.08)",
            fill: "forwards"
          });
        }

        ul.style.opacity = "";
        observer.unobserve(ul);
      }
    });
  }, {
    root: mainElement,
    rootMargin: "0px",
    threshold: 0.6,
  });

  observer.observe(sectionsUl[i]);
}