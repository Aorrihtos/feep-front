import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SmtpService} from "../services/smtp.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit{

  contactForm: FormGroup = this.fb.group({
    title: ["", [Validators.required]],
    subject: ["", [Validators.required]],
    phone: "",
    text: ["", [Validators.required]]
  })
  constructor(private fb: FormBuilder, private smtp: SmtpService) {
  }

  ngOnInit(): void {
    const inputs = document.querySelectorAll(".input");

    inputs.forEach((input) => {
      input.addEventListener("focus", function(event: any){
        let parent = event.target.parentNode;
        parent.classList.add("focus");
      });
      input.addEventListener("blur", function(event: any){
        let parent = event.target.parentNode;
        if (event.target.value == "") {
          parent.classList.remove("focus");
        }
      });
    });
  }

  sendEmail(){
    if(this.contactForm.invalid) return;
    const data = this.contactForm.value;
    this.smtp.send(data)?.subscribe(
      (res: any) =>{
        console.log(res);
        Swal.fire({
          title: "Everything OK!",
          text: res.message,
          icon: "success"
        });
        this.contactForm.reset();
        this.contactForm.markAsUntouched();
      },
      err => {
        console.log(err)
      }
    )
  }

}
