(function(){
	Parse.initialize("E7os0XAH8rmf2wTK8KkMyKKPOIs1fxXSw9yuHtxM","woRlpmiQvgskmwNVoQHzC16fpqa77Hl3Ly9rrqcf");
	var temp={};
	["loginView","evaluationView","updateSuccessView"].forEach(function(t){
		templateCode=document.getElementById(t).text;temp[t]=doT.template(templateCode)
	});
	var using={
		loginRequiredView:function(temp){
			return function(){
				var curr=Parse.User.current();
				if(curr){
					temp()
				}else{
					window.location.hash="login/"+window.location.hash
				}
			}
		}
	};
	var n={
		navbar:function(){
			var curr=Parse.User.current();
			if(curr){
				document.getElementById("loginButton").style.display="none";
				document.getElementById("logoutButton").style.display="block";
	document.getElementById("evaluationButton").style.display="block"
			}else{
				document.getElementById("loginButton").style.display="block";
				document.getElementById("logoutButton").style.display="none";
				document.getElementById("evaluationButton").style.display="none"
			}
			document.getElementById("logoutButton").addEventListener("click",function(){
				Parse.User.logOut();
				n.navbar();
				window.location.hash="login/"
			})
		},
		evaluationView:using.loginRequiredView(function(){
			var t=Parse.Object.extend("Evaluation");
			var n=Parse.User.current();
			var r=new Parse.ACL;
			r.setPublicReadAccess(false);
			r.setPublicWriteAccess(false);
			r.setReadAccess(n,true);
			r.setWriteAccess(n,true);
			var i=new Parse.Query(t);
			i.equalTo("user",n);
			i.first(
				{success:function(i){
					window.EVAL=i;
					if(i===undefined){
						var s=TAHelp.getMemberlistOf(n.get("username")).filter(function(temp){
							return temp.StudentId!==n.get("username")?true:false
						}).map(function(temp){
							temp.scores=["0","0","0","0"];
							return temp})
					}else{
						var s=i.toJSON().evaluations
					}
					document.getElementById("content").innerHTML=temp.evaluationView(s);
					document.getElementById("evaluationForm-submit").value=i===undefined?"送出表單":"修改表單";
					document.getElementById("evaluationForm").addEventListener("submit",function(){
						for(var o=0;o<s.length;o++){
							for(var u=0;u<s[o].scores.length;u++){
								var a=document.getElementById("stu"+s[o].StudentId+"-q"+u);
								var f=a.options[a.selectedIndex].value;
								s[o].scores[u]=f
							}
						}
						if(i===undefined){
							i=new t;
							i.set("user",n);
							i.setACL(r)
						}
						console.log(s);
						i.set("evaluations",s);
						i.save(null,
							{success:function(){
								document.getElementById("content").innerHTML=temp.updateSuccessView()
							},error:function(){}})},false)
				},
				error:function(temp,t){}})
		}),
		loginView:function(using){
			var r=function(temp){
				var t=document.getElementById(temp).value;
				return TAHelp.getMemberlistOf(t)===false?false:true};
				var i=function(temp,t,n){if(!t()){
					document.getElementById(temp).innerHTML=n;
					document.getElementById(temp).style.display="block"
				}else{
					document.getElementById(temp).style.display="none"
				}
		};
	var s=function(){
		n.navbar();
		window.location.hash=t?t:""
	};
	var o=function(){
		var e=document.getElementById("form-signup-password");
		var t=document.getElementById("form-signup-password1");
		var n=e.value===t.value?true:false;
		i("form-signup-message",function(){
			return n
		},"密碼錯誤");
		return n
	};
	document.getElementById("content").innerHTML=temp.loginView();
	document.getElementById("form-signin-student-id").addEventListener("keyup",function(){
		i("form-signin-message",function(){
			return r("form-signin-student-id")
		},"非本課程學生")
	});
	document.getElementById("form-signin").addEventListener("submit",function(){
		if(!r("form-signin-student-id")){
			alert("非本課程學生");
			return false
		}
		Parse.User.logIn(document.getElementById("form-signin-student-id").value,document.getElementById("form-signin-password").value,
			{success:function(temp){
				s()
			},error:function(temp,using){
				i("form-signin-message",function(){
					return false
				},"錯誤的帳號或密碼")
			}})},false);
	document.getElementById("form-signup-student-id").addEventListener("keyup",function(){
		i("form-signup-message",function(){
			return r("form-signup-student-id")
		},"非本課程學生")});
	document.getElementById("form-signup-password1").addEventListener("keyup",o);
	document.getElementById("form-signup").addEventListener("submit",function(){
		if(!r("form-signup-student-id")){
			alert("非本課程學生");
			return false
		}
		var use=o();
		if(!use){
			return false
		}
		var t=new Parse.User;
		t.set("username",document.getElementById("form-signup-student-id").value);
		t.set("password",document.getElementById("form-signup-password").value);
		t.set("email",document.getElementById("form-signup-email").value);
		t.signUp(null,
			{success:function(use){
				s()
			},error:function(use,t){
				i("form-signup-message",function(){
					return false
				},t.message)}})},false)}};
	var r=Parse.Router.extend({
		routes:{
			"":"indexView",
			"peer-evaluation/":"evaluationView",
			"login/*redirect":"loginView"
		},
		indexView:n.evaluationView,
		evaluationView:n.evaluationView,
		loginView:n.loginView
	});
	
	this.Router=new r;
	Parse.history.start();
	n.navbar()
})()

