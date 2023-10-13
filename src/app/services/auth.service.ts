import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Observable, firstValueFrom, of } from 'rxjs';
import { CreatePlayer, Player } from '../interfaces/player.interface';
import { first, map, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { actionCodeSettings } from 'src/environments/environment';
import * as firebase from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public Player$: Observable<Player>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.Player$ = <Observable<Player>>this.afAuth.authState.pipe(switchMap((user => {
      if (user) {
        return this.afs.doc<Player>(`players/${user.uid}`).valueChanges();
      } else {
        this.router.navigate(['/login']);
        return of(null);
      }
    })))
  }

  getPlayer() {
    return firstValueFrom(this.Player$);
  }


  // Register New User via email and password signup
  registerNewUser(email: string, password: string, userName: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).catch(
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    ).then(async (response) => {
      const authUser = await this.afAuth.currentUser;
      if (authUser) {
        let user = CreatePlayer(authUser.uid, authUser.displayName, authUser.email, authUser.emailVerified, authUser.photoURL);
        user.user_name = userName;
        this.updatePlayerData(user);
        return authUser.sendEmailVerification(actionCodeSettings);
      } else {
        return Promise.reject('Error creating user');
      }
    }
    )
  }

  async resendVerificationEmail(email: string) {
    let user = await this.afAuth.currentUser;
    return await user.updateEmail(email).then(async () => {
      return await user.sendEmailVerification(actionCodeSettings)
    }).catch((error) => {
      return Promise.reject(error);
    })
  }

  // Sign in with email and password
  signinWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign in with Google
  signInWithGoogle() {
    try {
      console.log('login with google called');
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      console.log('provider created', JSON.stringify(provider))
      return this.oAuthLogin(provider);
    } catch (error) {
      console.error('Error Loging in with google');
      console.error(error);
      return Promise.reject(error);
    }
  }

  private async oAuthLogin(provider: any) {
    console.log('oAuthLogin called');
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.Player$.subscribe((user) => {
          // Create New User if User is Null
          if (!user) {
            console.log('Creating a new User Profile');
            const cred = credential.user;
            const userData: Player = CreatePlayer(cred.uid, cred.displayName, cred.email, cred.emailVerified, cred.photoURL);
            this.router.navigate(['/']);
            return this.updatePlayerData(userData);
          } else {
            if (user.photo_url === '' && credential.user.photoURL !== '') {
              user.photo_url = credential.user.photoURL;
              this.updatePlayerData(user);
            }
            this.router.navigate(['/']);
            return this.afs.doc(`users/${credential.user.uid}`);
          }
        });
      }).catch((err) => { console.error(err) });
  }

  // Update User information in Firebase Database
  updatePlayerData(playerData: Player) {
    const docRef: AngularFirestoreDocument<any> = this.afs.doc(`players/${playerData.player_id}`);
    return docRef.set(playerData, { merge: true });
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      console.log('User has been logged out');
      this.router.navigate(['/login']);
    });
  }
}
