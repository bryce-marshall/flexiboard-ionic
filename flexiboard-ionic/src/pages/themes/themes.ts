import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { FlexiboardComponent } from '../../components/flexiboard/flexiboard';
import { DefinitionProvider } from '../../definition-provider';
import { FlexiboardDefinitionProvider } from '../../components/flexiboard/flexiboard-definition-provider';
import { KeyTapToast } from '../../key-tap-toast';

@IonicPage()
@Component({
  selector: 'page-themes',
  templateUrl: 'themes.html',
  providers: [
    { provide: FlexiboardDefinitionProvider, useClass: DefinitionProvider }]
})
export class ThemesPage {
  private _tapToast: KeyTapToast;

  @ViewChild(FlexiboardComponent) keyboard: FlexiboardComponent;
  type: string = "keypad";
  theme: string = "ionic";
  roundButtons: boolean = false;
  visible: boolean = true;

  constructor(public toastCtrl: ToastController) {
    this._tapToast = new KeyTapToast(toastCtrl);
  }

  ngOnInit() {
    this._tapToast.subscribeDefault(this.keyboard);
  }

  ngOnDestroy() {
    this._tapToast.clear();
  }

  onVisibility(visible: boolean) {
    this.visible = visible;
  }
}
