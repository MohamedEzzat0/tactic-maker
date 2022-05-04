"use strict";

import {createLine, makeObject, maker} from "../helper-functions.js";

export default class Line {
    constructor(startPosition, endPosition, shapeLine, shapeEnding, color) {
        this.start = startPosition;
        this.end = endPosition;
        this.shapeLine = shapeLine;
        this.shapeEnding = shapeEnding;
        this.color = color;
        this.id= `line-${Line.num}`
        Line.num++;
    }

    static map = [];
    static num = 0;

    build(){
        const style = createLine(this.start.x, this.start.y, this.end.x, this.end.y);
        const containerData = {
            type: 'Line',
            containerType: "div",
            class: ["line", this.shapeLine.dashed? "dashed": 'solid'],
            att: {id: this.id},
            style: {
                backgroundColor: this.shapeLine.dashed? "transparent": this.color,
                borderColor: this.shapeLine.dashed? this.color: "none",
                width: style.width,
                top: style.top,
                left: style.left,
                transform: style.transform
            },
            innerHTML: `<i class="ph-triangle-fill tri-ending line-ending  ${this.shapeEnding.tri? 'enable': 'disable'}" style="color: ${this.color};"></i>
            <div class="x-ending line-ending ${this.shapeEnding.x? 'enable': 'disable'}" style="background-color: ${this.color}"></div>
            <div class="circle-ending line-ending ${this.shapeEnding.circle? 'enable': 'disable'}" style="border-color: ${this.color}"></div>`
        }
        Line.map.map(l => console.log(`${l.shapeLine.dashed? "Dashed": "Solid"} line with ${l.shapeEnding.tri? "Triangle": l.shapeEnding.x? "X": l.shapeEnding.circle? "Circle": "none"} ending`));
        return maker(containerData);
    }
}

export function addLineByClick(startPosition, endPosition, shapeLine, shapeEnding, color, container) {
    return makeObject(Line, {startPosition, endPosition, shapeLine, shapeEnding, color}, container);
}
