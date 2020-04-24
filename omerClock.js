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

let clock = new Clock(document.querySelector("#clock"));
clock.numTicks = 49;
clock.majorTickEvery = 7;
// clock.minorTickLabelEvery = 7;

let weeks = clock.makeHand("weeks");
weeks.gears = function() {
    return omerCalc.weeks(date === null ? undefined : date) / 7 * 2*Math.PI;
};

let days = clock.makeHand("days");
days.gears = function() {
    return omerCalc.days(date === null ? undefined : date) / 7 * 2*Math.PI;
};

// let totalDays = clock.makeHand("totalDays");
// totalDays.gears = function() {
//     return omerCalc.totalDays(date === null ? undefined : date) / 49 * 2*Math.PI;
// };

// clock.addHand(weeks);
// clock.addHand(days);
// clock.addHand(totalDays);

window.addEventListener("resize", () => {
    clock.size();
    clock.layoutTicks();
});

// setTimeout(() => clock.start(), 1000 - (new Date()).getMilliseconds());

clock.start();

function start() {
    let currentCount = 0;
    const interval = setInterval(() => {
        date = new Date(erevPesachDate.getTime() + currentCount * 24 * 60 * 60 * 1000);
        clock.tick();
        currentCount = currentCount + .05;
        if(currentCount > 49) {
            clearInterval(interval);
        }
    }, 10);
}
