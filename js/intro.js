const introElement = document.getElementById("intro")


const STAR_MIN_X = -500
const STAR_MAX_X = 1100

const STAR_MIN_Y = -800
const STAR_MAX_Y = 500

const STAR_MIN_Z = -2000
const STAR_MAX_Z = 0

const STAR_MIN_SATURATE = 1000
const STAR_MAX_SATURATE = 2000

const STAR_MIN_HUE = 0
const STAR_MAX_HUE = 360

const STAR_MIN_SCALE = 100
const STAR_MAX_SCALE = 3000


// not perfect but it works
function randint(min, max) {
    return min + Math.round((max-min) * Math.random())
}

function spawnStar() {
    star = document.createElement("div")

    star.classList.add("introStar")

    let x = randint(STAR_MIN_X, STAR_MAX_X)
    let y = randint(STAR_MIN_Y, STAR_MAX_Y)
    let z = randint(STAR_MIN_Z, STAR_MAX_Z)

    /*star.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`*/
    star.style.filter = `hue-rotate(${randint(STAR_MIN_HUE, STAR_MAX_HUE)}deg) saturate(${randint(STAR_MIN_SATURATE, STAR_MAX_SATURATE)/1000})`
    star.style.scale = randint(STAR_MIN_SCALE, STAR_MAX_SCALE) / 1000

    star.animate(
        [
            {
                transform: `translate3d(${x}px, ${y}px, ${z}px)`
            },
            {
                transform: `translate3d(${x}px, ${y}px, ${z + 1000}px)`
            },
          ],
          5000
    )

    introElement.appendChild(star)

    return star
}

function spawnStars(count) {
    spawned = []
    for (i = 0 ; i < count ; i++) {
        spawned.push(spawnStar())
    }
    return spawned
}

const stars = spawnStars(200)

// remove all stars after animation
setTimeout(() => {
    stars.forEach((star) => {
        star.remove()
    })
}, 6000)