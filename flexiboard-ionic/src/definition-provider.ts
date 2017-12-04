import { Injectable } from "@angular/core";
import { FlexiboardDefinitionProvider, FlexiItem } from "./components/flexiboard";

@Injectable()
export class DefinitionProvider extends FlexiboardDefinitionProvider {
    getKeyboardDefinition(name: string): FlexiItem[] {
        switch (name) {
            case "number":
                return numberFormat();

            case "keypad":
                return keypadFormat();

            case "phone":
                return phoneFormat();

            case "mock1":
                return mock1();

            case "mock2":
                return mock2();
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

function keypadFormat(): FlexiItem[] {
    return [
        { type: "row", items: [{ id: "7", value: 7 }, { id: "8", value: 8 }, { id: "9", value: 9 }] },
        { type: "row", items: [{ id: "4", value: 4 }, { id: "5", value: 5 }, { id: "6", value: 6 }] },
        { type: "row", items: [{ id: "1", value: 1 }, { id: "2", value: 2 }, { id: "3", value: 3 }] },
        {
            type: "row",
            items: [
                { id: "backspace", iconName: "backspace", action: true },
                { id: "0", value: 0 },
                { id: "submit", iconName: "md-arrow-round-forward", action: true }
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

function mock1(): FlexiItem[] {
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
                                        { id: "2", value: 2, subtext: "ABC" },
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
                                        { id: "C", flexGrow: 2 }
                                    ]
                                },
                            ]
                        },
                        {
                            type: "column",
                            flexGrow: 1,
                            items: [
                                { id: "D" },
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

function mock2(): FlexiItem[] {
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