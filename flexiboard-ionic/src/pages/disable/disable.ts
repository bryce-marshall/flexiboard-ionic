import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, Toast, ActionSheetController } from 'ionic-angular';
import { DefinitionProvider } from '../../definition-provider';
import { FlexiboardDefinitionProvider } from '../../components/flexiboard/flexiboard-definition-provider';
import { FlexiboardComponent } from '../../components/flexiboard/flexiboard';
import { KeyInstance } from '../../components/flexiboard/interfaces';
import { KeyTapToast } from '../../key-tap-toast';

@IonicPage()
@Component({
  selector: 'page-disable',
  templateUrl: 'disable.html',
  providers: [
    { provide: FlexiboardDefinitionProvider, useClass: DefinitionProvider }]
})
export class DisablePage {
  @ViewChild(FlexiboardComponent) keyboard: FlexiboardComponent;
  theme: string = "ionic";
  private _roundButtons: boolean = false;
  private _type: string = "mock1";
  private _tapToast: KeyTapToast;
  private _letsDisabled: boolean = false;
  private _numsDisabled: boolean = false;
  private _otherCount: number = 0;

  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
    this._tapToast = new KeyTapToast(toastCtrl);
  }

  ngOnInit() {
    this._tapToast.subscribeDefault(this.keyboard);
  }

  ngOnDestroy() {
    this._tapToast.clear();
  }

  get roundButtons(): boolean {
    return this._roundButtons;
  }

  set roundButtons(value: boolean) {
    this._roundButtons = value;
    let k = this.keyboard.getKey("done");
    k.text = value ? null : "Done";
    k.iconName = value ? "checkmark" : null;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
    this._letsDisabled = false;
    this._numsDisabled = false;
    this._otherCount = 0;
  }

  showMenu() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Enable/Disable Menu',
      buttons: [
        {
          text: 'Toggle All',
          handler: () => {
            this._letsDisabled = this._numsDisabled = !(this._letsDisabled || this._numsDisabled || this._otherCount > 0);
            this._otherCount = this._letsDisabled ? 4 : 0;
            this.keyboard.getAllKeys().forEach((k) => { k.disabled = this._letsDisabled; });
            if (this._letsDisabled)
              this._tapToast.onDisable('Disabled all keys');
          }
        },
        {
          text: 'Toggle Letters',
          handler: () => {
            this._letsDisabled = !this._letsDisabled;
            this.keyboard.forEachKey((k) => { if (typeof (k.value) == "string" && k.id.length == 1) k.disabled = this._letsDisabled; });
            if (this._letsDisabled)
              this._tapToast.onDisable('Disabled all letter keys');
          }
        },
        {
          text: 'Toggle Numbers',
          handler: () => {
            this._numsDisabled = !this._numsDisabled;
            this.keyboard.forEachKey((k) => { if (typeof (k.value) == "number") k.disabled = this._numsDisabled; });
            if (this._numsDisabled)
              this._tapToast.onDisable('Disabled all number keys');
          }
        },
        {
          text: 'Toggle Mail',
          handler: () => {
            this.toggleOther("mail");
          }
        },
        {
          text: 'Toggle Keypad',
          handler: () => {
            this.toggleOther("keypad");
          }
        },
        {
          text: 'Toggle Locate',
          handler: () => {
            this.toggleOther("locate");
          }
        },
        {
          text: 'Toggle Done',
          handler: () => {
            this.toggleOther("done");
          }
        },
        {
          text: 'Instructions',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: 'Instructions',
              subTitle: '"Tap" for normal key interaction, "Press" (touch and hold) to disable.',
              buttons: ['OK']
            });
            alert.present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  onPress(key: KeyInstance) {
    key.disabled = true;
    if (typeof (key.value) == "number")
      this._numsDisabled = true;
    else if (key.value.length == 1)
      this._letsDisabled = true;
    else
      this._otherCount++;
    this._tapToast.onDisable(key);
  }

  toggleOther(id: string) {
    let k = this.keyboard.getKey(id);
    if (!k) return;
    k.disabled = !k.disabled;
    if (k.disabled) {
      this._otherCount++;
      this._tapToast.onDisable(k);
    }
    else
      this._otherCount--;
  }
}
