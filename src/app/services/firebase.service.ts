import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ){}

  getProducts() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('produtos').snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }


  getOrders(){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('pedidos').doc(currentUser.uid).collection('orders').snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getOrder(taskId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.doc<any>('pedidos/' + currentUser.uid + '/orders/' + taskId).valueChanges()
          .subscribe(snapshots => {
            resolve(snapshots);
          }, err => {
            reject(err)
          })
        }
      })
    });
  }

  unsubscribeOnLogOut(){
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateOrder(orderKey, value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('pedidos').doc(currentUser.uid).collection('orders').doc(orderKey).set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  deleteOrder(orderKey){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('pedidos').doc(currentUser.uid).collection('orders').doc(orderKey).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  createOrder(value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('pedidos').doc(currentUser.uid).collection('orders').add({
        produto: value.produto,
        data: new Date().toLocaleDateString(),
        hour: new Date().toLocaleTimeString(),
        bairro: value.bairro,
        rua: value.rua,
        numero: value.numero,
        pagamento: value.pagamento,
        status: value.status
      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
}
