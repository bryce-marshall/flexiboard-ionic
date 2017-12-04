import { Component, ElementRef, Input, HostBinding, Optional, ComponentFactoryResolver, ComponentRef, Type, ViewContainerRef, Inject, forwardRef, Injector, ViewChild, Injectable, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Gesture } from 'ionic-angular';
import { FlexiboardDefinitionProvider } from './flexiboard-definition-provider';
import { FlexiItem, FlexiGroup, FlexiKey, KeyInstance } from './interfaces';

declare var Hammer: any;

/**
 * Used internally by the Flexiboard component.
 */
export abstract class FlexiboardService {
}

@Injectable()
class ServiceImp implements FlexiboardService {
  private _f: FlexiboardComponent;
  private _el: Element;
  private _swipe: Gesture;
  private _init: EventEmitter<void>;
  private _tap: EventEmitter<KeyInstance>;
  private _press: EventEmitter<KeyInstance>;
  private _visibility: EventEmitter<boolean>;
  private _transitioned: EventEmitter<boolean>;
  private _autoTemplate: boolean = false;
  private _keyboard: string = "";
  private _visible: boolean = false;
  private _hardCapture: boolean = true;
  private _maps: { [map: string]: FlexiKey } = {};
  private _keyHandler: (e: KeyboardEvent) => void = null;

  private _c: FlexiContainerComponent = null;
  private _h: (items: FlexiItem[]) => void;
  private _cs: CSSStyleDeclaration;
  private _scale: ScaleData = null;
  private _resetScaleFn: () => void;
  private _initQueued: boolean = false;
  keys: FlexiKey[] = [];

  constructor( @Optional() private keyDef: FlexiboardDefinitionProvider) {
    this._resetScaleFn = () => {
      this._scale = null;
    }
  }

  get keyboardInitEmitter(): EventEmitter<void> {
    if (!this._init)
      this._init = new EventEmitter<void>();
    return this._init;
  }

  get tapEmitter(): EventEmitter<KeyInstance> {
    if (!this._tap)
      this._tap = new EventEmitter<KeyInstance>();
    return this._tap;
  }

  get pressEmitter(): EventEmitter<KeyInstance> {
    if (!this._press)
      this._press = new EventEmitter<KeyInstance>();
    return this._press;
  }

  get visibilityEmitter(): EventEmitter<boolean> {
    if (!this._visibility)
      this._visibility = new EventEmitter<boolean>();
    return this._visibility;
  }

  get transitionedEmitter(): EventEmitter<boolean> {
    if (!this._transitioned)
      this._transitioned = new EventEmitter<boolean>();
    return this._transitioned;
  }

  get keyboard(): string {
    return this._keyboard != null ? this._keyboard : "";
  }

  set keyboard(v: string) {
    if (!v) v = "";
    if (v === this._keyboard) return;
    this._keyboard = v;
    this.templateChanged(v);
  }

  get hardCapture(): boolean {
    return this._hardCapture;
  }

  set hardCapture(value: boolean) {
    value = value === true;
    if (value === this._hardCapture) return;
    this._hardCapture = value;
    this.configureKeyHandler();
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    value = value === true;
    if (value === this._visible) return;
    this._visible = value;
    this.configureKeyHandler();

    if (this._transitioned) {
      this.bindTransitionedCallback(() => {
        if (value == this._visible && this._transitioned)
          this._transitioned.emit(value);
       });
    }

    if (this._visibility)
      this._visibility.emit(value);
  }

