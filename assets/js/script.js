try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
} catch (e) {
    $('.no-browser-support').show();
    $('.app').hide();
}


var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');
var placedomain = $("#sltdomain");

var recogContent = '';
var host = window.location.hostname;

/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = false;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        recogContent += transcript;
        noteTextarea.val(recogContent);
    }
};

recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onstop = function() {
    instructions.text('Voice recognition deactivated.');
}

recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
    recognition.stop(); //stop recoginition
    setTimeout(function(){ recognition.start(); }, 5000);
}

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
        recognition.stop(); //stop recoginition
        setTimeout(function(){ recognition.start(); }, 5000);
    };
}


/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 5;
    speech.rate = 1;
    speech.pitch = 3;

    window.speechSynthesis.speak(speech);
}


/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
    if (recogContent.length) {
        recogContent += ' ';
    }
    recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    recogContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
    recognition.stop();

    if (!recogContent.length) {
        instructions.text('Could not save empty note. Please add a message to your note.');
    } else {
        // Save note to localStorage.
        // The key is the dateTime with seconds, the value is the content of the note.
        saveNote(new Date().toLocaleString(), recogContent);

        // Reset variables and update UI.
        recogContent = '';
        renderNotes(getAllNotes());
        noteTextarea.val('');
        instructions.text('Note saved successfully.');
    }

})


notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);

    // Listen to the selected note.
    if (target.hasClass('listen-note')) {
        var content = target.closest('.note').find('.content').text();
        readOutLoud(content);
    }

    // Delete note.
    if (target.hasClass('delete-note')) {
        var dateTime = target.siblings('.date').text();
        deleteNote(dateTime);
        target.closest('.note').remove();
    }
});


function load(){
    readOutLoud("Hello Axon here");
    recognition.start();
    operation1();
}

function changeImage(){
    document.getElementById("imgClickAndChange").innerHTML=""
    document.getElementById("imgClickAndChange2").innerHTML="<img alt='' src='./assets/img/sound_200.gif'  style='height: 100px; width: 100px;'>"
   
}
function operation3(action_nome,urll){
    setInterval ( function(){
        content=recogContent;
        noteTextarea.text(content);
        if(content.toLowerCase().search("select")>=0){
            strsplit= content.split(" ");
            if(strsplit[1]=="one"){
                ind=0;
            }
            if(strsplit[1]=="to" || strsplit[1]=="too"){
                index=1;
            }
            else{
                ind = Number(strsplit[1]);
                ind= ind-1;
            }
            if (ind==undefined||action_nome[ind]==undefined || action_nome[ind]==NaN){
                readOutLoud("invalid request try again");
            }
            readOutLoud("Fetching Details from "+action_nome[ind]);
            recogContent="";
            getlvl4(urll[ind]);
        }
        if(content.toLowerCase().search("home")>=0){
            readOutLoud("Returing back to home");
            clearTimeout();
            action_nome=[],urll=[];
            recogContent="";
        }
    },5000);
}

function operationexp(action_name){
    setInterval ( function(){
        content=recogContent;
        noteTextarea.text(content);
        if(content.toLowerCase().search("explore")>=0){
            strsplit= content.split(" ");
            if(strsplit[1]=="one"){
                index=0;
            }
            if(strsplit[1]=="to" || strsplit[1]=="too"){
                index=1;
            }
            else{
                index = Number(strsplit[1]);
                index= index-1;
            }
            // readOutLoud("Fetching Details from "+action_name[index]+" in "+toget);
            recogContent="";
            getlvl6(action_name[index]);
        }
        if(content.toLowerCase().search("home")>=0){
            readOutLoud("Returing back to home");
            action_name=[];toget=""
            // operation1();
            recogContent="";
        }
    },5000);
}

