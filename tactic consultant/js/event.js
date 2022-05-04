"use strict";

import {addPlayerByClick} from "./tools/player.js";
import {addConeByClick} from "./tools/cone.js";
import {$, $$, getPosition, render, createLineById, deleteAllElem, reset, addAlphaToRgb, lineupMap} from "./helper-functions.js";
import {addLineByClick} from "./tools/line.js";
import {addTextByClick} from "./tools/text.js";
import {addRectByClick} from "./tools/rect.js";

const root = $(":root")
const body = document.body;
const darkMode = $(".dark-mode");
const settingBtn = $(".setting-btn");
const setting = $(".setting");
const addBtn = $(".add-btn");
const tools = $(".tools");
const playerSettingDetail = $$("input[name='player-setting--details']");
const playerSettingShape = $$("input[name='player-setting--shape']");
const lineOptionEnding = $$('input[name="line-ending"]');
const lineOptionShape = $$('input[name="line-shape"]');
const settingContainer = $$(".setting-container");
const playerSetting = $$(".player-setting");
const colorsBtn = $$('input[name="color"]');
const toolsBtn = $$('input[name="tool"]');
const subSettingMenu = $$('.sub-setting-item')
const lineupTitle = $('.lineup-title');
const grid = $(".grid");
const playerBarBtn = $(".control-aside");
const playerNameInput = $(".playground-name");
const lineFollow = $(".line-s");
const [TriEnding, xEnding, circleEnding] = lineFollow.children;
const lineOption = $(".tool-option--line");
const stadiumImg = $(".playground");
const deleteAll = $(".reset-stadium");
const playerSize = $(".player-size");
const ball = $(".ball");
export const playerContainer = $(".player-container");
export const cards = $(".cards");
export const stadium = $(".stadium");
export const downloadBtn = $('.downloadable');
// export const aside = $(".cards")
// export let arrPlayer;

let lineShape = {
    dashed: false,
}
let lineEnding = {
    tri: true,
    x: false,
    circle: false
}
let startPosition, endPosition;
let recorder = 0;
let chosenColor = colorsBtn[1];
let playerSettings = {shape: 'circle',details: "basic"}
export let color = '#fd7e14';
export let tool = '';

stadiumImg.addEventListener("click", function (e) {
    let position = getPosition(e, stadiumImg);
    if (tool === "shirt") addPlayerByClick(color, position, playerContainer, playerSettings);
    if (tool === "cone") addConeByClick(color, position, stadium);
    if (tool === "text") addTextByClick(color, position, "", stadium);
    if (tool === "rect") addRectByClick(color, position, {width: 100, height: 100}, stadium);
});

stadium.addEventListener("click", function (e) {
    let position = getPosition(e, stadiumImg);
    if (tool === "line") {
        if (recorder) {
            endPosition = position;
            addLineByClick(startPosition, endPosition, {...lineShape}, {...lineEnding}, color, stadium)
            lineFollow.classList.remove("follow")
            recorder = 0;
        } else {
            startPosition = position;
            // lineFollow.classList.add("follow");
            recorder = 1
        }
    }
    console.log(e.target.classList.value);
});

stadium.addEventListener("mousemove", function (e) {
    let position = getPosition(e, stadiumImg);
    if (recorder === 1) {
        lineFollow.classList.add("follow");
        endPosition = position;
        createLineById(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
    }
});

playerSize.addEventListener('input', function () {
    playerContainer.style.fontSize = `${this.value}%`;
});

darkMode.addEventListener("click", function () {
    let radioBackgroundColor = window.getComputedStyle(chosenColor);
    let bgColor = addAlphaToRgb(radioBackgroundColor.backgroundColor, 0.4);
    body.classList.toggle("dark");
    darkMode.classList.toggle("active");
    if (body.classList.contains("dark")) root.style.setProperty('--tool-btn-bg', radioBackgroundColor.backgroundColor);
    else root.style.setProperty('--tool-btn-bg', bgColor);
});

settingBtn.addEventListener("click", function () {
    setting.classList.toggle("active");
});

addBtn.addEventListener("click", function () {
    tools.classList.toggle("active");
});

playerBarBtn.addEventListener("click", function () {
    playerBarBtn.classList.toggle("open");
    grid.classList.toggle("open");

})

deleteAll.addEventListener("click", function () {
    reset.notify([".playground-player", ".player-card", ".playground-cone", ".text", ".rect", ".line"]);
})

// lineupTitle.addEventListener("keyup", function (e) {
//     lineupMap.title = this.value;
// })

for (let colorBtn of colorsBtn) {
    colorBtn.addEventListener("change", function () {
        chosenColor = colorBtn;
        let radioBackgroundColor = window.getComputedStyle(colorBtn);
        let bgColor = addAlphaToRgb(radioBackgroundColor.backgroundColor, 0.4);
        root.style.setProperty('--background-btn-color', bgColor);
        if (body.classList.contains("dark")) root.style.setProperty('--tool-btn-bg', radioBackgroundColor.backgroundColor);
        else root.style.setProperty('--tool-btn-bg', bgColor);
        color = colorBtn.value;
    });
}

for (let toolBtn of toolsBtn) {
    toolBtn.addEventListener("change", function () {
        tool = toolBtn.value;
        lineOption.classList.remove("active")
        if (toolBtn.value === "line") {
            lineOption.classList.add("active")
        }
    })
}

for (let playerSettingElement of playerSetting) {
    playerSettingElement.addEventListener("click", function () {
        settingContainer[0].classList.toggle("hidden");
        settingContainer[1].classList.toggle("hidden");
    })
}

for (let shape of lineOptionShape) {
    shape.addEventListener("change", function () {
        if (shape.value === "dashed") {
            lineShape.dashed = true;
            lineFollow.classList.add("dashed")
        } else {
            lineShape.dashed = false;
            lineFollow.classList.remove("dashed");
        }
    })
}

for (let ending of lineOptionEnding) {
    ending.addEventListener("change", function () {
chooseEnding(ending.value);
    })
}

for (const shape of playerSettingShape) {
    shape.addEventListener("change", function () {
        playerSettings.shape = shape.value;
        render();
    })
}

for (const detail of playerSettingDetail) {
    detail.addEventListener("change", function () {
        playerSettings.details = detail.value;
        render();
    })
}

for (const menu of subSettingMenu) {
    menu.addEventListener("click", function () {
        menu.classList.toggle("open");
    })
}

const chooseEnding = function (end) {
    const ending = [xEnding, circleEnding, TriEnding];
    ending.forEach(c => c.classList.contains(`${end}-ending`) ? c.classList.add("enable") : c.classList.remove("enable"))
    Object.keys(lineEnding).forEach(e => lineEnding[e] = false)
    lineEnding[end] = true
}

const position = {x: 150, y: 90};
interact(ball).draggable({
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

