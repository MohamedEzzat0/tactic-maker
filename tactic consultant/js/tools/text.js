"use strict";

import {drag, longTouch, maker, render, makeObject} from "../helper-functions.js";

export default class Text {
    constructor(position, value, color) {
        this.position = position;
        this.value = value;
        this.id = `text-${Text.textNum}`;
        this.color = color;
        Text.textNum++;
    }

    static num = 0;
    static map = [];

    build() {
        const containerData = {
            type: 'Text',
            containerType: "div",
            class: ["text", "draggable"],
            att: {},
            style: {
                top: `${this.position.y}px`,
                left: `${this.position.x}px`
            },
            innerHTML: `<input type="text" class="text--input" placeholder="Double click to type" value="${this.value}" size="${this.value.length}" disabled>`
        }

        const textContainer = maker(containerData);

        const textField = textContainer.children[0];

        textContainer.addEventListener("dblclick", () => {
            textField.disabled = false;
        });
        textContainer.addEventListener("keydown",  (e) => {
            textField.setAttribute("size", textField.value.length)
            if (e.key === "Enter") {
                this.value = textField.value;
                render();
            }
        });

        longTouch(textContainer, () => {
            textField.disabled = false;
        });

        this.position = drag(textContainer, this);

        return textContainer;
    }
}

export function addTextByClick(color, position, value,  container) {
    return makeObject(Text, {position: position, value:value, color: color}, container);
}
