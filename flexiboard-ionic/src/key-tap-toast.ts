import { Injectable } from '@angular/core';
import { ToastController, Toast } from 'ionic-angular';
import { KeyInstance } from './components/flexiboard/interfaces';
import { FlexiboardComponent } from './components/flexiboard/flexiboard';

export class KeyTapToast {
  private _toast: Toast;
  private _msg: string = "";
  private _timeout: number = null;

  constructor(private toastCtrl: ToastController) {
  }

  subscribeDefault(keyboard: FlexiboardComponent) {
    keyboard.keyTap.subscribe((key)=>{
      this.onTap(key);
    });

    keyboard.keyPress.subscribe((key)=>{
      this.onPress(key);
    });    
  }

  onTap(key: KeyInstance) {
    this.append(key.toString());
  }

  onPress(key: KeyInstance) {
    this.append("<" + key.toString() + ">");
  }  

  onDisable(arg: string | KeyInstance) {
    arg = typeof (arg) == "string" ? arg : 'Disabled key "' + arg.toString() + '"';
    let toast = this.toastCtrl.create({
      message: <string>arg,
      duration: 2000,
      position: 'bottom',
      cssClass: 'page-disable-toast-style'
    });
    toast.present();
  }  

  clear() {
    if (this._toast) {
      this._toast.dismiss();
      this._toast = null;
    }
    this._msg = "";
    this._timeout = null;
  }

  private append(value: string) {
    this._timeout = Date.now() + 3000;
    
        if (!this._toast) {
          this._msg = value;
          this._toast = this.toastCtrl.create({
            message: value,
            position: 'top',
            cssClass: 'key-tap-toast-style'
          });
          this._toast.present();
          this.onTimeout();
        }
        else {
          this._msg += (" " + value);
          this._toast.setMessage(this._msg);
        }    
  }

  private onTimeout() {
    let now = Date.now();
    if (this._timeout == null || this._timeout <= now)
      this.clear();
    else
      setTimeout(() => { this.onTimeout(); }, this._timeout - now)
  }
}
