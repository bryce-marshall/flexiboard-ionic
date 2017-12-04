# @brycemarshall/flexiboard-ionic

A customisable virtual keyboard implementation for the Ionic framework.
A keyboard can be defined either in markup, or in code (by injecting a FlexiboardDefinitionProvider implementation).

Virtual keyboards are rendered using CSS Flexbox layout rules. A keyboard is defined using rows, columns, and key definitions, each of which exposes a flexGrow property.

See the CSS Flexbox specification/documentation for information on the Flexbox layout.

# Installation

npm i @brycemarshall/flexiboard-ionic

# Component Styling and Themes

The component supports custom themes, and four are provided "out of the box". They include:
* Ionic
* Dark
* Light
* Messenger

It is recommended that both the base styles and any required theme styles are imported from the app.scss file (example below).

``` scss
// src/app/app.scss

@import '@brycemarshall/flexiboard-ionic/flexiboard';
@import '@brycemarshall/flexiboard-ionic/theme-ionic';
// @import '@brycemarshall/flexiboard-ionic/theme-dark';
// @import '@brycemarshall/flexiboard-ionic/theme-light';
// @import '@brycemarshall/flexiboard-ionic/theme-messenger';
```

# FlexiboardModule module Import

The Flexiboard module should be explicitly imported by any module that uses the component. Example:

``` ts
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InputPage } from './input';
import { FlexiboardModule } from '@brycemarshall/flexiboard-ionic';

@NgModule({
  declarations: [
    InputPage,
  ],
  imports: [
    FlexiboardModule,
    IonicPageModule.forChild(InputPage),
  ],
})
export class InputPageModule {}
```

