"use strict";

import {render, addAlpha, removeFromArrById, longTouch, drag, maker, makeObject} from "../helper-functions.js";

export default class Rect {
    constructor(position, dimension, color) {
        this.position = position;
        this.dimension = dimension;
        this.id = `rect-${Rect.num}`;
        this.color = color;
        Rect.num++;
    }

    static num = 0;
    static map = [];

    build() {
        const containerData = {
            type: 'Rect',
            containerType: "div",
            class: ["rect", "draggable"],
            att: {id: this.id},
            style: {
                top: `${this.position.y}px`,
                left: `${this.position.x}px`,
                width: `${this.dimension.width}px`,
                height: `${this.dimension.height}px`,
                backgroundColor:`${addAlpha(this.color, 0.5)}`,
                borderColor: `${this.color}`
            },
            innerHTML: `<div class="option cone-option rect-option hidden">
                    <button class="option-button delete-player-btn"><i class="ph-trash option-icon"></i></button>
                    <button class="option-button delete-player-btn"><i class="ph-lock-fill option-icon"></i></button>
                </div>`
        }
        const rectContainer = maker(containerData);

        const coneOption = rectContainer.children[0];
        const deleteBtn = rectContainer.children[0].children[0];

        rectContainer.addEventListener("dblclick", () => {
            coneOption.classList.toggle("hidden");
        })
        deleteBtn.addEventListener("click", () => {
            Rect.map = removeFromArrById(Rect.map, rectContainer);
            console.log('clicked')
            rectContainer.remove();
            render();
        });
        longTouch(rectContainer, () => {
            coneOption.classList.toggle("hidden");
        });

        this.position = drag(rectContainer, this);

        let cObject = this;
        const targetElement = rectContainer
        const offset = { x: 0, y: 0 }
        const targetInteratable = interact(targetElement)
        targetInteratable.resizable({
            edges: { top: true, left: true, bottom: true, right: true },
            invert: 'reposition',
            listeners: {
                move: function (event) {
                    const { width, height } = event.rect

                    offset.x += event.deltaRect.left
                    offset.y += event.deltaRect.top

                    Object.assign(targetElement.style, {
                        width: `${width}px`,
                        height: `${height}px`,
                        transform: `translate(${offset.x}px, ${offset.y}px)`
                    })

                    // infoElement.textContent = `${width} × ${height}`
                    cObject.dimension = {width: width,height: height};
                }
            }
        })
        interact('#invert').on('input change', function(event) {
            targetInteratable.resizable({ invert: event.target.value });
        })

        return rectContainer;
    }
}

export function addRectByClick(color, position, dimension,  container) {
    return makeObject(Rect, {position: position, dimension: dimension, color: color}, container);
}

