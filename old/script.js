function contactMe() {
  const answer = prompt(`Please choose a way to contact me.
  You can select from:
  email
  Note: Capitalization and spelling matters!`)
  switch (answer) {
    case "email":
      window.open("mailto:bestspark687090@gmail.com")
      break;
    default:
      break;
  }
}
let wordThis = document.querySelector('this')
wordThis.addEventListener('click', function(){
  alert('actually i used css, i thought about js first then css later')
})