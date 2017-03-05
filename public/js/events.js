$(function() { $('.banner').unslider({animation: 'fade', autoplay: true, arrows: false,
    speed: 500, delay: 3000,  dots:false, fluid: false }); });
$(document).ready(function(){
    populate();

$("#closeit").click(function(){
$('#postadd').toggle();
});


$("#closei").click(function(){
$('#myModal').hide();
});

$('.post').click(function(){$('#postadd').show()});
$(window).click(function(e){
    if(e.target==$('.modal'))
 $('.modal').css("display" , "none");
});
});


  function sendIt(){
    var name =$('#ename').val();
    var dt =$('#dt').val();
    var tm =$('#tm').val();
    var ven =$('#ven').val();
    var des =$('#des').val();
    var img =$('#image').val();

    $.ajax({
  url: "http://localhost:2311/storeevent/"+name+'/'+dt+'/'+tm+'/'+ven+'/'+des+'/'+img,
  dataType: "jsonp",
  jsonpCallback: 'updated',
  type:'GET'
});
  }
  function updated(data){
    if(data.ans){
        alert("succesfully posted");
        location.reload();
    }
    else{
        alert("oops! something went wrong! Try again");
        location.reload();
    }

  }

  function populate(){
    $.ajax({
  url: "http://localhost:2311/getevent/",
  dataType: "jsonp",
  jsonpCallback: 'pop',
  type:'GET'
});
  }

  function pop(data){

for(var i=0;i<data.array.length;i++){
    var s1=data.array[i].date.split(" ");
    var str =" <tr class='tr'> <td class='col-2 tc pd' > <h5 style='color:red'>"+s1[0]+"</h5> <h5>"+s1[1]+"</h5> </td> <td class='col-5 pd'>  <div class='pre' onclick=\"showmod('"+data.array[i].name+"')\">"+
        "<h6 >"+data.array[i].name+"</h6>"+
        "<p style='color:#505050;vertical-align:bottom;'>"+s1[2]+" " +data.array[i].time+ "</p></div></td><td class = 'col-2 va'>"+
        "<p>"+data.array[i].venue+"</p> </td> <td class='col-3'>"+
        "<img width='100px' height='35px'  class='attend' style='float:right;margin-right:30px' src='images/attend.jpg' class='attend' onclick=\"Iamgo('"+data.array[i].name+"')\"><H4  class='s' onclick=\"Iamngo('"+data.array[i].name+"')\" ></H4></td></tr> <tr style='height:6px'><td></td></tr>";
        $('#content').append(str);
  }



$('.attend').click(function(){
      $(this).next().css("display","block");
    $(this).next().text("I'm  Going!");
    $(this).css("display","none");

});

$('.s').click(function(){
     $(this).prev().css("display","block");
    $(this).css("display","none");

});

$('.s,.intrest,.attend,.pre').hover(
    function(){$(this).css("opacity","0.7");},
    function(){$(this).css("opacity","1");});


$("#closeit").click(function(){
$('#postadd').toggle();
});


$("#closei").click(function(){
$('#myModal').hide();
});

$('.post').click(function(){$('#postadd').show()});
$(window).click(function(e){
    if(e.target==$('.modal'))
 $('.modal').css("display" , "none");
});
}

function showmod(x){
$.ajax({
  url: "http://localhost:2311/eventdetail/"+x,
  dataType: "jsonp",
  jsonpCallback: 'modshow',
  type:'GET'
});
  }

  function modshow(data){
    console.log(data.name);
var s1=data.date.split(" ");
$('#tit').html("Title:"+data.name);
$('#timee').html(s1[0]+"  "+s1[1]+"<br>" + s1[2] +" " +data.time);
$('#descee').html("<b>description:</b>"+data.desc);
$('#imageee').attr("src",("images/"+data.img));
$('#myModal').show();
  }

function Iamgo(x)
{
$.ajax({
  url: "http://localhost:2311/eventgoing/"+x,
  dataType: "jsonp",
  jsonpCallback: 'yougo',
  type:'GET'
});
}

function Iamngo(x)
{
$.ajax({
  url: "http://localhost:2311/eventNotgoing/"+x,
  dataType: "jsonp",
  jsonpCallback: 'dongo',
  type:'GET'
});
}