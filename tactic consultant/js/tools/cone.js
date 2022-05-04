"use strict";

import {maker, drag, longTouch, removeFromArrById, render, makeObject} from "../helper-functions.js"

export default class Cone {
    constructor(color, position) {
        this.color = color;
        this.position = position;
    }

    static map = []
    static num = 0

    build() {
        const id = `cone-${Cone.num}`;
        this.id = id;

        const containerData = {
            type: 'Cone',
            containerType: "div",
            class: ["draggable", "playground-cone"],
            att: {id: id},
            style: {
                top: `${this.position.y}px`,
                left: `${this.position.x}px`
            },
            innerHTML: `<div class="option cone-option hidden">
                                      <button class="option-button delete-player-btn"><i class="ph-trash option-icon"></i></button>
                                      <button class="option-button delete-player-btn"><i class="ph-lock-fill option-icon"></i></button>
                                      </div><div class=" cone-icon">
                                      <i class="ph-traffic-cone-fill tool-icon cone" style="color: ${this.color}"></i>
                                   </div>`
        }

        const coneContainer = maker(containerData);

        const coneOption = coneContainer.children[0];
        const deleteBtn = coneContainer.children[0].children[0];

        coneContainer.addEventListener("dblclick", () => {
            coneOption.classList.toggle("hidden");
        })
        deleteBtn.addEventListener("click", () => {
            Cone.map = removeFromArrById(Cone.map, coneContainer);
            coneContainer.remove();
            render();
        });
        Cone.num--;

        longTouch(coneContainer, () => {
            coneOption.classList.toggle("hidden");
        });

        this.position = drag(coneContainer, this);

        return coneContainer;
    }
}

export function addConeByClick(color, position, container) {
    return makeObject(Cone, {color: color, position: position}, container);
}
