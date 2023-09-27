import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit{

  user: any;
  image: string = '';
  profileForm: FormGroup;
  pwd: string = environment.pwd;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.profileForm = this.fb.group({
      username: [this.user.username, [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern(/[A-Za-z0-9]/)
      ]],
      name: [this.user.name, [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern(/[A-Za-z]/)
      ]],
      surname: [this.user.surname || "", [
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/[a-zA-Z]+([ ]?[a-zA-Z]+)*/)
      ]],
      date: [this.user.date],
      email: [this.user.email, [Validators.email]],
      password: [this.pwd, [
        Validators.minLength(3),
        Validators.maxLength(15)
      ]]
    });
  }

  ngOnInit(): void {
    this.userService.getProfilePic()?.subscribe(url => this.image = url.toString())
  }

  submit(){
    if(this.profileForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Some of the inputs are invalid, please, look twice!'
      });
      return;
    }
    const value = this.profileForm.value;
    if(value.password === this.pwd){
      delete value.password;
    }
    this.userService.update(value)?.subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire(
          'Everything OK!',
          'User updated successfully',
          'success'
        );
        this.updateStoragedUser(res);
      },
      (err: any) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message
        })
      }
    )
  }

  cancel(){
    this.profileForm.reset({
      username: this.user.username,
      name: this.user.name,
      surname: this.user.surname,
      date: this.user.date,
      email: this.user.email,
      password: this.pwd
    });
  }

  updateStoragedUser(data: any){
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}
