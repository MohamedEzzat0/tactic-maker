import Player from "./tools/player.js";
import Cone from "./tools/cone.js";
import {stadium, cards, playerContainer} from "./event.js";
import Text from "./tools/text.js";
import Rect from "./tools/rect.js";
import Observer from "./observer.js";
import Line from "./tools/line.js";
import * as event from "./event.js";

export const reset = new Observer();
reset.subscribe(deleteAllElem);
reset.subscribe(() => {
    Player.map = [];
    Cone.map = [];
    Text.map = [];
    Rect.map = [];
    Line.map = [];
});

export let lineupMap = {};

export function render() {
    deleteAllElem([".playground-player", ".player-card", ".playground-cone", ".text", ".rect", '.line']);

    Player.playerNum = Player.map.length;
    addElem(playerContainer, Player.map);
    addElem(stadium, Cone.map);
    addElem(stadium, Text.map);
    addElem(stadium, Rect.map);
    addElem(stadium, Line.map);

    lineupMap = {
        player: Player.map,
        cone: Cone.map,
        line: Line.map,
        rect: Rect.map,
        text: Text.map,
    };
    console.log(lineupMap);
}

function addElem(place, elem){
    for (let element of elem) {
        place.appendChild(element.build());
    }
}

//Alternative way to select elements from dom
export function $(className) {
    return document.querySelector(className);
}
export function $$(className) {
    return document.querySelectorAll(className);
}

//Create lines by start position and end position
export function createLine(x1, y1, x2, y2) {
    let distance = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));

    let xMid = (x1 + x2) / 2;
    let yMid = (y1 + y2) / 2;

    let slopeInRadian = Math.atan2(y1 - y2, x1 - x2);
    let slopeInDegrees = (slopeInRadian * 180) / Math.PI;

    let line = {}
    line.width = `${distance}px`;
    line.top = `${yMid}px`;
    line.left = `${xMid - (distance / 2)}px`;
    line.transform = `rotate(${slopeInDegrees}deg)`;
    return line;
}
export function createLineById(x1, y1, x2, y2) {
    let style = createLine(x1, y1, x2, y2);
    let line = document.getElementById('base-line');
    line.style.width = style.width;
    line.style.top = style.top
    line.style.left = style.left
    line.style.transform = style.transform;
}

export function getPosition(e, stadiumImg) {
    let cRect = stadiumImg.getBoundingClientRect();
    let position = {};
    position.x = Math.round(e.clientX - cRect.left);
    position.y = Math.round(e.clientY - cRect.top);
    return position
}

//to add opacity or alpha value to colors
export function addAlpha(color, opacity) {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}
export function addAlphaToRgb(value, opacity) {
    return value.replace(")", `, ${opacity})`).replace("rgb", "rgba");
}

//Remove object from his map by his ID;
export function removeFromArrById(arr, elem) {
    const id = elem.getAttribute("id");
    return arr.filter((p) => p.id !== id);
}

//Delete all element that have the same class name
export function deleteAllElem(className) {
        let elems = $$(className);
        for (let elem of elems) {
            elem.remove();
        }
}

//fire event when long touch
export function longTouch(elem, callback) {
    let startTime = 0;
    let endTime = 0;
    let isLongTouch = false;
    elem.addEventListener("touchstart", (e) => {
        startTime = new Date().getTime();
    });
    elem.addEventListener("touchend", (e) => {
        endTime = new Date().getTime();
        if (endTime - startTime > 300) {
            callback();
        }
    });
}

//make element draggable
export function drag(container, obj) {
    const position = {x: obj.position.x, y: obj.position.y};
    interact(container).draggable({
        listeners: {
            start(event) {
                // console.log(event.type, event.target)
            },
            move(event) {
                position.x += event.dx
                position.y += event.dy

                event.target.style.top =
                    `${position.y}px`
                event.target.style.left =
                    `${position.x}px`
            },
        }
    });
    return position;
}

//make elements container
function adder(obj, elem, type) {
    let keys = Object.keys(obj);
    if (keys.length) {
        for (const key of keys) {
            if (type === "att") elem.setAttribute(key, obj[key]);
            else if (type === "style") elem.style[key] = obj[key];
        }
        return elem;
    } else return elem;
}
export function maker(obj) {
    let elem = document.createElement(obj.containerType);
    elem.classList.add(...obj.class);
    elem = adder(obj.style, elem, 'style');
    elem = adder(obj.att, elem, 'att');
    elem.innerHTML = obj.innerHTML;
    return elem;
}

//make object and implement it
export function makeObject(classObj, argu, container) {
    const obj = new classObj(...Object.values(argu));
    classObj.map.push(obj);
    container.appendChild(obj.build());
    return obj;
}

//fetch data from api and transform it to json
export function fetchData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error(error));
}
