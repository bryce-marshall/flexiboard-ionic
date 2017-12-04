import { Injectable } from "@angular/core";
import { FlexiGroup, FlexiKey, FlexiItem } from "./interfaces";

/**
 * The base class for all Flexiboard keyboard definition provider implementations.
 */
export abstract class FlexiboardDefinitionProvider {
    abstract getKeyboardDefinition(name: string): FlexiItem[];
}

// /**
//  * The default Flexiboard keyboard definition provider.
//  */
// @Injectable()
// export class DefaultFlexiboardDefinitionProvider extends FlexiboardDefinitionProvider {
//     getKeyboardDefinition(name: string): FlexiItem[] {
//         switch (name) {
//             case "keypad":
//                 return keypadFormat();

//             case "phone":
//                 return phoneFormat();
//         }

//         return null;
//     }
// }

// function keypadFormat(): FlexiItem[] {
//     return [
//         { type: "row", items: [{ id: "7", value: 7 }, { id: "8", value: 8 }, { id: "9", value: 9 }] },
//         { type: "row", items: [{ id: "4", value: 4 }, { id: "5", value: 5 }, { id: "6", value: 6 }] },
//         { type: "row", items: [{ id: "1", value: 1 }, { id: "2", value: 2 }, { id: "3", value: 3 }] },
//         {
//             type: "row",
//             items: [
//                 { id: "backspace", iconName: "backspace", cssClass: "keypad-left-action", action: true },
//                 { id: "0", value: 0 },
//                 { id: "submit", iconName: "md-arrow-round-forward", cssClass: "keypad-right-action", action: true }
//             ]
//         }
//     ];
// }

// function phoneFormat(): FlexiItem[] {
//     return [
//         { type: "row", items: [{ id: "1", value: 1 }, { id: "2", value: 2, subtext: "ABC" }, { id: "3", value: 3, subtext: "DEF" }] },
//         { type: "row", items: [{ id: "4", value: 4, subtext: "GHI" }, { id: "5", value: 5, subtext: "JKL" }, { id: "6", value: 6, subtext: "MNO" }] },
//         { type: "row", items: [{ id: "7", value: 7, subtext: "PQRS" }, { id: "", value: 8, subtext: "TUV" }, { id: "8", value: 9, subtext: "WXYZ" }] },
//         { type: "row", items: [{ id: "*" }, { id: "0", value: 0, subtext: "+" }, { id: "#" }] }
//     ];
// }
