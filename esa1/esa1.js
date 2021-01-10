var looper;
var degrees = 0;
function rotateAnimationStep(el,speed){
	var elem = document.getElementById(el);
	elem.style.transform = "rotate("+degrees+"deg)";
	degrees ++;
	if(degrees > 359){
		degrees = 1;
    }
    document.getElementById("status").innerHTML = "rotate("+degrees+"deg)";
}

function rotateAnimationNegStep(el,speed){
	var elem = document.getElementById(el);
	elem.style.transform = "rotate("+degrees+"deg)";
	degrees --;
	if(degrees > 359){
		degrees = 1;
    }
    document.getElementById("status").innerHTML = "rotate("+degrees+"deg)";
}

function rotateAnimation(el,speed){
	var elem = document.getElementById(el);
	elem.style.transform = "rotate("+degrees+"deg)";
	looper = setTimeout('rotateAnimation(\''+el+'\','+speed+')',speed);
	looper = ('rotateAnimation(\''+el+'\','+speed+')',speed);
	degrees ++;
	if(degrees > 359){
		degrees = 1;
    }
    document.getElementById("status").innerHTML = "rotate("+degrees+"deg)";
}

function rotateAnimationStop(el,speed){
	var elem = document.getElementById(el);
    location.reload();
}

window.onkeydown = function(evt) {

	var key = evt.which ? evt.which : evt.keyCode;
	var c = String.fromCharCode(key);
	switch (c) {
		case ('R'):
			rotateAnimationStep("watermelon",0);
			break;
		case ('L'):
			rotateAnimationNegStep("watermelon",0);
			break;
		case ('A'):
			rotateAnimation("watermelon",0);
			break;
		case ('S'):
			rotateAnimationStop("watermelon",0);
            break;
	}
};