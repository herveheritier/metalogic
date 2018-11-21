var testCount = 0
var testFailed = 0

/****************************************************************
* fonction de pilotage des tests
* ev : string du code a évaluer
* attempt : valeur résultat attendue 
* validFunc (optionnelle) : fonction de validation
* la fonction de validation est réalisée ssi attempt est à null
*
* si le test est ok, l'évaluation est rejouée 1000 fois 
* pour mesurer les performances
******************************************************************/ 
function test(ev,attempt,validFunc=null) {
    testCount++
    console.group(ev)
    var res = eval(ev)
    //console.log(res)
    var ok = false
    if(validFunc!=null) {
        var vf = validFunc(res)
        if(Set.prototype.isPrototypeOf(res)) console.log([...res])
        else if(Array.prototype.isPrototypeOf(res)) console.log(res)
        else console.log(JSON.stringify(res,null,4))
        if(!vf) testFailed++ 
        else ok = true
    }
    else if(Array.prototype.isPrototypeOf(attempt) || Set.prototype.isPrototypeOf(attempt)) {
        if(Set.prototype.isPrototypeOf(res)) {
            console.log(Object.prototype.isPrototypeOf(res[0]) ? JSON.stringify(res,null,4) : [...res])
        }
        else if(Array.prototype.isPrototypeOf(res)) {
            console.log(Object.prototype.isPrototypeOf(res[0]) ? JSON.stringify(res,null,4) : res)
        }
        else {
            console.log(Object.prototype.isPrototypeOf(res) ? JSON.stringify(res,null,4) : res)
        }
        if(!Sets.areEqual(res,new Set(attempt))) testFailed++
        else ok = true
    }
    else if(res!=attempt) console.log(res), testFailed++
    else console.log(Object.prototype.isPrototypeOf(res) ? JSON.stringify(res,null,4) : res), ok = true

    if(ok) {
        console.log("Test passed... ")
        var t0 = performance.now()
        for(var i =0;i<1000;i++) eval(ev)
        var t1 = performance.now()
        console.log((t1-t0).toFixed(2)+"ms elapsed for 1000 executions")
    }
    else console.log("Test failed... ")
    
    console.groupEnd()
}

// compte-rendu de test

function testResults() {
    console.group('****** Tests Report *******')
    console.log("tests executed : "+testCount)
    console.log("tests passed   : "+(testCount-testFailed))
    console.log("tests failed   : "+testFailed)
    console.groupEnd()
}

// reroutage des fonctions log, group et groupEnd de l'objet console

var level = 1;

(function(){
    var oldLog = console.log;
    console.log = function (message) {
        var pre = document.createElement('pre')
        pre.appendChild(document.createTextNode(message))
        document.querySelector("body").appendChild(pre)
        //document.querySelector("body").appendChild(document.createElement('br'))
        oldLog.apply(console, arguments);
    };
    var oldGroup = console.group
    console.group = function (message) {
        var h = document.createElement('h'+level)
        h.appendChild(document.createTextNode(message))
        document.querySelector("body").appendChild(h)
        oldGroup.apply(console, arguments);
        level++
    }
    var oldGroupEnd = console.groupEnd
    console.groupEnd = function () {
        level--
        oldGroupEnd.apply(console, arguments)
    }
})();
