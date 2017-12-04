import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { FlexiboardComponent, FlexiContainerComponent, FlexiColumnComponent, FlexiRowComponent, FlexiKeyComponent, FlexiBlankComponent } from './flexiboard';

/**
 * The Flexiboard component module.
 */
@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    entryComponents: [
        FlexiContainerComponent,
        FlexiColumnComponent,
        FlexiRowComponent,
        FlexiKeyComponent,
        FlexiBlankComponent
    ],
    declarations: [
        FlexiboardComponent,
        FlexiContainerComponent,
        FlexiColumnComponent,
        FlexiRowComponent,
        FlexiKeyComponent,
        FlexiBlankComponent
    ],
    providers: [],
    exports: [
        FlexiboardComponent,
        FlexiContainerComponent,
        FlexiColumnComponent,
        FlexiRowComponent,
        FlexiKeyComponent,
        FlexiBlankComponent]
})
export class FlexiboardModule { }