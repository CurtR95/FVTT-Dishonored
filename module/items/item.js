export class DishonoredItem extends Item {
    prepareData() {
        if (this.data.img == "icons/svg/item-bag.svg") this.data.img = "/systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp";
        if (this.data.img == "icons/svg/mystery-man.svg") this.data.img = "/systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp";
        return this.data;
    }
}