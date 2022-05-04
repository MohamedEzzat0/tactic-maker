"use strict";

import {removeFromArrById, render, longTouch, drag, maker, makeObject} from "../helper-functions.js";

export default class Player {
    constructor(name, color, position, hidden, settings) {
        this.name = name;
        this.color = color;
        this.position = position;
        this.hidden = hidden;
        this.settings = settings;
    }

    static num = 0;
    static map = [];

    build(){
        const id = `player-${Player.num}`;
        this.id = id;
        const containerData = {
            type: 'Player',
            containerType: "div",
            class: [`draggable`, `playground-player`, `${this.hidden ? 'hidden' : "visible"}`, `${this.settings.details}`],
            att: {id: id},
            style: {
                top: `${this.position.y}px`,
                left: `${this.position.x}px`
            },
            innerHTML: `
                  <div class="player-shirt ${this.settings.shape}">
                      <div class="option hidden" style="transform: translate(-50%, -40%);">
                          <button class="option-button delete-player-btn"><i class="ph-trash option-icon"></i></button>
                          <button class="option-button"><i class="ph-person-simple-run option-icon"></i></button>
                          <label for="name--${id}">
                              <span class="option-button"><i class="ph-pencil option-icon"></i></span>
                          </label>
                      </div>
                      <i class="ph-t-shirt-fill player-shirt-icon" style="color: ${this.color}"></i>
                      <div class="player-circle" style="background-color: ${this.color}"></div>
                      <!--<span class = "player-number">${this.id.split("-")[2]? this.id.split("-")[2] : this.id.split("-")[1]}</span>-->
                  </div>
                  <input id="name--${id}" class="playground-name" placeholder="Player name" value="${this.name}" maxlength="20"
                   size="${this.name.length}" disabled/>`
        }
        const playerContainer = maker(containerData);
        const nameInput = playerContainer.children[1];
        const option = playerContainer.children[0].children[0];
        const editBtn = option.children[2];
        const deleteBtn = option.children[0];
        playerContainer.addEventListener("dblclick", () => {
            option.classList.toggle("hidden")
        })
        editBtn.addEventListener("click", () => {
            nameInput.disabled = false;
        })
        nameInput.addEventListener("keydown",  (e) => {
            nameInput.setAttribute("size", nameInput.value.length)
            if (e.key === "Enter") {
                this.name = nameInput.value;
                render(Player.map);
            }
        })
        deleteBtn.addEventListener("click", () => {
            Player.map = removeFromArrById(Player.map, playerContainer);
            playerContainer.remove();
            render(Player.map);
        });
        Player.num--;
        longTouch(playerContainer, () => {
            option.classList.toggle("hidden")
        });
        this.position = drag(playerContainer, this);
        return playerContainer;
    }

    makeCard() {
        const cardData = {
            type: 'Player card',
            containerType: "div",
            class: ['player-card'],
            att: {id: `card--${this.id}`},
            style: {},
            innerHTML: `
                  <div class="player-shirt">
                      <i class="ph-t-shirt-fill player-shirt-icon shirt--card" style="color: ${this.color};"></i>
                      <span class = "player-number">${this.id.split("-")[2]? this.id.split("-")[2] : this.id.split("-")[1]}</span>
                  </div>
                  <div class="card-data">
                      <p class="player-name--card">${this.name}</p>
                      <p class="player-position--card">Position of player</p>
                  </div>
                  <i class="ph-dots-three-outline-vertical-fill option--card"></i>
              </div>`
        }
        return maker(cardData);
    }
}

export function addPlayerByClick(color, position, container, settings = {shape: "circle", details: "basic"}) {
    return makeObject(Player, {name: 'Mo Ezzat', color, position, hidden: false, settings}, container);
}
