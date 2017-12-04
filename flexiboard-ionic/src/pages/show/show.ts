import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { FlexiboardComponent } from '../../components/flexiboard';
import { DefinitionProvider } from '../../definition-provider';
import { FlexiboardDefinitionProvider } from '../../components/flexiboard/flexiboard-definition-provider';
import { KeyInstance } from '../../components/flexiboard/interfaces';
import { KeyTapToast } from '../../key-tap-toast';

@IonicPage()
@Component({
    selector: 'page-show',
    templateUrl: 'show.html',
    providers: [
        { provide: FlexiboardDefinitionProvider, useClass: DefinitionProvider }]
})
export class ShowPage {
    private _tapToast: KeyTapToast;
    private _themeIdx = 0;
    private _themes = ["ionic", "dark", "light", "messenger"];

    @ViewChild(FlexiboardComponent) keyboard: FlexiboardComponent;
    type: string = "keypad";
    width: string = "100%";
    align: string = "center";
    roundButtons: boolean = false;
    visible: boolean = false;

    constructor(public toastCtrl: ToastController) {
        this._tapToast = new KeyTapToast(toastCtrl);
    }

    ngOnInit() {
        this.keyboard.transitioned.subscribe((visible: boolean) => {
            if (visible)
                this._themeIdx++;
        });
        this._tapToast.subscribeDefault(this.keyboard);
    }

    ngOnDestroy() {
        this._tapToast.clear();
    }

    get theme(): string {
        return this._themes[this._themeIdx % this._themes.length];
    }

    onVisibility(visible: boolean) {
        this.visible = visible;
    }

    hideKeyboard() {
        this.visible = false;
    }
}