export class DishonoredItem extends Item {
    prepareData() {
        if (this.img === "icons/svg/item-bag.svg")
            this.img = "/systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp";

        if (this.img === "icons/svg/mystery-man.svg")
            this.img = "/systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp";

        return this;
    }
}
