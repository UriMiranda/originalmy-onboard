require("html-loader?attrs=img:data-src!./index.html");
import './scss/styles.scss';
console.log(API_URL);


if (module.hot) {
//   module.hot.accept('./print.js', function() {
//     console.log('Accepting the updated printMe module!');
//     printMe();
//   })
}