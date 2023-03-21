const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');

const closebtn = document.getElementById('closebutton');
btn1.addEventListener('click',()=>{
    const image = document.getElementById('blah');
    image.src = document.getElementById('first').getAttribute('src');
});
btn2.addEventListener('click',()=>{
    const image = document.getElementById('blah');
    image.src = document.getElementById('second').getAttribute('src');
});
btn3.addEventListener('click',()=>{
    const image = document.getElementById('blah');
    image.src = document.getElementById('third').getAttribute('src');
});
btn4.addEventListener('click',()=>{
    const image = document.getElementById('blah');
    image.src = document.getElementById('fourth').getAttribute('src');
});

// closebtn.addEventListener('click',()=>{
//     document.getElementById.
// })


function CheckOther(val){
    var element=document.getElementById('other');
    if(val=='8')
      element.style.display='block';
    else  
      element.style.display='none';
}