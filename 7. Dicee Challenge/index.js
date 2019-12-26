var randomNumber1 = Math.random()*6 + 1;
randomNumber1 = Math.floor(randomNumber1);
var address = "images/dice"+ randomNumber1+".png";
// console.log(address);
document.getElementsByClassName("img1")[0].setAttribute("src",address);
var randomNumber2 = Math.floor(Math.random()*6 + 1);

address = "images/dice" + randomNumber2 + ".png";
document.getElementsByClassName("img2")[0].setAttribute("src",address);

if(randomNumber1>randomNumber2){
  document.getElementsByTagName("h1")[0].innerText= "Player 1 is winner";
}else if (randomNumber1===randomNumber2) {
  document.getElementsByTagName("h1")[0].innerText= "Draw!";
}
else{
  document.getElementsByTagName("h1")[0].innerText= "Player 2 is winner";
}
