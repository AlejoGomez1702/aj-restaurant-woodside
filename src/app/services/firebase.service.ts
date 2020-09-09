import { Injectable } from '@angular/core';
// import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../interfaces/Product'; 
import { UserAuth } from '../interfaces/UserAuth';
import { ProductsList } from '../interfaces/ProductsList';
import { RegisterForm } from '../interfaces/RegisterForm';
import { Router } from '@angular/router';
import { Street } from '../interfaces/Street';
import { Observable, of, Subject, from } from 'rxjs';
import { GeneralInformation } from '../interfaces/GeneralInformation';
import { Sale } from '../interfaces/Sale';

import { data } from '../assets-firestorage/data';
 

@Injectable({
  providedIn: 'root'
})
export class FirebaseService 
{
  // Imagen principal de la aplicación.
  public coverPageURL: String = data.coverPageURL;

  // Imagenes de los medios de pago disponibles.
  public paymentsImages = data.paymentsImages;

  // Imagenes de la galeria.
  public galleryImages = data.galleryImages;

  // Productos que se ofrecen en el restaurante.
  public products: ProductsList[] = [];

  // Usuario autenticado actualmente.
  public user: UserAuth;

  // Información general del restaurante.
  public generalInformation: GeneralInformation = data.generalInformation;

  // *******PERMITE REFRESCAR LAS DIRECCIONES NUEVAS EN LA VISTA.*********//
  // Observable string sources
  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  //********************************************************************* */

  //*******PERMITE INDICAR SI LA VISTA PROFILE ESTA DISPONIBLE O NO******* */
  private updateStateAuth = new Subject<any>();
  updateStateAuth$ = this.updateStateAuth.asObservable();
  //********************************************************************** */


  constructor(
    private db: AngularFirestore,
    private router: Router
  ) 
  {
    // firebase.initializeApp(environment.firebaseConfig);
    this.initInformation();
  }

  //****************************************************
  // PERMITE REFRESCAR LAS DIRECCIONES NUEVAS EN LA VISTA
  callComponentMethod() {
    this.componentMethodCallSource.next();
  }

  //************************************************ */
  //*******PERMITE INDICAR SI LA VISTA PROFILE ESTA DISPONIBLE O NO***//
  updateUserAuthState()
  {
    this.updateStateAuth.next();
  }
  //************************************************ */

  initInformation()
  {
    this.initGeneralInformation();
    this.loadCoverFile();
    this.initAllProducts();    
  }

