import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { DefinitionProvider } from '../../definition-provider';
import { FlexiboardDefinitionProvider } from '../../components/flexiboard/flexiboard-definition-provider';
import { FlexiboardComponent } from '../../components/flexiboard/flexiboard';
import { KeyInstance } from '../../components/flexiboard/interfaces';
import { KeyTapToast } from '../../key-tap-toast';

@IonicPage()
@Component({
  selector: 'page-spans',
  templateUrl: 'spans.html',
  providers: [{ provide: FlexiboardDefinitionProvider, useClass: DefinitionProvider }]
})
export class SpansPage {
  @ViewChild(FlexiboardComponent) keyboard: FlexiboardComponent;
  type: string = "mock1";
  theme: string = "ionic";
  visible: boolean = true;
  private _roundButtons: boolean = false;
  private _tapToast: KeyTapToast;

  constructor(public toastCtrl: ToastController) {
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

  onVisibility(visible: boolean) {
    this.visible = visible;
  }
}