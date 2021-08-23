import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import {
  FormControl,
  Validators,
  ValidatorFn,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'
import { User } from '../user'
import { UsersService } from '../users.service'

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: [],
})
export class UserFormComponent implements OnInit {
  @Input() populateWith?: User

  @Output() closeEvent = new EventEmitter<void>()
  @Output() submitEvent = new EventEmitter<User>()

  username = new FormControl('', {
    validators: [Validators.required, this.differentUsername()],
    asyncValidators: this.availableUsername(),
    updateOn: 'change',
  })

  user: User = {
    id: null,
    name: '',
    posts: [],
  }

  editingExistingUser = false

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    if (this.populateWith) {
      this.user = { ...this.populateWith }
      this.username.setValue(this.populateWith.name)
      this.editingExistingUser = true
    }
  }

  differentUsername(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === this.populateWith?.name
        ? { currentUsername: { value: control.value } }
        : null
    }
  }

  availableUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      const unavailable = { unavailable: { value: control.value } }
      return this.userService
        .getAvailabilty(control.value)
        .then((available: boolean) => {
          return !available ? unavailable : null
        })
        .catch(() => {
          return unavailable
        })
    }
  }

  submitText(): string {
    return this.editingExistingUser ? 'Edit' : 'Create'
  }

  clearForm(): void {
    this.user = {
      id: null,
      name: '',
      posts: [],
    }
    this.editingExistingUser = false
    this.username.setValue(this.user.name)
  }

  close(): void {
    this.closeEvent.emit()
  }

  onSubmit(): void {
    this.submitEvent.emit({ ...this.user, name: this.username.value })
    this.clearForm()
    this.username.reset()
    this.close()
  }
}
