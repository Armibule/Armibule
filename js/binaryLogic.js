redWires = document.getElementsByClassName("redWire");
grayWires = document.getElementsByClassName("grayWire");
redAlim = document.getElementsByClassName("redAlim")[0];

let pathLength;

redAlim.animate([
    {
        strokeDasharray: 4,
        strokeDashoffset: 0
    },
    {
        strokeDasharray: 4,
        strokeDashoffset: 8
    }
], {
    duration: 2000,
    iterations: Infinity
});

for (let i = 0 ; i < redWires.length ; i++) {
    redWires[i].style.opacity = 0;
    redWires[i].animate([
        {
            opacity: 0
        },
        {
            opacity: 1
        }
    ], {
        delay: 4100,
        duration: 1000 + (i * i * 137) % 500,
        fill: "forwards"
    });

    pathLength = grayWires[i].getTotalLength();

    redWires[i].animate([
        {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength * 2
        },
        {
            strokeDasharray: pathLength,
            strokeDashoffset: 0
        }
    ], {
        delay: (i * 731) % 2000,
        duration: 2000 + (i * i * 59) % 100,
        iterations: Infinity,
        easing: "ease-in"
    });
}


for (let i = 0 ; i < grayWires.length ; i++) {
    pathLength = grayWires[i].getTotalLength();

    grayWires[i].style.strokeDasharray = pathLength;
    grayWires[i].style.strokeDashoffset = pathLength;
    grayWires[i].animate([
        {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        },
        {
            strokeDasharray: pathLength,
            strokeDashoffset: 0
        }
    ], {
        delay: (i * 731) % 2000,
        duration: 2000 + (i * i * 59) % 100,
        fill: "forwards",
        easing: "ease-out"
    });
}

/* Binary Converter */

const switches = document.getElementsByClassName("bitSwitch");
const binaryConverterResult = document.getElementById("binaryConverterResult");

var resultValue = 0;
var resultValueDisplayed = 0;

function updateResult(depth=5) {
    if (depth <= 0) {
        resultValueDisplayed = resultValue;
        binaryConverterResult.innerText = resultValue;
        return
    } else if (depth == 5) {
        binaryConverterResult.animate([
            {
                opacity: 0.7
            }, {
                opacity: 1
            }
        ], 100)
        binaryConverterResult.animate([
            {
                color: "var(--contrastLow)"
            }, {
                color: "var(--secondary)"
            }
        ], 500)
    }

    resultValueDisplayed += Number.parseInt((resultValue - resultValueDisplayed) / 4);
    binaryConverterResult.innerText = resultValueDisplayed;
    setTimeout(() => {
        updateResult(depth-1)
    }, 20)
}

switches.forEach((item) => {
    let state = item.firstChild;
    state.onclick = function() {
        if (item.classList.contains("bitSwitchOn")) {
            item.classList.remove("bitSwitchOn");
            state.innerText = "0";
            resultValue -= Number.parseInt(item.dataset.value);
            console.log(item.dataset.value)
        } else {
            item.classList.add("bitSwitchOn");
            state.innerText = "1";
            resultValue += Number.parseInt(item.dataset.value);
        }
        updateResult()
    }
})


/* SHADER */

/*
let exampleShader;
const parent = "binaryLogicHero";
var Cheight = document.getElementById(parent).getClientRects()[0].height;
var Cwidth = document.body.getClientRects()[0].width;


function preload() {
    exampleShader = loadShader("../shaders/logic.vert", "../shaders/logic.frag");
}

function setup() {
    const canvas = createCanvas(Cwidth, Cheight, WEBGL);
    canvas.canvas.id = "heroCanvas";
    canvas.parent(parent);

    shader(exampleShader);

    onResize();

    window.addEventListener('resize', onResize, true);

    noStroke();
}

function onResize() {
    Cheight = document.getElementById(parent).getClientRects()[0].height;
    Cwidth = document.body.getClientRects()[0].width;

    if (Cwidth > 2000) {
        Cheight *= 2000 / Cwidth;
        Cwidth = 2000;
    }

    resizeCanvas(Cwidth, Cheight);

    exampleShader.setUniform("yRatio", Cwidth / Cheight);
}

function draw() {
    if (!isVisible(canvas)) {
        return;
    }

    let mx = min(1, max(0, (mouseX / width)));
    let my = 1 - min(1, max(0, (mouseY / height)));

    // exampleShader.setUniform("hand", [mx, my]);

    clear();

    rect(0, 0, width, height);
}*/
