pageName = document.getElementById("errorPageName");
dots = document.getElementById("errorDots");

pageName.innerText = window.location.pathname.replace('/Armibule/', '').replace('.html', '');


async function dotAnim() {
    while (true) {
        dots.innerText = ""
        await sleep(randint(350, 600));

        dots.innerText = "."
        await sleep(randint(350, 600));

        dots.innerText = ".."
        await sleep(randint(350, 600));

        dots.innerText = "..."
  
        await sleep(randint(1000, 2000));
    }
  }
  
  dotAnim();