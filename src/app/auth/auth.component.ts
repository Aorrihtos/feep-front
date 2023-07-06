import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import {TimerHandle} from "rxjs/internal/scheduler/timerHandle";
import {Time} from "@angular/common";
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  @ViewChild("container")
  container!: ElementRef<HTMLDivElement>;

  today = new Date(Date.now()).toISOString().split('T').shift();

  signInForm: FormGroup = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]]
  });

  signUpForm: FormGroup = this.fb.group({
    name: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern(/[A-Za-z]/)
    ]],
    surname: ["", [
      Validators.pattern(/[A-Za-z]/),
      Validators.minLength(3),
      Validators.maxLength(50)
    ]],
    date: ["", Validators.required],
    username: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern(/[A-Za-z0-9]/)
    ]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      Validators.pattern(/[A-Za-z0-9]/)
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    console.log(this.today)
  }

  signUpButton(){
    this.container.nativeElement.classList.add("sign-up-mode");
  }
  signInButton(){
    this.container.nativeElement.classList.remove("sign-up-mode");
  }
  login(){
    if(this.signInForm.invalid){
      this.signInForm.markAllAsTouched()
      return;
    }
    this.authService.login(this.signInForm.value).subscribe(
      res => this.router.navigateByUrl("/feed"),
      err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message
      })
    });
  }
  register(){
    if(this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    const [birth, aux] = [
      new Date(this.signUpForm.controls['date'].value),
      new Date(this.today!)
    ];
    const years = aux.getFullYear() - birth.getFullYear();
    if(years < 18){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must be over 18 years old to sign up! Try it again in ${18 - years} years, if we still alive...`
      });
      return;
    }
    this.authService.register(this.signUpForm.value).subscribe(
      res => {
        Swal.fire({
          icon: "success",
          title: 'Everything OK!',
          html: 'You will be redirected to your page in a moment',
          timer: 2000,
          timerProgressBar: true,
        }).then((result) => {
          this.router.navigateByUrl("/feed")
        })
      },
      err =>{
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message
        });
      }
    )
  }
}