function operationonly(action_name,toget){
        setInterval ( function(){
            content=recogContent;
            noteTextarea.text(content);
            if(content.toLowerCase().search("use")>=0){
                strsplit= content.split(" ");
                if(strsplit[1]=="one"){
                    index=0;
                }
                if(strsplit[1]=="to" || strsplit[1]=="too"){
                    index=1;
                }
                else{
                    index = Number(strsplit[1]);
                    index= index-1;
                }
                readOutLoud("Fetching Details from "+action_name[index]+" in "+toget);
                recogContent="";
                getlvl2(toget,action_name[index]);
            }
            if(content.toLowerCase().search("home")>=0){
                readOutLoud("Returing back to home");
                action_name=[];toget=""
                // operation1();
                recogContent="";
            }
        },5000);
    }

function operation1(){
    setInterval ( function(){
        content=recogContent;
        noteTextarea.text(content);
        if(content.search("find")>=0){
            var findterm = recogContent.replace(/\s/g, '');
            var find_len = findterm.search("find")+4;
            tofind = findterm.substring(find_len,findterm.length);
            readOutLoud("Finding "+tofind);
            if(tofind.search("in")>=0){
                todata=tofind.split("in");
                getlvl2(todata[0],todata[1]);
            }
            else{
                recogContent="";
                getlvl1(tofind);
            }
        }
        if(content.toLowerCase().search("home")>=0){
            readOutLoud("Returing back to home");
            clearTimeout();
            recogContent="";
        }
    },5000);
}

function getinterdata(url,ii){
    te = url.split("/");
    limit = url.indexOf(te[8])-1;
    tourl= url.substring(0,limit); 
    var proxy="https://rbacproxy.herokuapp.com/";
    var xmlhttp = new XMLHttpRequest();
    var result = "";
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        xmlDoc = xmlhttp.responseXML;
        x = xmlDoc.getElementsByTagName("Pid");
        for(i=0;i<x.length;x++){
            if(url.includes(x[i].children[1].innerHTML)){
                localStorage.setItem("temp"+ii,x[i].children[0].innerHTML);
            }
        }
    }
    }
    xmlhttp.open("GET", proxy+tourl,true);
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.send();
}


function getlvl1(toget){
    var proxy="https://rbacproxy.herokuapp.com/";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        xmlDoc = xmlhttp.responseXML;
        x = xmlDoc.getElementsByTagName("Action");
        if(x.length==0){
            readOutLoud("No Data from Axon");
            operation1();
            recogContent="";
        }
        else{
            toread = "";
            rm_dupli=[];
            for (i = 0; i< x.length; i++) {
                // getinterdata(x[i].children[1].innerHTML,i);
                // toread+=(i+1)+". Found "+x[i].children[0].innerHTML+" from "+localStorage.getItem("temp"+i)+" ";
                tosplit=x[i].children[1].innerHTML.split("/");
                if(rm_dupli.includes(tosplit[7])==false){ 
                    rm_dupli.push(tosplit[7]);
                    toread+=(rm_dupli.length)+"Found "+toget+" in "+tosplit[7]+"   ";
                }
            }
            notesList.text(toread);
            readOutLoud(toread);
            operationonly(rm_dupli,toget);
            recogContent="";
        }
      }
    }
    xmlhttp.open("GET", proxy+"http://"+host+":3000/Axon/MasterKube/search/masterkube?element="+toget,true);
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.send();
}

function getlvl2(toget,interm){
    var proxy="https://rbacproxy.herokuapp.com/";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        xmlDoc = xmlhttp.responseXML;
        x = xmlDoc.getElementsByTagName("Name");
        if(x.length==0){
            readOutLoud("No Data from Axon");
            recogContent="";
        }
        else{
            toread = "";
            returnlist=[];
            aname2=[];url2=[];
            for (i = 0; i< x.length; i++) {
                temp=""
                temp+=x[i].children[0].innerHTML+", ";
                returnlist=x[i].children[0].innerHTML.split("/");
                // getinterdata(x[i].children[0].innerHTML,i);
                // toread+=(i+1)+".Found "+returnlist[9]+" from "+localStorage.getItem("temp"+i)+"   ";
                toread+=(i+1)+"Found "+returnlist[9]+" from "+returnlist[8]+"   ";
                aname2.push(returnlist[9]);url2.push(x[i].children[0].innerHTML);
            }
            notesList.text(toread);
            readOutLoud(toread);
            localStorage.clear();
            operation3(aname2,url2);
            recogContent="";
        }
      }
    }
    xmlhttp.open("GET", proxy+"http://"+host+":3000/Axon/MasterKube/search/masterkube/"+interm+"?element="+toget,true);
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.send();
    recogContent="";
}

