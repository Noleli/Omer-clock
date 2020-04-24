"use strict";

class Clock {
    constructor(container) {
        this.container = container;

        this.props = {};
        this.props.majorTickEvery = 0;
        this.props.minorTickLabelEvery = 0;

        this.face = this.container.appendChild(document.createElement("div"));
        this.face.classList.add("face");

        this.centeredContainer = this.face.appendChild(document.createElement("div"));
        this.centeredContainer.classList.add("centeredContainer");
        
        this.ticksContainer = this.centeredContainer.appendChild(document.createElement("div"));
        
        this.hands = [];

        this.props.sizeFrom = "min";
        this.size();
    }

    get sizeFrom() {
        return this.props.sizeFrom;
    }
    set sizeFrom(sf) {
        this.props.sizeFrom = sf;
        this.size();
        this.layoutTicks();
    }

    get numTicks() {
        return this.props.numTicks;
    }
    set numTicks(nt) {
        this.props.numTicks = nt;
        this.layoutTicks();
    }

    get majorTickEvery() {
        return this.props.majorTickEvery;
    }
    set majorTickEvery(n) {
        this.props.majorTickEvery = n;
        this.layoutTicks();
    }

    get minorTickLabelEvery() {
        return this.props.minorTickLabelEvery;
    }
    set minorTickLabelEvery(n) {
        this.props.minorTickLabelEvery = n;
        this.layoutTicks();
    }

    layoutTicks() {
        this.ticksContainer.querySelectorAll(".tickContainer,.number,.minorNumber").forEach(t => t.remove());
        for(let i = 0; i < this.numTicks; i++) {
            let majorTick = i % this.majorTickEvery === 0;
            let minorTickLabel = i % this.minorTickLabelEvery === 0;

            let tickContainer = this.ticksContainer.appendChild(document.createElement("div"));
            tickContainer.classList.add("tickContainer");
            let tick = tickContainer.appendChild(document.createElement("div"));

            tick.classList.add("tick");

            if(majorTick) {
                tick.classList.add("majorTick");
            }

            let angle = (i/this.numTicks) * (2 * Math.PI);
            let position = Clock.pointRadial(angle, this.radius);
            let width = parseFloat(window.getComputedStyle(tickContainer).width);

            tickContainer.style.left = position[0] + "px";
            tickContainer.style.top = position[1] + "px";
            tickContainer.style.transform = `translate(${-width/2}px) rotate(${angle}rad`;

            if(majorTick) {
                let number = this.ticksContainer.appendChild(document.createElement("div"));
                number.classList.add("number");
                number.innerText = i == 0 ? (this.numTicks/this.majorTickEvery) :  (i/this.majorTickEvery);

                let numWidth = parseFloat(window.getComputedStyle(number).width);
                let numHeight = parseFloat(window.getComputedStyle(number).height);
                let numMargin = parseFloat(window.getComputedStyle(number).getPropertyValue("--margin-ratio")) * this.radius * 2;
                
                let numPosition = Clock.pointRadial(angle, this.radius - numMargin);
                
                number.style.left = (numPosition[0] - numWidth/2) + "px";
                number.style.top = (numPosition[1] - numHeight/2) + "px";
            }

            if(minorTickLabel) {
                let number = this.ticksContainer.appendChild(document.createElement("div"));
                number.classList.add("minorNumber");
                number.innerText = i == 0 ? this.numTicks : i;

                let numWidth = parseFloat(window.getComputedStyle(number).width);
                let numHeight = parseFloat(window.getComputedStyle(number).height);
                let numMargin = parseFloat(window.getComputedStyle(number).getPropertyValue("--margin-ratio")) * this.radius * 2;
                
                let numPosition = Clock.pointRadial(angle, this.radius - numMargin);
                
                number.style.left = (numPosition[0] - numWidth/2) + "px";
                number.style.top = (numPosition[1] - numHeight/2) + "px";
            }
        }
    }

    makeHand(name) {
        let hand = new Hand(name);
        this.addHand(hand);
        return hand;
    }
    
    addHand(hand) {
        this.centeredContainer.appendChild(hand.container);
        this.hands.push(hand);
    }

    tick() {
        this.hands.forEach(h => h.tick());
    }

    size() {
        this.container.style.setProperty("width", null);
        this.container.style.setProperty("height", null);
        
        let padding = parseFloat(window.getComputedStyle(this.face)["padding-left"]);
        let width = parseFloat(window.getComputedStyle(this.container).width);
        let height = parseFloat(window.getComputedStyle(this.container).height);
        let diameter;
        if(this.sizeFrom == "min") {
            diameter = Math.min(width, height) - 2 * padding - 2;
        }
        else if(this.sizeFrom == "width") {
            diameter = width - 2 * padding - 2;
        }
        else if(this.sizeFrom == "height") {
            diameter = height - 2 * padding - 2;
        }
        this.container.style.setProperty("width", diameter + "px");
        this.container.style.setProperty("height", diameter + "px");
        this.container.style.setProperty("--outer-diameter", diameter + "px");
        let border = parseFloat(window.getComputedStyle(this.container)["border-bottom-width"]);
        this.radius = diameter/2 - 2 * padding - border;
        this.container.style.setProperty("--diameter", (2 * this.radius) + "px");
    }

    static pointRadial(theta, r) {
        return [r * Math.cos(theta - Math.PI/2), r * Math.sin(theta - Math.PI/2)];
    }
}

class Hand {
    constructor(name) {
        this.name = name;
        this.params = {};
        this.gears = () => {};
        this.container = document.createElement("div");
        this.container.classList.add("hand");
        this.container.classList.add(this.name);
    }
    
    get angle() {
        return this.params.angle;
    }
    set angle(a) {
        this.params.angle = a;
        this.container.style.transform = `rotate(${this.params.angle}rad)`;
    }

    tick() {
        this.angle = this.gears();
    }
}