  registerComp(f: FlexiboardComponent, el: HTMLElement) {
    if (this._f != null) throw new Error("Flexiboard Error: Flexiboard component already registered.");
    this._f = f;
    this._el = el;
    this._swipe = new Gesture(el, {
      recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]]
    });

    if (!window || !el) return;
    this._cs = window.getComputedStyle(el);
    window.addEventListener("resize", this._resetScaleFn);
    if (!document) return;
    document.addEventListener("keydown", this._keyHandler);
  }

  releaseComp(f: FlexiboardComponent) {
    if (this._f !== f) return;
    try {
      if (this._init)
        this._init.unsubscribe();

      if (this._tap)
        this._tap.unsubscribe();

      if (this._press)
        this._press.unsubscribe();

      if (this._visibility)
        this._visibility.unsubscribe();

      if (this._transitioned)
        this._transitioned.unsubscribe();

      if (window)
        window.removeEventListener("resize", this._resetScaleFn);

      if (document)
        document.removeEventListener("keydown", this._keyHandler);

      this._swipe.destroy();
    }
    finally {
      this._f = null;
      this._el = null;
      this._swipe = null;
      this._init = null;
      this._tap = null;
      this._press = null;
      this._visibility = null;
      this._transitioned = null;
      this._cs = null;
      this._initQueued = false;
      this._keyboard = "";
      this.keys = [];
      this._maps = {};
    }
  }

  registerContainer(c: FlexiContainerComponent, handler: (items: FlexiItem[]) => void) {
    if (this._c != null) throw new Error("Flexiboard Error: Container component already registered.");
    this._c = c;
    this._h = handler;
    if (this._autoTemplate)
      this.applyDefinition();
  }

  releaseContainer(c: FlexiContainerComponent) {
    if (this._c === c) {
      this._c = null;
      this._h = null;
    }
  }

  initComp() {
    this._swipe.listen();
    this._swipe.on('swipedown', e => {
      // TODO: Swipe not working on some devices.
      if (this._f.swipeEnabled) {
        this.visible = false;
      }
    });
  }

  tap(value: FlexiKey) {
    if (this._tap)
      this._tap.emit(wrapKey(value));
  }

  press(value: FlexiKey) {
    if (this._press)
      this._press.emit(wrapKey(value));
  }

  registerKey(key: FlexiKey) {
    this.keys.push(key);
    for (let map of parseKeyMap(key)) {
      if (map == "") continue;
      this._maps[map] = key;
    }
    this._initQueued = true;
  }

  getScaleData(): ScaleData {
    if (this._scale) return this._scale;
    let r = {
      auto: false,
      buttonHeight: null,
      fontSize: null
    }
    this._scale = r;
    if (!window || !this._cs) return r;
    let s = this._cs.getPropertyValue("--button-height");
    if (s.length == 0 || s.indexOf("px") <= 0) return r;
    let n = parseInt(s);
    if (n == NaN) return r;
    s = this._cs.getPropertyValue("--auto-scale").trim();
    r.auto = (s == "t" || s == "1" || s == "true");
    if (!r.auto) return r;
    n = Math.round(n * window.screen.height / 640);
    r.buttonHeight = n + "px";
    r.fontSize = Math.round(n * .4) + "px";
    return r;
  }

  setVisibility(visible: boolean, callback?: (args?: any) => void, callbackArgs?: any) {
    if (this._visible == visible) return;
    this.visible = visible;
    if (callback)
      this.bindTransitionedCallback(() => {
        if (this._f.visible == visible)
          callback(callbackArgs);
      });
  }

  onCheckContent() {
    if (this._initQueued) {
      this._initQueued = false;
      if (this._init)
        this._init.emit();
    }
  }

  get roundButtons(): boolean {
    return this._f ? this._f.roundButtons : false;
  }

  get autoTemplate(): boolean {
    return this._autoTemplate;
  }

  private configureKeyHandler() {
    let handle = this._visible && this._hardCapture;
    if (handle && !this._keyHandler) {
      this._keyHandler = (e) => {
        let key = this._maps[e.key];
        if (key && (<any>key).disabled !== true) {
          this.tap(key);
        }
      }
      document.addEventListener("keydown", this._keyHandler);
    } else if (!handle && this._keyHandler) {
      document.removeEventListener("keydown", this._keyHandler);
      this._keyHandler = null;
    }
  }

  private templateChanged(keyboard: string) {
    this.keys = [];
    this._maps = {};
    this._autoTemplate = keyboard && keyboard.length > 0;
    this.applyDefinition();
  }

  private applyDefinition() {
    if (!this._autoTemplate || !this._h) return;
    if (!this.keyDef)
      throw new Error("Flexiboard Error: No FlexiboardDefinitionProvider has been injected.");
    let d = this.keyDef.getKeyboardDefinition(this._f.keyboard);
    if (d == null)
      throw new Error("Flexiboard Error: The keyboard definition \"" + this._f.keyboard + "\" is not supported by the current FlexiboardDefinitionProvider.");
    this._h(d);
  }

  private bindTransitionedCallback(fn: () => void) {
    if (!this._el) return;
    let inner = (e) => {
      if (!this._el || e.path[0].localName != "flexiboard") return;
      this._el.removeEventListener("transitionend", inner);
      fn();
    };
    this._el.addEventListener("transitionend", inner)
  }
}

/**
 * Represents a Flexiboard custom keyboard component.
 */