function getlvl4(url){
    var proxy="https://rbacproxy.herokuapp.com/";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        xmlDoc = xmlhttp.responseXML;
        x = xmlDoc.getElementsByTagName("Element");
        outread="";
        val=0;
        namearr=[];
        readpointer=""
        for(j = 0; j < x.length; j++){
            if(x[j].children[1].innerHTML != "name"){
                readpointer+= x[j].children[0].innerHTML+" "+x[j].children[2].innerHTML;
                outread += (readpointer+"\n"); 
            }
            if(x[j].children[1].innerHTML == "name"){
                val+=1;
                namearr.push(x[j].children[2].innerHTML);
                readpointer+= val+" pointer "+x[j].children[0].innerHTML;
                outread += (readpointer+"\n"); 
            }
        }
        readOutLoud(readpointer);
        operationexp(namearr);
        notesList.text(outread);
      }
    }
    xmlhttp.open("GET", proxy+url,true);
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.send();
    recogContent="";
}


function getlvl6(url){
    var proxy="https://rbacproxy.herokuapp.com/";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        xmlDoc = xmlhttp.responseXML;
        x = xmlDoc.getElementsByTagName("Element");
        url_fire1 = x[0].children[2].innerHTML
        if(url_fire1.search("/2/Tell") > 0){
            url_fire1 = url_fire1.replace("/2/Tell", "/1/Tell");
        }

        var xml2 = new XMLHttpRequest();
        xml2.onreadystatechange = function(){
            if (this.readyState ==4 && this.status ==200){
                xml2doc = xml2.responseXML;
                xdata = xml2doc.getElementsByTagName("Element");
                outread=""
                for(j = 0; j < xdata.length; j++){
                    if(xdata[j].children[1].innerHTML!="name"){
                        readout= xdata[j].children[0].innerHTML+" "+xdata[j].children[2].innerHTML;
                        readOutLoud(readout);
                        outread += (readout+"\n"); 
                    }
                }
                notesList.text(outread);
                recogContent="";
            }
        }

        xml2.open("GET", proxy+url_fire1,true);
        xml2.overrideMimeType('text/xml');
        xml2.send();
      }
    }
    xmlhttp.open("GET", proxy+url,true);
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.send();
}


function getlvl5(toget,interm){
    var proxy="https://rbacproxy.herokuapp.com/";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        xmlDoc = xmlhttp.responseXML;
        x = xmlDoc.getElementsByTagName("Name");
        if(x.length==0){
            readOutLoud("No Data from Axon");
            recogContent="";
        }
        else{
            toread = "";
            returnlist=[];
            aname2=[];url2=[];
            for (i = 0; i< x.length; i++) {
                temp=""
                temp+=x[i].children[0].innerHTML+", ";
                returnlist=x[i].children[0].innerHTML.split("/");
                // getinterdata(x[i].children[0].innerHTML,i);
                // toread+=(i+1)+".Found "+returnlist[9]+" from "+localStorage.getItem("temp"+i)+"   ";
                toread+=(i+1)+"Found "+returnlist[9]+" from "+returnlist[8]+"   ";
                aname2.push(returnlist[9]);url2.push(x[i].children[0].innerHTML);
            }
            notesList.text(toread);
            readOutLoud(toread);
            localStorage.clear();
            operation3(aname2,url2);
            recogContent="";
        }
      }
    }
    xmlhttp.open("GET", proxy+"http://"+host+":3000/Axon/MasterKube/search/masterkube/"+interm+"?element="+toget,true);
    xmlhttp.overrideMimeType('text/xml');
    xmlhttp.send();
    recogContent="";
}
