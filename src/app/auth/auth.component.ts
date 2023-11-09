import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  @ViewChild("container")
  container!: ElementRef<HTMLDivElement>;

  @ViewChild("signUpBtn")
  signUpBtn!: ElementRef<HTMLInputElement>;

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
      Validators.pattern(/[A-Za-z0-9]/)
    ]],
    repeatPassword: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/[A-Za-z0-9]/)
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if(token){
      router.navigateByUrl('/feed').then(() => console.log('token encountered'));
    }
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
      res => {
        this.router.navigateByUrl("/feed");
      },
      err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message
      })
    });
  }

  register(){
    this.signUpBtn.nativeElement.disabled = true;
    if(this.signUpForm.invalid || this.signUpForm.controls["password"].value != this.signUpForm.controls["repeatPassword"].value) {
      this.signUpForm.markAllAsTouched();
      this.signUpBtn.nativeElement.disabled = false;
      return;
    }

    const [birth, aux] = [
      new Date(this.signUpForm.controls['date'].value),
      new Date(this.today!)
    ];

    const years = aux.getFullYear() - birth.getFullYear();
    if(years < 13){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `You must be over 13 years old to sign up! Try it again in ${13 - years} years`
      });
      this.signUpBtn.nativeElement.disabled = false;
      return;
    }
    this.authService.register(this.signUpForm.value).subscribe(
      res => {
        let username = this.signUpForm.controls['username'].value;
        let email = this.signUpForm.controls['email'].value;
        Swal.fire({
          icon: "success",
          title: 'Email validation required',
          html: 'Please, check your email inbox to validate your account!',
          showConfirmButton: true,
          confirmButtonText: "Re-send confirmation email",
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          preConfirm: () => {
            this.authService.resendConfirmation(username, email);
            return false;
          }
          });
          this.signUpBtn.nativeElement.disabled = false;
        },
        err =>{
          console.log(err)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message
          });
        this.signUpBtn.nativeElement.disabled = false;
      }
    )
  }
}