@Component({
  selector: 'flexiboard',
  host: {
    class: "flexiboard",
    '[style.fontSize]': 'textFontSize'
  },
  // templateUrl: 'flexiboard.html',
  template:
    '<div [class]="getBaseClasses()" [style.width]="width">' +
    '<ng-content></ng-content>' +
    '<flexiboard-container class="flexiboard-container">' +
    '<ng-content select="flexiboard-row|flexiboard-column"></ng-content>' +
    '</flexiboard-container>' +
    '</div>',
  providers: [{ provide: FlexiboardService, useClass: ServiceImp }]
})
export class FlexiboardComponent {
  constructor(el: ElementRef, private _svc: FlexiboardService) {
    (<ServiceImp>_svc).registerComp(this, el.nativeElement);
  }

  //#region Angular Lifecycle Handlers

  private ngOnInit() {
    (<ServiceImp>this._svc).initComp();
  }

  private ngOnDestroy() {
    (<ServiceImp>this._svc).releaseComp(this);
  }

  //#endregion

  //#region Public properties

  /**
  * The event raised when the user taps a key.
  */
  @Output() get keyboardInit(): EventEmitter<void> {
    return (<ServiceImp>this._svc).keyboardInitEmitter;
  }
  /**
   * The event raised when the user taps a key.
   */
  @Output() get keyTap(): EventEmitter<KeyInstance> {
    return (<ServiceImp>this._svc).tapEmitter;
  }
  /**
   * The event raised when a user presses a key.
   */
  @Output() get keyPress(): EventEmitter<KeyInstance> {
    return (<ServiceImp>this._svc).pressEmitter;
  }
  /**
   * The event raised when the keyboard's visibility changes.
   */
  @Output() get visibilityChanged(): EventEmitter<boolean> {
    return (<ServiceImp>this._svc).visibilityEmitter;
  }
  /**
   * The event raised after the keyboard's visibility has changed and the CSS transition that shows or hides the keyboard has completed.
   */
  @Output() get transitioned(): EventEmitter<boolean> {
    return (<ServiceImp>this._svc).transitionedEmitter;
  }
  /**
   * Gets or sets the name of the keyboard template to use.
   * The template must be supported by an injected FlexiboardDefinitionProvider instance in the current scope, and will override any markup-template 
   * that might be defined within the tags of the Flexiboard component element.
   */
  @Input() get keyboard(): string {
    return (<ServiceImp>this._svc).keyboard;
  }
  set keyboard(value: string) {
    (<ServiceImp>this._svc).keyboard = value;
  }
  /**
   * Gets or sets the name of the theme used to style the component.
   */
  @Input() theme: string;
  /**
   * Gets or sets a value determining the position in which the keyboard is aligned. Valid values are "left", "center" (default), and "right".
   */
  @Input() align: string = "center";
  /**
   * Gets or sets a value determining whether or not the keyboard is rendered with round buttons. The default value is false.
   */
  @Input() roundButtons: boolean = false;
  /**
   * Gets or sets a value determining whether or not the keyboard can be closed (hidden) with a swipe gesture. The default value is true.
   */
  @Input() swipeEnabled: boolean = true;
  /**
   * Gets or sets the width of the keyboard. Any CSS width expressed as a pixel or percentage value is valid.
   */
  @Input() width: string;
  /**
   * Gets or sets a value determining whether or not hardware keystrokes are captured and emitted as virtual keyboard key-press events.
   */
  @Input() get hardCapture(): boolean {
    return (<ServiceImp>this._svc).hardCapture;
  }
  set hardCapture(value: boolean) {
    (<ServiceImp>this._svc).hardCapture = value;
  }
  /**
 * Gets or sets a value determining whether or not the keyboard is visible. The default value is false.
 */
  @HostBinding('class.visible') @Input() get visible(): boolean {
    return (<ServiceImp>this._svc).visible;
  }
  set visible(value: boolean) {
    (<ServiceImp>this._svc).visible = value;
  }

  //#endregion

  //#region Public methods

  /**
   * Returns an array of KeyInstance instances representing all keys in the virtual keyboard.
   */
  getAllKeys(): KeyInstance[] {
    let r: KeyInstance[] = [];
    for (let k of (<ServiceImp>this._svc).keys) {
      r.push(wrapKey(k));
    }
    return r;
  }