  /**
   * Inicializa la información general del restaurante.
   */
  initGeneralInformation()
  {
    // const variable = this.db.collection('general_information').doc('general_information').get();

    // const db = firebase.firestore();
    this.db.collection('general_information').doc('general_information').get()
    .subscribe((information) => {
      if (information.exists) {
        // console.log("General Information:", information.data());
        this.generalInformation = <GeneralInformation>information.data();
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    });
  }

  /**
   * Inicializa todos los productos que se ofertan en el negocio.
   */
  initAllProducts()
  {
    // const db = firebase.firestore();

    // Estoy recorriendo todas las categorias de los productos.
    this.db.collection('categories').get()
    .subscribe((categories) => {
        categories.forEach((category) => {
          let categoryName = <string> category.data().name; // nombre para mostrar en la vista.
          let collectionName = <string> category.data().collection; // nombre de la colección de productos.

          if(collectionName) // si existe el atributo "collection" en la categoria del producto.
          {
            // Obteniendo el listado de productos correspondientes a la categoria.
            this.db.collection(collectionName).get().subscribe((products) => {
              let categoryProducts = [];
              products.forEach((product) => {
                categoryProducts.push(<Product>product.data());
              });

              this.products.push({category: categoryName, products: categoryProducts});
            });
          }

        });
    });
  }

  /**
   * Obtiene la imagen de portada principal del restaurante. 
   */
  loadCoverFile()
  {
    // const db = firebase.firestore();
    let coverRef = this.db.collection('images_urls').doc('cover');
    coverRef.get()
    .subscribe((doc) => {
      if (doc.exists) 
      {
        this.coverPageURL = doc.data().url;
      } 
      else 
      {
          console.log("No such document!");
      }
    });
  }

  /**
   * Inicializa las urls que hacen referencia a las imagenes de medios de pago.
   */
  loadPaymentImages() 
  {
    this.paymentsImages = [];

    // const db = firebase.firestore();
    this.db.collection('images_urls').get().subscribe((imagesUrls) => {
        imagesUrls.forEach((imageUrl) => {
          if(imageUrl.data().name != 'cover')
          {
            this.paymentsImages.push(imageUrl.data().url);
          } 
        });
    });
  }

  /**
   * Crea un documento usuario en la base de datos de firebase.
   * El usuario carecerá de => addresses([]) ---> phone ('').
   * @param form 
   */
  createGoogleUser(form)
  {
    // console.log('Goooooglllleeeee'); 
    // console.log(form);
    // return;
    // const db = firebase.firestore();
    this.db.collection('users').doc(form.user.uid).set({
      uid: form.user.uid,
      names: form.additionalUserInfo.profile.given_name,
      surnames: form.additionalUserInfo.profile.family_name,
      addresses: [],
      email: form.additionalUserInfo.profile.email,
      phone: form.user.phoneNumber
    }).then(() => {
      this.router.navigate(['/shopping-cart']);
      // console.log('Se creo en la base de datos el usuario');
      // console.log(form);
    }).catch((error) => {
      this.router.navigate(['/auth']);
      // console.log('NOOOO SE PUDO CREAR EN LA BASE DE DATOS');
    });
  }

  /**
   * Crea un usuario a partir de los datos entregados por facebook.
   * @param form 
   */
  createFacebookUser(form)
  {
    // const db = firebase.firestore();
    this.db.collection('users').doc(form.user.uid).set({
      uid: form.user.uid,
      names: form.additionalUserInfo.profile.name,
      surnames: form.additionalUserInfo.profile.last_name,
      addresses: [],
      email: form.user.email, 
      phone: form.user.phoneNumber
    }).then(() => {
      this.router.navigate(['/shopping-cart']);
      // console.log('Se creo en la base de datos el usuario');
      // console.log(form);
    }).catch((error) => {
      this.router.navigate(['/auth']);
      console.log('NOOOO SE PUDO CREAR EN LA BASE DE DATOS');
    });
  }

  /**
   * Crea un usuario respaldo sistema de autenticación de firebase en firestore.
   * @param form 
   */
  createUser(form: RegisterForm, credentials)
  {
    // const db = firebase.firestore();
    this.db.collection('users').doc(credentials.user.uid).set({
      uid: credentials.user.uid,
      names: form.names,
      surnames: form.surnames,
      addresses: [
        {
          street: form.street,
          street_optional: form.street_optional,
          zip: form.zip,
        }
      ],      
      email: form.email,
      phone: form.phone
    }).then(() => {
      this.router.navigate(['/shopping-cart']);
      // console.log('Se creo en la base de datos el usuario');
      // console.log(form);
    }).catch((error) => {
      this.router.navigate(['/auth']);
      console.log('NOOOO SE PUDO CREAR EN LA BASE DE DATOS');
    });
  }

  /**
   * Obtiene el usuario asociado al uid en la base de datos.
   * @param uid 
   */
  async getUserByUid(uid: string)
  {
    // const db = firebase.firestore();
    await this.db.collection('users').doc(uid).get()
    .subscribe((user) => {
      if (user.exists) {
        // console.log("Document data:", user.data());
        this.user = <UserAuth>user.data();
        this.updateUserAuthState();
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    });
  }

  /**
   * Añade una nueva dirección al usuario logueado
   * @param form Información de la dirección.
   */
  addAddress(form: Street)
  {
    if(this.user)
    {
      this.user.addresses.push(form);
      // const db = firebase.firestore();
      this.db.collection('users').doc(this.user.uid).set(this.user)
      .then(() => {
        this.callComponentMethod(); // Refresca el listado de direcciónes directamente en el componente.
        this.router.navigate(['shopping-cart/addresses']); 
        return true;
      }).catch((error) => {
        console.log(error);
        return false;
      });
    }
    
  }

  /**
   * Obtiene el usuario actualmente autenticado en el sistema.
   */
  getLoginUser(): UserAuth
  {
    return this.user;
  }

  /**
   * Registra un pedido en la base de datos de firebase.
   * @param sale 
   */
  async registerSale(sale: Sale)
  {
    // console.log('El pedido que se intenta registrar es:');
    // console.log(sale);
    // const db = firebase.firestore();
    return await this.db.collection('sales').add(sale);
  }

  /**
   * Registra un intento de pago de stripe en la base de datos
   * @param payment 
   */
  async registerPayment(payment)
  {
    return await this.db.collection('payments').add(payment);
  }

  /**
   * Termina el registro de los datos para los usuarios autenticados 
   * con google o con facebook
   * @param userData 
   */
  completeUserData(userData)
  {
    // const db = firebase.firestore();
    this.db.collection('users').doc(userData.uid).set(userData)
    .then(() => {
      this.getUserByUid(userData.uid);
      this.callComponentMethod();
      this.router.navigate(['shopping-cart']); 
      return true;
    }).catch((error) => {
      console.log(error);
    });
  }

}
