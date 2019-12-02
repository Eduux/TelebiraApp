import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  validations_form: FormGroup;
  image: any;
  item: any;
  load: boolean = false;

  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.route.data.subscribe(routeData => {
     let data = routeData['data'];
     if (data) {
       this.item = data;
     }
    })
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja cancelar ' + this.item.produto + '?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Sim',
          handler: () => {
            this.firebaseService.deleteOrder(this.item.id)
            .then(
              res => {
                this.router.navigate(["/home"]);
              },
              err => console.log(err)
            )
          }
        }
      ]
    });
    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

}