  /**
   * Returns an array of KeyInstance instances representing the keys in the virtual keyboard that are matched by the specified filter function.
   * @param filter The filter function.
   */
  getKeys(filter: (key: KeyInstance) => boolean): KeyInstance[] {
    if (filter == null) return this.getAllKeys();
    let r: KeyInstance[] = [];
    for (let k of (<ServiceImp>this._svc).keys) {
      let ki = wrapKey(k);
      if (filter(ki))
        r.push(ki);
    }
    return r;
  }

  /**
   * Returns a KeyInstance instance representing the virtual keyboard key with the specified id, or null if no such key exists.
   * @param id The id of the requested key.
   */
  getKey(id: string): KeyInstance {
    for (let k of (<ServiceImp>this._svc).keys) {
      if (k.id === id)
        return wrapKey(k);
    }
    return null;
  }

  /**
   * Iterates the collection of keys in the virtual keyboard, invoking the specified handler function for each one.
   * @param handler The handler function.
   */
  forEachKey(handler: (key: KeyInstance) => void): void {
    if (handler == null) return;
    for (let k of (<ServiceImp>this._svc).keys) {
      handler(wrapKey(k));
    }
  }

  /**
   * Shows the keyboard (sets the visible property to true) and invokes the specified callback function only after any associated CSS transition has completed.
   * @param callback The optional callback function.
   * @param callbackArgs Optional arguments to pass to the callback function.
   */
  show(callback?: (args?: any) => void, callbackArgs?: any) {
    (<ServiceImp>this._svc).setVisibility(true, callback, callbackArgs);
  }

  /**
   * Hides the keyboard (sets the visible property to false), and invokes the specified callback function only after any associated CSS transition has completed.
   * @param callback The optional callback function.
   * @param callbackArgs Optional arguments to pass to the callback function.
   */
  hide(callback?: (args?: any) => void, callbackArgs?: any) {
    (<ServiceImp>this._svc).setVisibility(false, callback, callbackArgs);
  }

  //#endregion

  //#region Private control properties and event handlers

  private getBaseClasses(): string {
    let r = "theme-" + this.theme + " align-" + this.align;
    if (this.roundButtons)
      r += " round-buttons";
    return r;
  }

  private get textFontSize(): string {
    return (<ServiceImp>this._svc).getScaleData().fontSize;
  }

  //#endregion
}

/**
 * The base class for all Flexiboard subcomponents.
 */
export abstract class FlexCompBase {
  protected _svc: FlexiboardService
  protected abstract _item: FlexiGroup | FlexiKey;

  constructor(svc: FlexiboardService) {
    this._svc = <ServiceImp>svc;
  }

  /**
   * Gets or sets the flex-grow value for the rendered element.
   */
  @Input() get flexGrow(): number {
    return this._item && this._item.flexGrow ? this._item.flexGrow : null;
  }

  set flexGrow(value: number) {
    this._item.flexGrow = value;
  }
}

/**
 * The base class for all Flexiboard subcomponents that can themselves host subcomponents.
 */
export abstract class HostCompBase extends FlexCompBase {
  @ViewChild('placeholder', { read: ViewContainerRef }) _viewContainer: ViewContainerRef;
  protected _item: FlexiGroup;

  constructor(svc: FlexiboardService) {
    super(svc);
    if (!(<ServiceImp>this._svc).autoTemplate)
      this._item = { items: null };
  }

  ngOnInit() {
    if ((<ServiceImp>this._svc).autoTemplate)
      createSubcomponents(<any>this);
  }

  protected abstract get _items(): FlexiItem[];
}

/**
 * FlexiContainerComponent instances are used internally by the Flexiboard component.
 */
@Component({
  selector: 'flexiboard-container',
  template: '<ng-container #placeholder></ng-container><ng-content></ng-content>'
})
export class FlexiContainerComponent extends HostCompBase {
  protected _items: FlexiItem[];

  constructor(private _injector: Injector, private _resolver: ComponentFactoryResolver, svc: FlexiboardService) {
    super(svc);
  }

  /**
   * Override the default ngOnInit.
   */
  ngOnInit() {
    if ((<ServiceImp>this._svc).autoTemplate) {
      (<ServiceImp>this._svc).registerContainer(this, (items) => {
        this._viewContainer.clear();
        this._items = items;
        createSubcomponents(<any>this, true);
      });
    }
  }

  ngAfterContentChecked() {
    (<ServiceImp>this._svc).onCheckContent();
  }

  ngOnDestroy() {
    this._items = null;
    (<ServiceImp>this._svc).releaseContainer(this);
  }
}

