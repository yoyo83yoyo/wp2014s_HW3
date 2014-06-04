(function(){
	Parse.initialize("E7os0XAH8rmf2wTK8KkMyKKPOIs1fxXSw9yuHtxM","woRlpmiQvgskmwNVoQHzC16fpqa77Hl3Ly9rrqcf");//初始化Parse();
	var e={};
	["loginView","evaluationView","updateSuccessView"].forEach(function(t){
		templateCode=document.getElementById(t).text;e[t]=doT.template(templateCode)
	}); //編譯template engine函數();
	var t={
		loginRequiredView:function(e){
			return function(){
				var t=Parse.User.current();
				if(t){
					e()
				}else{
					window.location.hash="login/"+window.location.hash
				}
			}
		}
	};//可選-編寫共用函數();
	var n={
		navbar:function(){
			var e=Parse.User.current();
			if(e){
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
		evaluationView:t.loginRequiredView(function(){
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
						var s=TAHelp.getMemberlistOf(n.get("username")).filter(function(e){
							return e.StudentId!==n.get("username")?true:false
						}).map(function(e){
							e.scores=["0","0","0","0"];
							return e}) // 問看看Parse有沒有這個使用者之前提交過的peer review物件(沒有的話: 從TAHelp生一個出來(加上scores: [‘0’, ‘0’, ‘0’, ‘0’]屬性存分數並把自己排除掉)

					}else{
						var s=i.toJSON().evaluations
					}
					document.getElementById("content").innerHTML=e.evaluationView(s);
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
						} //綁定表單送出的事件(); // 如果Parse沒有之前提交過的peer review物件，要自己new一個。或更新分數然後儲存。
						console.log(s);
						i.set("evaluations",s);
						i.save(null,
							{success:function(){
								document.getElementById("content").innerHTML=e.updateSuccessView()
							},error:function(){}})},false) //把peer review物件裡的東西透過版型印到瀏覽器上();
				},
				error:function(e,t){}})
		}),
		loginView:function(t){
			var r=function(e){
				var t=document.getElementById(e).value;
				return TAHelp.getMemberlistOf(t)===false?false:true};
				var i=function(e,t,n){if(!t()){
					document.getElementById(e).innerHTML=n;
					document.getElementById(e).style.display="block"
				}else{
					document.getElementById(e).style.display="none"
				}
		}; //把版型印到瀏覽器上();

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
		},"Passwords don't match.");
		return n
	}; //綁定註冊表單的密碼檢查事件(); // 參考上課範例 
	document.getElementById("content").innerHTML=e.loginView();
	document.getElementById("form-signin-student-id").addEventListener("keyup",function(){
		i("form-signin-message",function(){
			return r("form-signin-student-id")
		},"The student is not one of the class students.")
	}); //綁定登入表單的學號檢查事件(); // 可以利用TAHelp物件
	document.getElementById("form-signin").addEventListener("submit",function(){
		if(!r("form-signin-student-id")){
			alert("The student is not one of the class students.");
			return false
		} //綁定登入表單的登入檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.logIn 
		Parse.User.logIn(document.getElementById("form-signin-student-id").value,document.getElementById("form-signin-password").value,
			{success:function(e){
				s()
			},error:function(e,t){
				i("form-signin-message",function(){
					return false
				},"Invaild username or password.")
			}})},false); //綁定登入表單的登入檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.logIn

	document.getElementById("form-signup-student-id").addEventListener("keyup",function(){
		i("form-signup-message",function(){
			return r("form-signup-student-id")
		},"The student is not one of the class students.")}); //綁定註冊表單的學號檢查事件(); // 可以利用TAHelp物件
	document.getElementById("form-signup-password1").addEventListener("keyup",o);
	document.getElementById("form-signup").addEventListener("submit",function(){
		if(!r("form-signup-student-id")){
			alert("The student is not one of the class students.");
			return false
		} // 綁定註冊表單的註冊檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.signUp和相關函數
		var e=o();
		if(!e){
			return false
		}
		var t=new Parse.User;
		t.set("username",document.getElementById("form-signup-student-id").value);
		t.set("password",document.getElementById("form-signup-password").value);
		t.set("email",document.getElementById("form-signup-email").value);
		t.signUp(null,
			{success:function(e){
				s()
			},error:function(e,t){
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
// var router = {
////    ‘’: handler.登入view函數,
//    ‘peer-evaluation’: handler.評分view函數. 
//  };
//
//  讓router活起來();
//})();


