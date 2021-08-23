import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'entry-not-found',
  templateUrl: './entry-not-found.component.html',
  styleUrls: [],
})
export class EntryNotFoundComponent implements OnInit {
  @Input() type?: string = 'Entry'

  constructor() {}

  ngOnInit(): void {}
}
