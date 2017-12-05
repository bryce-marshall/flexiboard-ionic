import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FlexiboardComponent, KeyInstance, FlexiboardDefinitionProvider } from '@brycemarshall/flexiboard-ionic';
import { DefinitionProvider } from '../../definition-provider';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@IonicPage()
@Component({
    selector: 'page-input',
    templateUrl: 'input.html',
    providers: [
        { provide: FlexiboardDefinitionProvider, useClass: DefinitionProvider }]
})
export class InputPage implements OnInit {
    @ViewChild(FlexiboardComponent) keyboard: FlexiboardComponent;
    private _prevId: string = "";
    private _prevPin: string = "";

    userId: string = "";
    pin: string = "";
    focus: string = "";ghgf
    hardCapture: boolean = true;

    constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
    }

    ngOnInit(): void {
        this.keyboard.keyboardInit.subscribe(() => {
            this.keyboard.getKey(".").disabled = true;
        });

        this.keyboard.keyTap.subscribe((keyI: KeyInstance) => {
            let key = keyI.value;
            let field = this.focus;
            if (typeof key == "number") {
                this[field] += key.toString();
            } else if (key == "back") this[field] = this[field].substring(0, this[field].length - 1);
            else if (key == "done") this.submit();
            else if (key == "next")
                this.focus = this.focus == "userId" ? "pin" : "userId";
            else if (key == "cancel") {
                this.userId = this._prevId;
                this.pin = this._prevPin;
                this._prevId = "";
                this._prevPin = "";
                this.focus = "";
                this.keyboard.visible = false;
            }
        });

        this.keyboard.visibilityChanged.subscribe((visible) => {
            if (visible) {
                this._prevId = this.userId;
                this._prevPin = this.pin;
            }
            else
                this.focus = "";
        });
    }

    setFocus(field: string) {
        this.focus = field;
        this.keyboard.visible = true;
    }

    submit() {
        this._prevId = "";
        this._prevPin = "";

        this.keyboard.hide(() => {
            let toast = this.toastCtrl.create({
                message: 'User ID = "' + this.userId + '"\r\nPIN = "' + this.pin + '"',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        });
    }
}