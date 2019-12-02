import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  validation_messages = {
   'email': [
     { type: 'required', message: 'Email é obrigatório.' },
     { type: 'pattern', message: 'Coloque um e-mail válido!' }
   ],
   'password': [
     { type: 'required', message: 'Senha é obrigatória' },
     { type: 'minlength', message: 'Senha precisa de 5 caracteres' }
   ]
 };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  async tryLogin(value){
    const loading = await this.loadingCtrl.create({
      message: 'Aguarde...'
    });
    this.presentLoading(loading);

    this.authService.doLogin(value)
    .then(res => {
      loading.dismiss();
      this.router.navigate(["/home"]);
    }, err => {
      loading.dismiss();
      this.errorMessage = err.message;
      console.log(err)
    })
  }

  goRegisterPage(){
    this.router.navigate(["/register"]);
  }

  async presentLoading(loading) {
    return await loading.present();
  }
}