/**
 * Represents a row in a virtual keyboard template.
 */
@Component({
  selector: 'flexiboard-row',
  host: {
    class: 'flexiboard-row',
    '[style.flexGrow]': 'flexGrow'
  },
  template: '<ng-container #placeholder></ng-container><ng-content></ng-content>'
})
export class FlexiRowComponent extends HostCompBase {
  constructor(private _resolver: ComponentFactoryResolver, svc: FlexiboardService) {
    super(svc);
  }

  protected get _items(): FlexiItem[] {
    return this._item ? this._item.items : null;
  }
}

/**
 * Represents a column in a virtual keyboard template.
 */
@Component({
  selector: 'flexiboard-column',
  host: {
    class: 'flexiboard-column',
    '[style.flexGrow]': 'flexGrow'
  },
  template: '<ng-container #placeholder></ng-container><ng-content></ng-content>'
})
export class FlexiColumnComponent extends HostCompBase {
  constructor(private _resolver: ComponentFactoryResolver, svc: FlexiboardService) {
    super(svc);
  }

  protected get _items(): FlexiItem[] {
    return this._item ? this._item.items : null;
  }
}

/**
 * Represents a key in a virtual keyboard template.
 */
@Component({
  selector: 'flexiboard-key',
  host: {
    '[class]': 'getWrapperClasses()',
    '[style.flexGrow]': 'flexGrow',
    '[style.minHeight]': 'minHeight',
    '[attr.disabled]': 'isDisabled'
  },
  template: '<div [class]="getKeyClasses()" [style.width]="size" [style.height]="size" [attr.disabled]="isDisabled" (tap)="btnTap($event)" (press)="btnPress($event)"><div class="flexiboard-key-text" [attr.disabled]="disabled">{{getText(key)}}<ion-icon *ngIf="hasIcon()" [name]="iconName"></ion-icon><div *ngIf="hasSubtext()" class="flexiboard-key-subtext">{{subtext}}</div></div></div>'
})
export class FlexiKeyComponent extends FlexCompBase {
  protected _item: FlexiKey;

  constructor(svc: FlexiboardService) {
    super(svc);
    if (!(<ServiceImp>this._svc).autoTemplate)
      this._item = { id: null };
  }

  // Override base init
  ngOnInit() {
    (<ServiceImp>this._svc).registerKey(this._item);
  }

  //#region Public Properties

  @Input() get id(): string {
    return this._item ? this._item.id : null;
  }

  set id(value: string) {
    this._item.id = value;
  }

  @Input() get value(): any {
    return this._item ? this._item.value : null;
  }

  set value(value: any) {
    this._item.value = value;
  }

  @Input() get text(): string {
    return this._item ? this._item.text : "";
  }

  set text(value: string) {
    this._item.text = value;
  }

  @Input() get subtext(): string {
    return this._item ? this._item.subtext : "";
  }

  set subtext(value: string) {
    this._item.subtext = value;
  }

  @Input() get iconName(): string {
    return this._item ? this._item.iconName : null;
  }

  set iconName(value: string) {
    this._item.iconName = value;
  }

  @Input() get cssClass(): string {
    return this._item ? this._item.cssClass : null;
  }

  set cssClass(value: string) {
    this._item.cssClass = value;
  }

  @Input() get action(): boolean {
    return this._item ? this._item.action : null;
  }

  set action(value: boolean) {
    this._item.action = value;
  }

  @Input() get disabled(): boolean {
    return (<any>this._item).disabled === true;
  }

  set disabled(value: boolean) {
    (<any>this._item).disabled = value == true;
  }


  //#endregion

  //#region Private Methods Properties


  private btnTap(e: Event) {
    if ((<any>this._item).disabled === true) return;
    (<ServiceImp>this._svc).tap(this._item);
  }

  private btnPress(e: Event) {
    if ((<any>this._item).disabled === true) return;
    (<ServiceImp>this._svc).press(this._item);
  }

  private get minHeight(): string {
    return (<ServiceImp>this._svc).getScaleData().buttonHeight;
  }

  private get size(): string {
    return (<ServiceImp>this._svc).roundButtons ? (<ServiceImp>this._svc).getScaleData().buttonHeight : null;
  }

  private getWrapperClasses(): string {
    let r = "flexiboard-key-wrapper";
    if (!this._item) return r;
    if (this._item.action)
      r += " action-key-wrapper";
    if (this._item.cssClass)
      r += (" " + this._item.cssClass);
    return r;
  }