# Basic Usage (Markup Keyboard Definition)
``` html
<ion-header>
  <ion-navbar>
    <ion-title>Markup Template Demo</ion-title>
  </ion-navbar>
</ion-header>

<flexiboard [visible]="true" theme="ionic"  (keyTap)="onTap($event)" (keyPress)="onPress($event)">
  <flexiboard-column [flexGrow]="2">
    <flexiboard-key id="A"></flexiboard-key>
    <flexiboard-row>
      <flexiboard-column [flexGrow]="3">
        <flexiboard-row>
            <flexiboard-key id="1" [value]="1"></flexiboard-key>
            <flexiboard-key id="2" [value]="2" subtext="ABC"></flexiboard-key>
            <flexiboard-key id="3" [value]="3" subtext="DEF"></flexiboard-key>          
        </flexiboard-row>
        <flexiboard-row>
            <flexiboard-key id="mail" iconName="md-mail" subtext="MAIL"></flexiboard-key>
            <flexiboard-key id="0" [value]="0" subtext="+"></flexiboard-key>
            <flexiboard-key id="keypad" iconName="md-keypad"></flexiboard-key>
        </flexiboard-row>
        <flexiboard-row>
            <flexiboard-key id="B"></flexiboard-key>
            <flexiboard-key id="C" [flexGrow]="2"></flexiboard-key>
        </flexiboard-row>
      </flexiboard-column>
      <flexiboard-column [flexGrow]="1">
          <flexiboard-key id="D"></flexiboard-key>
          <flexiboard-key id="located" iconName="md-locate" subtext="LOCATE" [action]="true"></flexiboard-key>
      </flexiboard-column>
    </flexiboard-row>
    <flexiboard-key id="done" [text]="doneText" [iconName]="doneIcon" [action]="true"></flexiboard-key>
  </flexiboard-column>
</flexiboard>
```
# Basic Usage (Injected Keyboard Definition)
``` html
<ion-header>
  <ion-navbar>
    <ion-title>Markup Template Demo</ion-title>
  </ion-navbar>
</ion-header>

<flexiboard [visible]="true" theme="ionic" keyboard="number" (keyTap)="onTap($event)" (keyPress)="onPress($event)">
</flexiboard>
```
# Page Component Code Example with Injected FlexiboardDefinitionProvider
``` ts
import { Component } from '@angular/core';
import { FlexiboardComponent, KeyInstance, FlexiboardDefinitionProvider } from '@brycemarshall/flexiboard-ionic';
import { DefinitionProvider } from './my-custom-definition-provider';

@IonicPage()
@Component({
    selector: 'page-input',
    templateUrl: 'input.html',
    providers: [
        { provide: FlexiboardDefinitionProvider, useClass: DefinitionProvider }]
})
export class InputPage {
    @ViewChild(FlexiboardComponent) keyboard: FlexiboardComponent;

    onTap(key: keyInstance) {
        console.log(key.value);
    }

    onPress(key: keyInstance) {
        console.log(key.value);
    }    
}
```
# FlexiboardDefinitionProvider Implementation Example
``` ts
@Injectable()
export class DefinitionProvider extends FlexiboardDefinitionProvider {
    getKeyboardDefinition(name: string): FlexiItem[] {
        switch (name) {
            case "number":
                return numberFormat();

            case "phone":
                return phoneFormat();

            case "mock":
                return mockFormat();
        }

        return null;
    }
}

function numberFormat(): FlexiItem[] {
    return [
        { type: "row", items: [{ id: "1", value: 1 }, { id: "2", value: 2 }, { id: "3", value: 3 }, { id: "back", iconName: "backspace", keyMap: "Backspace", action: true }] },
        { type: "row", items: [{ id: "4", value: 4 }, { id: "5", value: 5 }, { id: "6", value: 6 }, { id: "next", text: "Next", keyMap: "ArrowRight;ArrowDown", action: true }] },
        { type: "row", items: [{ id: "7", value: 7 }, { id: "8", value: 8 }, { id: "9", value: 9 }, { id: "done", text: "Done", keyMap: "Enter", action: true }] },
        {
            type: "row",
            items: [
                null,
                { id: "0", value: 0 },
                { id: "." },
                { id: "cancel", iconName: "close", keyMap: "Escape", action: true }
            ]
        }
    ];
}

function phoneFormat(): FlexiItem[] {
    return [
        { type: "row", items: [{ id: "1", value: 1 }, { id: "2", value: 2, subtext: "ABC" }, { id: "3", value: 3, subtext: "DEF" }] },
        { type: "row", items: [{ id: "4", value: 4, subtext: "GHI" }, { id: "5", value: 5, subtext: "JKL" }, { id: "6", value: 6, subtext: "MNO" }] },
        { type: "row", items: [{ id: "7", value: 7, subtext: "PQRS" }, { id: "", value: 8, subtext: "TUV" }, { id: "8", value: 9, subtext: "WXYZ" }] },
        { type: "row", items: [{ id: "*" }, { id: "0", value: 0, subtext: "+" }, { id: "#" }] }
    ];
}

function mockFormat(): FlexiItem[] {
    return [
        {
            type: "column",
            items: [
                { id: "A" },
                {
                    type: "row",
                    items: [
                        {
                            type: "column",
                            flexGrow: 3,
                            items: [
                                {
                                    type: "row",
                                    items: [
                                        { id: "1", value: 1 },
                                        { type: "blank" },
                                        { id: "3", value: 3, subtext: "DEF" }
                                    ]
                                },
                                {
                                    type: "row",
                                    items: [
                                        { id: "mail", iconName: "md-mail", subtext: "MAIL" },
                                        { id: "0", value: 0, subtext: "+" },
                                        { id: "keypad", iconName: "md-keypad" }
                                    ]
                                },
                                {
                                    type: "row",
                                    items: [
                                        { id: "B" },
                                        { flexGrow: 2 }
                                    ]
                                },
                            ]
                        },
                        {
                            type: "column",
                            flexGrow: 1,
                            items: [
                                { type: "blank" },
                                { id: "locate", iconName: "md-locate", subtext: "LOCATE", action: true }
                            ]
                        }
                    ]
                },
                { id: "done", text: "Done", action: true }
            ]
        }
    ];
}
```

# Basic Usage (Additional External Components)

In this example the root component is an ion-toolbar element, however any element that is not a flexiboard-row or flexiboard-column element will be rendered above the virtual keyboard.

``` HTML
<ion-header>
  <ion-navbar>
    <ion-title>Markup Template Demo</ion-title>
  </ion-navbar>
</ion-header>

<flexiboard [visible]="true" theme="ionic" keyboard="number" (keyTap)="onTap($event)" (keyPress)="onPress($event)">
    <ion-toolbar no-border-bottom>
        <ion-buttons start>
            <button ion-button (click)="hideKeyboard()">Cancel</button>
        </ion-buttons>
    </ion-toolbar>
</flexiboard>
```
# Package Exports 
The package exports the following types:

