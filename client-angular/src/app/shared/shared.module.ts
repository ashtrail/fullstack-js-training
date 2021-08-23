import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingDataComponent } from './loading-data/loading-data.component'
import { EntryNotFoundComponent } from './entry-not-found/entry-not-found.component'

@NgModule({
  declarations: [LoadingDataComponent, EntryNotFoundComponent],
  imports: [CommonModule],
  exports: [LoadingDataComponent, EntryNotFoundComponent],
})
export class SharedModule {}
