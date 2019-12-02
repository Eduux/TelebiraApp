import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.page.html',
  styleUrls: ['./new-order.page.scss'],
})
export class NewOrderPage implements OnInit {

  validations_form: FormGroup;
  products: any;

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.getProducts();
    this.resetFields();
  }

  resetFields(){
    this.validations_form = this.formBuilder.group({
      produto: new FormControl('', Validators.required),
      pagamento: new FormControl('', Validators.required),
      bairro: new FormControl('', Validators.required),
      rua: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required)
    });
  }

  getProducts() {
    this.firebaseService.getProducts()
    .then(data => {
      data.subscribe(res => {
        this.products = res;
      })
    }, err => {
      console.log(err);
    })
  }

  onSubmit(value){
    let data = {
      produto: value.produto,
      bairro: value.bairro,
      rua: value.rua,
      numero: value.numero,
      pagamento: value.pagamento,
      status: 'Recebido'
    }
    console.log(data);
    this.firebaseService.createOrder(data)
    .then(
      res => {
        this.router.navigate(["/home"]);
      }
    )
  }
  async presentLoading(loading) {
    return await loading.present();
  }

}
