"use strict";

class OmerCalculator {
    constructor(erevPesachDate) {
        this.erevPesachDate = erevPesachDate;
        this.fractional = false;
    }

    elapsedDays(start, end) {
        let days = (end - start) / (1 * 24 * 60 * 60 * 1000);
        if(this.fractional) {
            return days;
        }
        else {
            return Math.floor(days);
        }
    }

    totalDays(date) {
        if(date === undefined) {
            date = new Date(Date.now());
        }

        return this.elapsedDays(this.erevPesachDate, date);
    }

    days(date) {
        return this.totalDays(date) % 7;
    }

    weeks(date) {
        let w = this.totalDays(date)/7;
        if(this.fractional) {
            return w;
        }
        else{
            return Math.floor(w);
        }
    }
}

const erevPesachDate = new Date(2020, 3, 8, 21, 0);
const omerCalc = new OmerCalculator(erevPesachDate);
omerCalc.fractional = true;

let date = null;

const clock = new Clock(document.querySelector("#clock"));
clock.numTicks = 49;
clock.majorTickEvery = 7;

const weeks = clock.makeHand("weeks");
weeks.gears = function() {
    return omerCalc.weeks(date) / 7 * 2*Math.PI;
};

const days = clock.makeHand("days");
days.gears = function() {
    return omerCalc.days(date) / 7 * 2*Math.PI;
};

// const totalDays = clock.makeHand("totalDays");
// totalDays.gears = function() {
//     return omerCalc.totalDays(date) / 49 * 2*Math.PI;
// };

window.addEventListener("resize", () => {
    clock.size();
    clock.layoutTicks();
});

let runningInterval;
function start() {
    runningInterval = setInterval(() => {
        date = new Date(Date.now());
        clock.tick();
    }, 1000);
}

function stop() {
    clearInterval(runningInterval);
}