``` ts
/**
 * The Flexiboard component module.
 */
export declare class FlexiboardModule {
}
/**
 * Used internally by the Flexiboard component.
 */
export declare abstract class FlexiboardService {
}
/**
 * Represents a Flexiboard custom keyboard component.
 */
export declare class FlexiboardComponent {
    private _svc;
    constructor(el: ElementRef, _svc: FlexiboardService);
    private ngOnInit();
    private ngOnDestroy();
    /**
    * The event raised when the user taps a key.
    */
    readonly keyboardInit: EventEmitter<void>;
    /**
     * The event raised when the user taps a key.
     */
    readonly keyTap: EventEmitter<KeyInstance>;
    /**
     * The event raised when a user presses a key.
     */
    readonly keyPress: EventEmitter<KeyInstance>;
    /**
     * The event raised when the keyboard's visibility changes.
     */
    readonly visibilityChanged: EventEmitter<boolean>;
    /**
     * The event raised after the keyboard's visibility has changed and the CSS transition that shows or hides the keyboard has completed.
     */
    readonly transitioned: EventEmitter<boolean>;
    /**
     * Gets or sets the name of the keyboard template to use.
     * The template must be supported by an injected FlexiboardDefinitionProvider instance in the current scope, and will override any markup-template
     * that might be defined within the tags of the Flexiboard component element.
     */
    keyboard: string;
    /**
     * Gets or sets the name of the theme used to style the component.
     */
    theme: string;
    /**
     * Gets or sets a value determining the position in which the keyboard is aligned. Valid values are "left", "center" (default), and "right".
     */
    align: string;
    /**
     * Gets or sets a value determining whether or not the keyboard is rendered with round buttons. The default value is false.
     */
    roundButtons: boolean;
    /**
     * Gets or sets a value determining whether or not the keyboard can be closed (hidden) with a swipe gesture. The default value is true.
     */
    swipeEnabled: boolean;
    /**
     * Gets or sets the width of the keyboard. Any CSS width expressed as a pixel or percentage value is valid.
     */
    width: string;
    /**
     * Gets or sets a value determining whether or not hardware keystrokes are captured and emitted as virtual keyboard key-press events.
     */
    hardCapture: boolean;
    /**
   * Gets or sets a value determining whether or not the keyboard is visible. The default value is false.
   */
    visible: boolean;
    /**
     * Returns an array of KeyInstance instances representing all keys in the virtual keyboard.
     */
    getAllKeys(): KeyInstance[];
    /**
     * Returns an array of KeyInstance instances representing the keys in the virtual keyboard that are matched by the specified filter function.
     * @param filter The filter function.
     */
    getKeys(filter: (key: KeyInstance) => boolean): KeyInstance[];
    /**
     * Returns a KeyInstance instance representing the virtual keyboard key with the specified id, or null if no such key exists.
     * @param id The id of the requested key.
     */
    getKey(id: string): KeyInstance;
    /**
     * Iterates the collection of keys in the virtual keyboard, invoking the specified handler function for each one.
     * @param handler The handler function.
     */
    forEachKey(handler: (key: KeyInstance) => void): void;
    /**
     * Shows the keyboard (sets the visible property to true) and invokes the specified callback function only after any associated CSS transition has completed.
     * @param callback The optional callback function.
     * @param callbackArgs Optional arguments to pass to the callback function.
     */
    show(callback?: (args?: any) => void, callbackArgs?: any): void;
    /**
     * Hides the keyboard (sets the visible property to false), and invokes the specified callback function only after any associated CSS transition has completed.
     * @param callback The optional callback function.
     * @param callbackArgs Optional arguments to pass to the callback function.
     */
    hide(callback?: (args?: any) => void, callbackArgs?: any): void;
    private getBaseClasses();
    private readonly textFontSize;
}
/**
 * The base class for all Flexiboard subcomponents.
 */
export declare abstract class FlexCompBase {
    protected _svc: FlexiboardService;
    protected abstract _item: FlexiGroup | FlexiKey;
    constructor(svc: FlexiboardService);
    /**
     * Gets or sets the flex-grow value for the rendered element.
     */
    flexGrow: number;
}
/**
 * The base class for all Flexiboard subcomponents that can themselves host subcomponents.
 */
export declare abstract class HostCompBase extends FlexCompBase {
    _viewContainer: ViewContainerRef;
    protected _item: FlexiGroup;
    constructor(svc: FlexiboardService);
    ngOnInit(): void;
    protected readonly abstract _items: FlexiItem[];
}
/**
 * FlexiContainerComponent instances are used internally by the Flexiboard component.
 */
export declare class FlexiContainerComponent extends HostCompBase {
    private _injector;
    private _resolver;
    protected _items: FlexiItem[];
    constructor(_injector: Injector, _resolver: ComponentFactoryResolver, svc: FlexiboardService);
    /**
     * Override the default ngOnInit.
     */
    ngOnInit(): void;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
}
/**
 * Represents a row in a virtual keyboard template.
 */
export declare class FlexiRowComponent extends HostCompBase {
    private _resolver;
    constructor(_resolver: ComponentFactoryResolver, svc: FlexiboardService);
    protected readonly _items: FlexiItem[];
}
/**
 * Represents a column in a virtual keyboard template.
 */
export declare class FlexiColumnComponent extends HostCompBase {
    private _resolver;
    constructor(_resolver: ComponentFactoryResolver, svc: FlexiboardService);
    protected readonly _items: FlexiItem[];
}
/**
 * Represents a key in a virtual keyboard template.
 */
export declare class FlexiKeyComponent extends FlexCompBase {
    protected _item: FlexiKey;
    constructor(svc: FlexiboardService);
    ngOnInit(): void;
    id: string;
    value: any;
    text: string;
    subtext: string;
    iconName: string;
    cssClass: string;
    action: boolean;
    disabled: boolean;
    private btnTap(e);
    private btnPress(e);
    private readonly minHeight;
    private readonly size;
    private getWrapperClasses();
    private getKeyClasses();
    private getText();
    private hasIcon();
    private hasSubtext();
    readonly isDisabled: string;
}
/**
 * Represents a blank spacer in a virtual keyboard template.
 */
export declare class FlexiBlankComponent extends FlexCompBase {
    protected _item: FlexiKey;
    constructor(svc: FlexiboardService);
}
/**
 * The base class for all Flexiboard keyboard definition provider implementations.
 */
export declare abstract class FlexiboardDefinitionProvider {
    abstract getKeyboardDefinition(name: string): FlexiItem[];
}
/**
 * A type which defines a component that can be rendered by a Flexiboard instance.
 */
export declare type FlexiItem = FlexiGroup | FlexiKey | FlexiBlank;
/**
 * The base interface implemented by all FlexiItem definition types.
 */
export interface FlexiItemBase {
    /**
     * The type of this instance.
     * Valid values are "column", "row", "key", and "blank" (a missing or unassigned property defaults to "key" if the value property is present or otherwise to "blank").
     */
    type?: string;
    /**
     * The flex-grow value for the rendered element.
     */
    flexGrow?: number;
}
/**
 * Represents a blank spacers within a keyboard definition.
 */
export interface FlexiBlank extends FlexiItemBase {
}
/**
 * The base interface for all FlexiItem definitions that can host child FlexiItem definitions.
 */
export interface FlexiGroup extends FlexiBlank {
    /**
     * The items contained within this group instance.
     */
    items: FlexiItem[];
}
/**
 * Represents a Flexiboard key definition.
 */
export interface FlexiKey extends FlexiBlank {
    /**
     * The flex-grow value for the rendered key element.
     */
    flexGrow?: number;
    /**
     * One or more custom CSS classes (separated by spaces) to be applied to this key instance.
     */
    cssClass?: string;
    /**
     * The name of the key icon (takes priority over the text property).
     */
    iconName?: string;
    /**
     * The key text (defers to the iconName property, and falls-back to the value property and then to the id property if neither iconName or text are specified).
     */
    text?: string;
    /**
     * The optional key subtext.
     */
    subtext?: string;
    /**
     * Specifies whether or not this key instance is an "action" key. Themes should ensure that action keys are rendered in a distinctive style.
     */
    action?: boolean;
    /**
     * Specifies the mapping of native (hardware) keys to the virtual keyboard. If not specified, the id property will be used for mapping.
     * Multiple mappings may be specified using the semicolon (';') character as a delimiter.
     * Mapping the  semicolon character itself requires that it be escaped using the forwardslash character ("/;"), and similarly the forwardslash character must be escaped with itself ("//").
     * The value(s) used must correspond to a valid value of the "key" property of the KeyboardEvent DOM object.
     *
     * Examples: keyMap: "1" | "a;A" | "Backspace" | "Enter" | "/;" | "//"
     */
    keyMap?: string;
    /**
     * The value passed to keyTap and keyPress event subscribers when a key is pressed (the id property will be used if value is not explictly specified).
     */
    value?: any;
    /**
     * The id of the key.
     * This value should be unique within the keyboard definition, and will be passed to keyTap event subscribers if no explicit value has been assigned to the value property.
     */
    id: string;
}
/**
 * Represents a Flexiboard key instance.
 */
export interface KeyInstance {
    /**
     * Gets the id of the key.
     */
    readonly id: string;
    /**
     * Gets or sets the key value.
     */
    value: any;
    /**
     * Gets or sets the key text.
     */
    text: string;
    /**
     * Gets or sets the key subtext.
     */
    subtext: string;
    /**
     * Gets or sets the key icon name.
     */
    iconName: string;
    /**
     * Gets or sets the custom CSS classes to be applied to the key instance.
     */
    cssClass: string;
    /**
     * Gets or sets a value determining whether or not the key should be rendered as an action key.
     */
    action: boolean;
    /**
     * Gets or sets a value determining whether or not the key is disabled.
     */
    disabled: boolean;
}
```