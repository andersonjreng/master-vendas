// import { Environment } from "../app/interfaces/Environmet";

// export const environment: Environment = {
//   production: false,
//   baseApi: "http://192.168.0.211:8080",
//   firebase: {
//     apiKey: 'AIzaSyDOp8yaZdDPuY3bwluooWLL82rc46aP3Cw',
//     authDomain: 'delivery-116a3.firebaseapp.com',
//     databaseURL: 'https://delivery-116a3-default-rtdb.firebaseio.com',
//     projectId: 'delivery-116a3',
//     storageBucket: 'delivery-116a3.appspot.com',
//     messagingSenderId: '433276619037',
//     appId: '1:433276619037:web:07f134a7cccd15f793b9f4',
//     measurementId: 'G-3JMETGV4CH',
//   },
// };
import { Environment } from "../app/interfaces/Environmet";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBqM_bpGytZCL4GfPfmSA97mHi8XXLIqPs",
    authDomain: "concrelagos-69516.firebaseapp.com",
    projectId: "concrelagos-69516",
    storageBucket: "concrelagos-69516.appspot.com",
    messagingSenderId: "84477595945",
    appId: "1:84477595945:web:6127c5b9be0fed46c22738",
    measurementId: "G-PRHTRJWV2X"
  }
};
 

const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);