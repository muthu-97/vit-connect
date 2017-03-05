$(document).ready(function(){
  $.ajax({
        url: "http://localhost:2311/logout",
        dataType: "jsonp",
        jsonpCallback: "logout",
        type:'GET',
        jsonp: 'callback',
         complete: function(data){console.log("success");}
        });
});

function checklogin()
{
    var user = $('#LUsername').val().trim().toUpperCase();
    var p = new RegExp(/^[0-9]{2}[a-z]{3}[0-9]{4}$/i);
    if(!p.test(user))
    {
         alert('Registration Number Format wrong');
        return false;
    }
     var pass = $('#LPassword').val();
     if(pass.length<8){
        alert('Password length smaller than 8');
        return false;
     }

     console.log('check login sending ajax');
     $.ajax({
        url: "http://localhost:2311/login/" +user+'/'+pass,
        dataType: "jsonp",
        jsonpCallback: "logdone",
        type:'GET',
        jsonp: 'callback',
         complete: function(data){console.log("success" +data);}
        });
}

  function logdone(data){
    console.log(data);
    if(data.ans==-1)
        alert("UserName Not Found");
    if(data.ans==0)
        alert("password Incorrect");
    if(data.ans==1)
        window.location.href="post_login.html";
}



window.checkregister=function ()
{
    var user = $('#RegistrationNumber').val().trim().toUpperCase();
    var name = $('#Name').val();
    var email = $('#Email').val();
    var pass = $('#Password').val();
    var rpass = $('#RPassword').val();


    var p = new RegExp( /^[A-Z]{1}(([a-z])+)?(\u0020{1}[A-Z]{1}[a-z]{0,})?$/);
    if(!p.test(name))
    {
        alert('Name Format wrong');
        return false;
    }

     p = new RegExp(/^[0-9]{2}[a-z]{3}[0-9]{4}$/i);
    if(!p.test(user))
    {
        alert('Registration Number Format wrong');
        return false;
    }


    p =new RegExp(  /^([a-z]+)(\u002E{1}([a-z]+))?[0-9]{4}(\u0040vit\u002Eac\u002Ein)$/i);
   if(!p.test(email))
    {
        alert('vit email Format wrong');
        return false;
    }

    if(pass.length<8){
        alert('Password length smaller than 8');
        return false;
    }

    if(!(pass.length==rpass.length)){
        alert('Passwords do not match!');
        return false;
    }
$.ajax({
  url: "http://localhost:2311/signup/" +user+'/'+name+'/'+email+'/'+pass,
  dataType: "jsonp",
  jsonpCallback: 'backcall',
  type:'GET'
});

}

function backcall(data){
    if(data.ans){
    alert("Registed Succesfully! Login to continue");
    window.location.href="login.html"
    return true;}
    else{
        alert("User already registered");
    }
}

