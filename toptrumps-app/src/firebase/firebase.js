import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import FirebaseContext, {withFirebase} from "./context";

export const firebaseConfig = {
  apiKey: "AIzaSyD6AXXzk1vqIL8ouIf2WY8Ie9b5H_aE0Ts",
  authDomain: "toppest-trumps.firebaseapp.com",
  databaseURL: "https://toppest-trumps.firebaseio.com",
  projectId: "toppest-trumps",
  storageBucket: "toppest-trumps.appspot.com",
  messagingSenderId: "618345835521",
  appId: "1:618345835521:web:96ef58e61d1513dede2400",
  measurementId: "G-V77J4J15CD"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    /* Helper */
    this.serverValue = app.database.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    // Firebase APIs //
    this.auth = app.auth();
    this.db = app.database();

    // Google Authorization Method Provider //
    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  // *** Auth API Methods ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: "http://localhost:3000"
    });

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then(snapshot => {
            const dbUser = snapshot.val();

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");

  // *** Message API ***

  message = uid => this.db.ref(`messages/${uid}`);
  messages = () => this.db.ref("messages");

  // *** Room API ***

  room = uid => this.db.ref(`rooms/${uid}`);
  rooms = () => this.db.ref("rooms");

  // *** Game API ***
  game = uid => this.db.ref(`games/${uid}`);
  games = () => this.db.ref("games");
}

export default Firebase;
