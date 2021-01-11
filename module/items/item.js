export class DishonoredItem extends Item {
  prepareData() {
    if (!this.data.img) this.data.img = '/systems/FVTT-Dishonored/icons/dishonoredlogo.webp';
    super.prepareData();
  }
}