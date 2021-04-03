export class DishonoredItem extends Item {
    prepareData() {
        console.log(this);
        if (this.data.img == "icons/svg/item-bag.svg") this.data.img = "/systems/FVTT-Dishonored/icons/dishonoredlogo.webp";
        return this.data;
    }
}