import { Component, ViewChild } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { FlexiboardComponent, KeyInstance } from '@brycemarshall/flexiboard-ionic';
import { KeyTapToast } from '../../key-tap-toast';

@IonicPage()
@Component({
  selector: 'page-markup-template',
  templateUrl: 'markup-template.html',
})
export class MarkupTemplatePage {
  @ViewChild(FlexiboardComponent) keyboard: FlexiboardComponent;
  theme: string = "ionic";
  roundButtons: boolean = false;
  visible: boolean = true;

  private _tapToast: KeyTapToast;
  private _disabledKey: KeyInstance = null;
  private _disabled: boolean = false;

  constructor(toastCtrl: ToastController) {
    this._tapToast = new KeyTapToast(toastCtrl);
  }

  ngOnInit() {      
    this._tapToast.subscribeDefault(this.keyboard);
  }

  ngOnDestroy() {
    this._tapToast.clear();
  }

  onTap(key: KeyInstance) {
    if (key.id != "enable")
      return;
    this._disabledKey = null;
    this._disabled = !this._disabled;
    this.keyboard.getAllKeys().forEach((k) => { k.disabled = this._disabled; })
    this.keyboard.getKey("enable").disabled = false;
    if (this._disabled)
      this._tapToast.onDisable("Disabled all keys");
  }

  onPress(key: KeyInstance) {
    if (key.id == "enable") return;
    if (this._disabledKey)
      this._disabledKey.disabled = false;
    this._disabled = true;
    key.disabled = true;
    this._disabledKey = key;
    this._tapToast.onDisable(key);
  }

  onVisibility(visible: boolean) {
    this.visible = visible;
  }

  get enableValue(): boolean {
    return this._disabled;
  }

  get enableText(): string {
    if (!this.keyboard.roundButtons)
      return this.enableValue ? "Enable All" : "Disable All";
    return this.enableValue ? "E" : "D";
  }

  get doneText(): string {
    return !this.roundButtons ? "Done" : null;
  }

  get doneIcon(): string {
    return this.roundButtons ? "checkmark" : null;
  }
}
