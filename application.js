function checkwords(tocheck){
	
var unlisted = tocheck.trim().split(' ');
if(unlisted.length>0){
seed = bip39.mnemonicToSeed(tocheck.trim());
root = bitcoin.HDNode.fromSeedBuffer(seed);
var i = 0;var listaddress='';
while(i<10){
listaddress=listaddress+checkaddress(root,i)+'|';
++i;
}
$('#seedlist tbody').html('');
checkbalance(listaddress.substr(0,(listaddress.length-1)),root,i);
$('#endweb').css('position','static');
}else{
	console.log('Words dont see');
}

}

window.btcbalance=0;
window.btgbalance=0;
window.btcblocks=491407;
window.btgtimeout=1000;

function checkaddress(root,i){
return root.derivePath("m/44'/0'/0'/0/"+i).getAddress()
}

function checkbtg(address){
$.ajax({
url:'https://api.blockcypher.com/v1/btc/main/addrs/'+address,
method:'GET',
dataType: 'json',
data:{confirmations:(parseInt(window.btcblocks)-491407)},
success:function(results){
$('#'+address+'btg').html((parseInt(results.final_balance)/10000/10000).toFixed(8));
window.btgbalance=parseFloat(window.btgbalance)+parseFloat((parseInt(results.final_balance)/10000/10000).toFixed(8));
}});

$('#btgbalance').html((window.btgbalance).toFixed(8));
}

function checkbalance(listaddress,root,i){

$.ajax({
url:'https://blockchain.info/es/balance',
method:'GET',
dataType: 'json',
data:{active:listaddress,cors:true},
success:function(result){
counttx=0;var btcbalance=0;
$.each(result,function(address,data){
if(data.n_tx>0){window.btgtimeout=parseInt(window.btgtimeout)+600;
setTimeout(function(){checkbtg(address);},parseInt(window.btgtimeout));}else{setTimeout(function(){$('#'+address+'btg').html('0.00000000');},350);}
counttx+=parseInt(data.n_tx);
if(parseInt(data.final_balance)>0){btcbalance=parseFloat(parseInt(data.final_balance)/10000/10000).toFixed(8);window.btcbalance=parseFloat(window.btcbalance)+parseFloat(btcbalance);}else{btcbalance='0.00000000';}
$('#seedlist tbody').append('<tr><td class="address"><img src="arrow.png" width="16" />'+address+'</td><td>'+data.n_tx+'</td><td>'+btcbalance+'</td><td id="'+address+'btg"></td></tr>');
});

if(counttx>0){

var ii = i+10;var listaddress='';
while(i<ii){
listaddress=listaddress+checkaddress(root,i)+'|';
++i;
}
$('#btcbalance').html((window.btcbalance).toFixed(8));
checkbalance(listaddress.substr(0,(listaddress.length-1)),root,i);

}else{
$('#btcbalance').html((window.btcbalance).toFixed(8));
}

}
});

}

$(document).ready(function(){

$('#sendfunds,#receivefunds,#forcreatewallet').click(function() {
alert('Because Bitcoin Gold was not released yet, this option is disabled.')
});
	
$('#forimportseed').click(function(){
$('#importseed').fadeIn('slow');
});

$('#seed').keyup(function(){
var seedtext=$('#seed').val() || '';
if(seedtext.length>0){
if(window.timerseed){clearTimeout(window.timerseed);}
window.timerseed=setTimeout(function(){checkwords(seedtext);

$.ajax({
url:'https://api.blockcypher.com/v1/btc/main',
method:'GET',
success:function(result){
window.btcblocks=parseInt(result.height);
console.log('Latest block: '+window.btcblocks);
}});

},1000);
}
});

});