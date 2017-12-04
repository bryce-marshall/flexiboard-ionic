/**
 * A type which defines a component that can be rendered by a Flexiboard instance.
 */
export type FlexiItem = FlexiGroup | FlexiKey | FlexiBlank;

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