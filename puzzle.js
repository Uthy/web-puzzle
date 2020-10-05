const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

class Puzzle {
    constructor(el, width = 16, height = 24, row = 4, col = 4, gap = 1) {
        this.el = el;
        this.fragments = el.children;
        this.width = width;
        this.height = height;
        this.row = row;
        this.col = col;
        this.gap = gap;
    }

    // Create Puzzle
    create() {
        this.ids = [...Array(this.row * this.col).keys()];
        const puzzle = this.el;
        const fragments = this.fragments;
        if (fragments.length) {
            Array.from(fragments).forEach((item) => item.remove());
        }
        puzzle.style.setProperty("--puzzle-width", this.width + "rem");
        puzzle.style.setProperty("--puzzle-height", this.height + "rem");
        puzzle.style.setProperty("--puzzle-row", this.row);
        puzzle.style.setProperty("--puzzle-col", this.col);
        puzzle.style.setProperty("--puzzle-gap", this.gap + "px");
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                const fragment = document.createElement("div");
                fragment.className = "fragment";
                fragment.style.setProperty("--x", j);
                fragment.style.setProperty("--y", i);
                fragment.style.setProperty("--i", j + i * this.col);
                puzzle.appendChild(fragment);
            }
        }
    }

    // Re-Ordering Fragments
    reorder(newIds) {
        const fragments = this.fragments;
        for (let id = 0; id < this.ids.length; id++) {
            fragments[id].style.setProperty("--order", newIds[id]);
        }
    }

    // Shuffle The Puzzle 
    shuffle() {
        const shuffledIds = shuffle(this.ids);
        this.reorder(shuffledIds);
    }
}

class Sortable {
    constructor(el, total) {
        let that = this;
        this.el = el;
        this.total = total;
        this.riseAnime = gsap.to(el, {
            boxShadow: "0 16px 32px rgba(0,0,0,0.3)",
            scale: 1.1,
            duration: 0.3,
            paused: true,
        });
        this.draggie = new Draggable(el, {
            onDragStart: function() {
                that.riseAnime.play();
            },
            onRelease: function() {
                that.riseAnime.reverse();
                const total = that.total;
                let hitTargets = [];
                for (const item of total) {
                    if (this.hitTest(item, "70%")) {
                        hitTargets.push(item);
                    }
                }
                if (hitTargets.length === 1) {
                    const target = this.target;
                    const hitTarget = hitTargets[0];
                    const targetOrder = target.style.getPropertyValue("--order");
                    const hitTargetOrder = hitTarget.style.getPropertyValue("--order");
                    target.style.setProperty("--order", hitTargetOrder);
                    hitTarget.style.setProperty("--order", targetOrder);
                    gsap.to(target, {
                        x: 0,
                        y: 0,
                        duration: 0,
                    });
                } else {
                    gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                    });
                }
                const orders = Array.from(that.total).map((item) => item.style.getPropertyValue("--order"));
                const ids = Array.from(that.total).map((item) => item.style.getPropertyValue("--i"));
                if (orders.toString() === ids.toString()) {
                    sleep(300).then(() => {
                        var showShare = document.getElementById("share");
                        showShare.classList.add("show");
                        timerStopFunction();
                    });
                }
            },
        });
    }
}

const puzzle = new Puzzle(document.querySelector(".puzzle"));

const start = () => {
    puzzle.create();
    puzzle.shuffle();
    const fragments = puzzle.fragments;
    const sortables = Array.from(fragments).map((item) => new Sortable(item, fragments));
};

//Timer
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var theTimer = setInterval(setTime, 1000);

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function timerStopFunction() {
    clearInterval(theTimer);
}

// function timer() {
//     let timer = document.getElementById('timer')
//     let time = 0

//     let ticker = setInterval(function() {
//         timer.innerHTML = time
//         time++;
//     }, 1000)
// }
// timer();

// function tickerStopFunction() {
//     clearInterval(timer);
// }

start();
