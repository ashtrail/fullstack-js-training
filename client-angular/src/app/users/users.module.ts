import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { UserListComponent } from './user-list/user-list.component'
import { UserFormComponent } from './user-form/user-form.component'
import { UserComponent } from './user/user.component'
import { SharedModule } from '../shared/shared.module'
@NgModule({
  declarations: [UserListComponent, UserFormComponent, UserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
})
export class UsersModule {}