  private getKeyClasses(): string {
    let r = "flexiboard-key";
    if (!this._item) return r;
    if (this._item.action)
      r += " action-key";
    return r;
  }

  private getText(): string {
    let item = this._item;
    if (item == null) return "";
    if (item.iconName && item.iconName.length > 0) return "";
    if (item.text && item.text.length > 0) return item.text;

    return item.value != null ? item.value.toString() : item.id != null ? item.id : "";
  }

  private hasIcon(): boolean {
    return this._item && this._item.iconName && this._item.iconName.length > 0;
  }

  private hasSubtext(): boolean {
    return this._item && this._item.subtext && this._item.subtext.length > 0;
  }

  @Input() get isDisabled(): string {
    return this._item && (<any>this._item).disabled === true ? "" : null;
  }

  //#endregion
}

/**
 * Represents a blank spacer in a virtual keyboard template.
 */
@Component({
  selector: 'flexiboard-blank',
  host: {
    class: 'flexiboard-key-wrapper flexiboard-blank',
    '[style.flexGrow]': 'flexGrow'
  },
  template: '<div class="flexiboard-key"></div>'
})
export class FlexiBlankComponent extends FlexCompBase {
  protected _item: FlexiKey;

  constructor(svc: FlexiboardService) {
    super(svc);
  }
}

interface ComponentHost {
  _resolver: ComponentFactoryResolver;
  _viewContainer: ViewContainerRef;
  _items: FlexiItem[];
}

function createSubcomponents(host: ComponentHost, isContainer?: boolean) {
  if (!host || !host._items) return;

  for (let item of host._items) {
    let type: Type<any> = null;
    if (item) {
      switch (item.type) {
        case "row":
          type = FlexiRowComponent;
          break;
        case "column":
          type = FlexiColumnComponent;
          break;
        case "key":
          type = FlexiKeyComponent;
          break;
        case "blank":
          type = FlexiBlankComponent;
          break;
        default:
          if ((item.type == null || item.type == "") && (<FlexiKey>item).value != null || (<FlexiKey>item).id != null)
            type = FlexiKeyComponent;
          else
            type = FlexiBlankComponent;
          break;
      }
    }
    else if (!isContainer)
      type = FlexiBlankComponent;

    if (type) {
      let comp = host._viewContainer.createComponent(host._resolver.resolveComponentFactory(type));
      (<any>comp.instance)._item = item;
    }
  }
}

function wrapKey(key: FlexiKey): KeyInstance {
  let keyValue: any = key.value != null ? key.value : key.id;
  return <KeyInstance>{
    get id(): string {
      return key.id
    },
    get value(): any {
      return keyValue;
    },
    set value(value: any) {
      key.value = value;
    },
    get text(): string {
      return key.text;
    },
    set text(value: string) {
      key.text = value;
    },
    get subtext(): string {
      return key.subtext;
    },
    set subtext(value: string) {
      key.subtext = value;
    },
    get iconName(): string {
      return key.iconName;
    },
    set iconName(value: string) {
      key.iconName = value;
    },
    get cssClass(): string {
      return key.cssClass;
    },
    set cssClass(value: string) {
      key.cssClass = value;
    },
    get action(): boolean {
      return (<any>key).action === true;
    },
    set action(value: boolean) {
      (<any>key).action = value === true;
    },
    get disabled(): boolean {
      return (<any>key).disabled === true;
    },
    set disabled(value: boolean) {
      (<any>key).disabled = value === true;
    },
    toString(): string {
      return keyValue.toString();
    }
  };
}

interface ScaleData {
  readonly auto: boolean;
  readonly buttonHeight: string;
  readonly fontSize: string;
}

function parseKeyMap(key: FlexiKey): string[] {
  if (!key.keyMap || typeof (key.keyMap) != "string" || key.keyMap == "") return [key.id];
  let map: string = key.keyMap;
  let result = [];
  let i = 0;
  let s = "";
  while (i < map.length) {
    let c = map[i];
    if (c == ";") {
      result.push(s);
      s = "";
    }
    else if (c != "/")
      s += c;
    else {
      c = null;
      if (++i < map.length) {
        c = map[i];
        switch (c) {
          case "/":
          case ";":
            break;
          default:
            c = null;
            break;
        }
      }
      if (c == null) throw new Error("Flexiboard Error: Invalid escape character in keyMap property.")
      s += c;
    }
    i++;
  }

  if (s.length > 0)
    result.push(s);

  return result;
}
