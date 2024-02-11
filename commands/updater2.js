const { SlashCommandBuilder } = require('discord.js');
const { authorId } = require('../config.json');
const fs = require('node:fs');

const runstart = 1703710800000; //inverse white
//easy way to get the start time for a different one is here https://currentmillis.com/
const file = "./logs/invwhite.txt";

const msglen = 1900;
const updateLength = 60 * 1000;

var badgepoint = 0;
var pokepoint = 0;
//Literally I manually set this whenever I want them to do past events. Don't code like this
var allpoint2 = 0;


var trimpoint = 0;
var msgpoint = 0;
var sidegamepoint = 0;
var trimmedmsg = [];

var waiting = 0;
var enemy_yes = 0;
var legend_yes = 0;
var shiny_yes = 0;
var attempts2 = 0; //change this!!
var elitefourWIP2 = 0;

var wherearewe = "";
var monies = "";
var buals = 0;

var partychange2 = 0;
var curparty2 = [];
var pvs = [];
var specy = [];
var partyfull2 = [];

var badges = 0;
var caught = [];

var curdaycare = [];
var daycarechange = 0;
var daycarepvs = [];
var daycarespecy = [];
var daycarefull = [];

var pcboxes = [];
var pc_pvs = [];
var pcboxcount = 0;
var pc_didweswitchgame = 0;

// gen 3
// var ribbons = 0;
// var contests_won = 0;


//jesus christ maybe make a file or something. why are there so many of these
const legendaries = ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Mew", 
					"Entei", "Raikou", "Suicune", "Lugia", "Ho-Oh", "Celebi",
					"Regirock", "Regice", "Registeel", "Latias", "Latios", "Groudon", "Kyogre", "Rayquaza", "Deoxys", "Jirachi",
					"Dialga", "Palkia", "Giratina", "Uxie", "Mesprit", "Azelf", "Cresselia", "Heatran", "Regigigas", "Manaphy", "Darkrai", "Shaymin", "Arceus",
					"Cobalion", "Terrakion", "Virizion", "Tornadus", "Landorus", "Thundurus", "Reshiram", "Zekrom", "Kyurem", "Victini", "Keldeo", "Meloetta", "Genesect",
					"Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion",
					"Type: Null", "Silvally", "Tapu Koko", "Tapu Bulu", "Tapu Lele", "Tapu Fini", "Cosmog", "Cosmoem", "Solgaleo", "Lunala", "Necrozma", "Magearna", "Marshadow", "Zeraora", "Meltan", "Melmetal",
					"Zacian", "Zamazenta", "Eternatus", "Kubfu", "Urshifu", "Regieleki", "Regidrago", "Glastrier", "Spectrier", "Calyrex", "Zarude", "Enamorus", 
					"Miraidon", "Koraidon", "Ting-Lu", "Chien-Pao", "Wo-Chien", "Chi-Yu",
					"Phancero", "Varaneous", "Raiwato", "Fambaco", "Libabeel"];

const elitefour = ["lorelei", "will", "sidney", "aaron"];
const elitefourlocs = ["Tyron Tower", "Sylon League", "Pokemon League", "Indigo Plateau", "Ivara League", "Ever Grande   City"];

const locs2calmdownabout = ["PWT", "Battle Arcade", "Battle Castle", "Battle Factory", "Battle Frontier", "Battle Hall", "Battle Tower"];

var msg = "";
var curmsg = "";
var movemsg = "";

function cleanName(rawname){
	let regex = /\u03c0/gi;
	rawname = rawname.replace(regex, 'Pk');
	regex = /\u00b5/gi;
	rawname = rawname.replace(regex, 'Mn');
	regex = /♚/gi;
	rawname = rawname.replace(regex, '😀');
	regex = /☾/gi;
	rawname = rawname.replace(regex, '💤');
	regex = /♛/gi;
	rawname = rawname.replace(regex, '😠');
	return rawname;
}

const trim = (str, max) => str.length > max ? `${str.slice(0, max - 3)}...` : str;




module.exports = {
	data: new SlashCommandBuilder()
		.setName('updater2')
		.setDescription('Posts run updates from the TPP API.'),
	async execute(interaction) {
		if(interaction.user.id === authorId){
			await interaction.reply({ content: 'Starting updater :)', ephemeral: true });
		}


	function sendMessage(wordsgohere){
			//console.log("ough");
			// if (channel?.messages?.cache == undefined) {
			// 	//console.log("discord please i am in pain");
			// 	//setTimeout(sendMessage(wordsgohere), 60000);
			// }
			try{ 
				interaction.channel.send(wordsgohere, (err) => {
					if (err) {
			   			console.error(err);
						return;
			 		};
				});
			}catch{
				console.log("discord please i am in pain");
			}
		}

			var interval = setInterval (async function () {
			 	var list = {};
			 	try{ 
					list = await fetch(`https://twitchplayspokemon.tv/api/run_status?`).then(list => list.json());
					jsonData = list;

					//this bit makes it know when the run time is
					var i;
					var time;
					var elapsed = 0;
					
					var diff = {};
				
					diff.days    = 0
					diff.hours   = 0
					diff.minutes = 0
					diff.seconds = 0

					msg = "";
					curmsg = "";


//Notifies if we're in a battle.
					var classname = "";
					var trainername = "";
					if(jsonData.enemy_trainers && jsonData.enemy_trainers.length > 0 && enemy_yes == 0){  // noncoli
					//if(jsonData.in_battle && enemy_yes == 0){ //coli
						enemy_yes = 1;
						if(jsonData.enemy_trainers[0].class_name){
							classname = jsonData.enemy_trainers[0].class_name;
						}
						if(jsonData.enemy_trainers[0].name){
							trainername = jsonData.enemy_trainers[0].name;
						}

						//fix the PkMn characters
						trainername = cleanName(trainername);
						classname = cleanName(classname);

						msg = '🆚 Battle: '+classname;
						if(classname != trainername){
							msg = msg+' '+trainername; //so that gen 1 doesn't say BRUNO BRUNO
						}
						if(elitefourlocs.includes(jsonData.map_name) && elitefourWIP2 == 0){ //E4 attempt counter for gens with set E4 order (there's probably a way to do the other gens but I'm lazy)
							elitefourWIP2 = 1;
							attempts2++;
							msg = msg+' (Attempt #'+attempts2+')';
						}
						msg = msg+'.\n';

					}
					if(!jsonData.enemy_trainers){
					 	enemy_yes = 0;
					 } //noncoli

					//if(!jsonData.in_battle){ //coli
						//enemy_yes = 0;
					//}

					if(msg !=""){
						sendMessage(msg);
						fs.appendFile(file, msg, (err) => {
							if (err) {
									console.error(err);
								return;
								}
						});
					}

//Notifies when our ball count changes (lol).
					if(!jsonData.ball_count && buals != 0){
						sendMessage('🍚 We now have 0 Pok\u{00E9} Balls.');
						buals = 0;
					}
					if(jsonData.ball_count && jsonData.ball_count != buals){
						curmsg = '🍚 We now have '+jsonData.ball_count+' Pok\u{00E9} Ball';
						if(jsonData.ball_count != 1){
							curmsg = curmsg+"s";
						}
						curmsg = curmsg+".\n";
						sendMessage(curmsg);
						fs.appendFile(file, curmsg, (err) => {
							if (err) {
									console.error(err);
								return;
								}
						});

						buals = jsonData.ball_count;
					}

//Detects new mon in the PC.
//TODO: report when a mon leaves the PC
//Since I haven't done that part yet,
//right now if we deposit -> withdraw -> deposit it won't detect the second one
//since it's still in the PVs
//Kinda cursed tbh


					msg = "";
					curmsg = "";
					//if you don't have the correct box quantity set that and come back
					//this happens when first booting up, or if new boxes show up? which happens sometimes?
					if(jsonData.pc.boxes == null){
						console.log("pc is null rn pls wait");
						return;
					}
					//When you're just starting up, pcboxes and pcboxcount will be [] and 0
					if(pcboxes.length != jsonData.pc.boxes.length && pcboxcount == 0){
						pcboxes = jsonData.pc.boxes;
						console.log("pc boxes = "+pcboxes.length);

						for(i = 0; i < jsonData.pc.boxes.length; i++){
							for(j = 0; j < jsonData.pc.boxes[i].box_contents.length; j++){
								var currentpv = jsonData.pc.boxes[i].box_contents[j].personality_value;
								console.log(currentpv);
								pc_pvs.push(currentpv);
							}
						}
						console.log('pvs:\n'+pc_pvs);
						pcboxcount = jsonData.pc.boxes.length;
					}

					if(pcboxes.length != jsonData.pc.boxes.length && pcboxcount != 0){
						console.log("Detected a new box.");
						for(i = pcboxcount; i < jsonData.pc.boxes.length; i++){
							for(j = 0; j < jsonData.pc.boxes[i].box_contents.length; j++){
								var currentmon = jsonData.pc.boxes[i].box_contents[j];
								pc_pvs.push(currentmon.personality_value);
							}
						}
						pcboxcount = jsonData.pc.boxes.length;
						pcboxes = jsonData.pc.boxes;
						console.log("pc boxes now = "+pcboxes.length);
						console.log('pvs now\n'+pc_pvs);
					}

					//Detect if a new mon has been added to the PC.
					curmsg = "";
					var current_pvs = [];
					for(i = 0; i < jsonData.pc.boxes.length; i++){ 
						for(j = 0; j < jsonData.pc.boxes[i].box_contents.length; j++){
							var currentmon = jsonData.pc.boxes[i].box_contents[j];
							current_pvs.push(currentmon.personality_value);
							if(!pc_pvs.includes(currentmon.personality_value)){
								console.log("New mon detected.");
								curmsg = curmsg+'🖥️ New Pok\u{00E9}mon in box '+jsonData.pc.boxes[i].box_number+': __'; //🪦🖥️
								var curname = cleanName(currentmon.name);
								curmsg = curmsg+curname+'__, Lv.'+currentmon.level+' '+currentmon.species.name+'.\n';
								pc_pvs.push(currentmon.personality_value);
								pc_didweswitchgame++;
							}
						}
					}
					//console.log('current pvs: '+current_pvs);

					// var old_pvs = []; //test


					//Detect if a mon is missing from the PC.
					for(i = 0; i < pcboxes.length; i++){

						for(j = 0; j < pcboxes[i].box_contents.length; j++){
							var currentmon = pcboxes[i].box_contents[j];
							// old_pvs.push(currentmon.personality_value); //test
							if(!current_pvs.includes(currentmon.personality_value)){
								console.log("Mon missing?");
								curmsg = curmsg+'🖥️📤 Pok\u{00E9}mon has left box '+pcboxes[i].box_number+'?: __'; //👻🖥️📤
								curmsg = curmsg+currentmon.name+'__, Lv. '+currentmon.level+' '+currentmon.species.name+'.\n';
								var temparray = pc_pvs.filter(function(pv){
									return pv != currentmon.personality_value;
								});
								pc_pvs = temparray;
								pc_didweswitchgame++;
							}
						} 
						
					}

					// console.log('old pvs: '+old_pvs);
					// console.log('final pvs: '+pc_pvs);

					pcboxes = jsonData.pc.boxes;


					//If too many pokemon appear/disappear at once,
					//Something's Clearly Up, so don't send the message.
					//Increase this if we play a game with a mass release option.
					if(pc_didweswitchgame >= 5){
						curmsg = "";
					}

					pc_didweswitchgame = 0;
					
					if(curmsg !=""){
						sendMessage(curmsg);
						fs.appendFile(file, curmsg, (err) => {
							if (err) {
									console.error(err);
								return;
								}
						});
					}



//Notifies when our party changes. Currently this works by checking if the personality values (unique) or species in the party have changed.
//It then just posts the whole party because idk how to do it better right now.
//Figure out how to update on level up too please
					partychange2 = 0;
					msg = "";
					curmsg = "";

					if(curparty2.length === 0 && jsonData.party.length > 0){
						for(i = 0; i < jsonData.party.length; i++){
							curparty2[i] = {};
							curparty2[i].name = jsonData.party[i].name;
							curparty2[i].level = jsonData.party[i].level;
							curparty2[i].species = jsonData.party[i].species.name;
							curparty2[i].personality = jsonData.party[i].personality_value;
							pvs[i] = jsonData.party[i].personality_value;
							specy[i] = jsonData.party[i].species.name;

						}
						partyfull2 = jsonData.party;
					}
					for(i = 0; i < jsonData.party.length; i++){
						if(!pvs.includes(jsonData.party[i].personality_value) || !specy.includes(jsonData.party[i].species.name) || jsonData.party.length != pvs.length){
							if(!locs2calmdownabout.includes(jsonData.map_name)){
								partychange2 = 1;
								console.log("what");
							}
						}
					}
					if(partychange2 === 1){
						console.log('party change...');
						curmsg = '✍️ Our party looks different now...\n        Current party: '
						for(i = 0; i < jsonData.party.length; i++){
							var curname = cleanName(jsonData.party[i].name);
							curmsg = curmsg.concat("__"+curname+"__, Lv. "+jsonData.party[i].level+" "+jsonData.party[i].species.name);
							if(i < jsonData.party.length-1){
								curmsg = curmsg.concat(" | ");
							}
						}
						curmsg.concat("\n");
						if(curmsg !=""){
							sendMessage(curmsg);
							fs.appendFile(file, curmsg, (err) => {
							if (err) {
									console.error(err);
								return;
								}
						});
						}
						curparty2 = [];
						pvs = [];
						specy = [];
						for(i = 0; i < jsonData.party.length; i++){
							curparty2.push(jsonData.party[i].species.name);
							pvs.push(jsonData.party[i].personality_value);
							specy.push(jsonData.party[i].species.name);
						}
						partyfull2 = jsonData.party;
					}


//WIP: daycare code
//same as the party code basically						
					daycarechange = 0;
					msg = "";
					curmsg = "";

					if(curdaycare.length === 0 && jsonData.daycare.length > 0){
						for(i = 0; i < jsonData.daycare.length; i++){
							curdaycare[i] = {};
							curdaycare[i].name = jsonData.daycare[i].name;
							curdaycare[i].level = jsonData.daycare[i].level;
							curdaycare[i].species = jsonData.daycare[i].species.name;
							curdaycare[i].personality = jsonData.daycare[i].personality_value;
							daycarepvs[i] = jsonData.daycare[i].personality_value;
							daycarespecy[i] = jsonData.daycare[i].species.name;

						}
						daycarefull = jsonData.daycare;
						console.log(curdaycare);
					}
					for(i = 0; i < jsonData.daycare.length; i++){
						if(!daycarepvs.includes(jsonData.daycare[i].personality_value) || !daycarespecy.includes(jsonData.daycare[i].species.name) || jsonData.daycare.length != daycarepvs.length){
							daycarechange = 1;
							console.log("what");
						}
					}
					if(daycarechange === 1){
						console.log('daycare change...');
						curmsg = '🥚 Current daycare: '
						for(i = 0; i < jsonData.daycare.length; i++){
							var curname = cleanName(jsonData.daycare[i].name);
							curmsg = curmsg.concat("__"+curname+"__, Lv. "+jsonData.daycare[i].level+" "+jsonData.daycare[i].species.name);
							if(i < jsonData.daycare.length-1){
								curmsg = curmsg.concat(" | ");
							}
						}
						if(curmsg !=""){
							sendMessage(curmsg);
							fs.appendFile(file, curmsg, (err) => {
								if (err) {
   									console.error(err);
									return;
 								}
							});
						}
						curdaycare = [];
						daycarepvs = [];
						daycarespecy = [];
						for(i = 0; i < jsonData.daycare.length; i++){
							curdaycare.push(jsonData.daycare[i].species.name);
							daycarepvs.push(jsonData.daycare[i].personality_value);
							daycarespecy.push(jsonData.daycare[i].species.name);
						}
						daycarefull = jsonData.daycare;
					}

//Notifies when we walky
					if(!(jsonData.map_name === wherearewe)){
						var testloc = jsonData.map_name;
						// if(testloc === ''){
						// 	testloc.concat('Probably a contest'); //RTHE
						// }
						curmsg = '🚶 Current location: '+testloc+'.\n';
						wherearewe = jsonData.map_name;
						if(curmsg !=""){
							sendMessage(curmsg);
							fs.appendFile(file, curmsg, (err) => {
								if (err) {
   									console.error(err);
									return;
 								}
							});
						}
						curmsg = "";
					}
//Notifies when we monie
					if(!(jsonData.money === monies)){
						curmsg = '💸 We now have '+jsonData.money+' Pok\u{00E9}yen.\n';
						if(elitefourWIP2 == 1 && jsonData.money < monies){
							elitefourWIP2 = 0;
							console.log("E4 attempt "+attempts2+" over");
						}
						monies = jsonData.money;
						if(curmsg !=""){
							sendMessage(curmsg);
							fs.appendFile(file, curmsg, (err) => {
								if (err) {
   									console.error(err);
									return;
 								}
							});
						}
						curmsg = "";
					}


//RTHE
					// if(ribbons == 0){
					// 	ribbons = jsonData.game_stats["Ribbons Earned"];
					// }
					// if(contests_won == 0){
					// 	contests_won = jsonData.game_stats["Contests Won"];
					// }
					// if(!(jsonData.game_stats["Ribbons Earned"] === ribbons)){
					// 	sendMessage('🎀 Earned a ribbon! We\'ve now earned '+jsonData.game_stats["Ribbons Earned"]+'.\n');
					// 	ribbons = jsonData.game_stats["Ribbons Earned"];
					// }
					// if(!(jsonData.game_stats["Contests Won"] === contests_won)){
					// 	sendMessage('👒 Won a contest! We\'ve now won '+jsonData.game_stats["Contests Won"]+'.\n');
					// 	contests_won = jsonData.game_stats["Contests Won"];
					// }

//Emergency badge updates for if events broke
					// if(!(jsonData.badges === badges)){
					// 	if(badges === 0){
					// 		badges = jsonData.badges;
					// 	}else{
					// 		curmsg = '🏆 Got the badge from '+jsonData.map_name+'!';
					// 		sendMessage(curmsg);
					// 		badges = jsonData.badges;
					// 	}
					// }
//Emergency caught list for if events broke
					// if(caught === []){
					// 	caught = jsonData.caught_list;
					// 	console.log(caught);
					// 	return;
					// }
					// if(!(jsonData.caught_list === caught)){
					// 	curmsg = "";
					// 	for(i = 0; i < jsonData.caught_list.length; i++){
					// 	if(!caught.includes(jsonData.caught_list[i])){
					// 		curmsg = curmsg+"🔢 New Pok\u{00E9}mon caught: "+jsonData.caught_list[i]+'.\n';
					// 	}
					// }
					// 	caught = jsonData.caught_list;
					// 	if(curmsg !=""){
					// 	sendMessage(curmsg);
					// 	}
						
					// }
//Wild battle message for if we're fighting a legendary or a shiny
					if(jsonData.battle_kind == "Wild" && jsonData.enemy_party && jsonData.enemy_party.length > 0 && legend_yes == 0 && legendaries.includes(jsonData.enemy_party[0].species.name)){
						for(i = 0; i < jsonData.enemy_party.length; i++){
							if(legendaries.includes(jsonData.enemy_party[i].species.name)){
								legend_yes = 1;
							}
						}
						msg = '😎 Battling against a wild ';
						for(i = 0; i < jsonData.enemy_party.length; i++){
							msg = msg.concat(jsonData.enemy_party[i].species.name);
							if(i < jsonData.enemy_party.length-1){
								msg = msg.concat(' and ');
							}
						}
						msg = msg.concat('.');
						
					}
					if(!jsonData.enemy_party){
						legend_yes = 0;
						//console.log("legend_yes "+legend_yes)
					}
					if(msg !=""){
						sendMessage(msg);
						fs.appendFile(file, msg, (err) => {
							if (err) {
									console.error(err);
								return;
								}
						});
					}
					msg = "";
//this is not efficient
					if(jsonData.battle_kind == "Wild" && jsonData.enemy_party && jsonData.enemy_party.length > 0 && shiny_yes == 0){
						for(i = 0; i < jsonData.enemy_party.length; i++){
							if(jsonData.enemy_party[i].shiny){
								shiny_yes = 1;
							}
						}
						if(shiny_yes){
							msg = '✨ Battling against a shiny wild ';
							for(i = 0; i < jsonData.enemy_party.length; i++){
							msg = msg.concat(jsonData.enemy_party[i].species.name);
							if(i < jsonData.enemy_party.length-1){
								msg = msg.concat(' and ');
								}
							}
							msg = msg.concat('.');
						}
							
							
					}
					if(!jsonData.enemy_party){
						shiny_yes = 0;
					}
					if(msg !=""){
						sendMessage(msg);
						fs.appendFile(file, msg, (err) => {
							if (err) {
   								console.error(err);
								return;
 							}
						});
					}
					msg = "";
					curmsg = "";
						//This is the one you're looking for. Whole updater. Every damn thing
						for(i = allpoint2; i < jsonData.events.length; i++){

							//once again learn how to like. call functions?
							time = jsonData.events[i].time;
							elapsed = (new Date(time) - new Date(runstart).getTime()) / 1000;
							diff.days    = Math.floor(elapsed / 86400);
							diff.hours   = Math.floor(elapsed / 3600 % 24);
							diff.minutes = Math.floor(elapsed / 60 % 60);
							diff.seconds = Math.floor(elapsed % 60);
							var eventname = "";

							

							if(jsonData.events[i].group == "Badge"){
								curmsg = '❗ **__Badge obtained:__ __'+jsonData.events[i].name+'__** at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Pokemon"){
								curmsg = '📟 **New Pok\u{00E9}mon obtained';
								if(jsonData.events[i].traded){
									curmsg = curmsg.concat(' in trade');
								}
								curmsg = curmsg.concat(': **__'+jsonData.events[i].name+'__ at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n');
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "First Catch"){
								curmsg = '📟 **First Catch: **__'+jsonData.events[i].name+'__ at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "First Seen"){
								curmsg = '👁️ **First Seen: **__'+jsonData.events[i].name+'__ at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "First Visit"){
								curmsg = '📍 **First Visit:** '+jsonData.events[i].name+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Trainers Undefeated"){
								//return;
								eventname = jsonData.events[i].name;
								if(eventname.includes("\u03c0\u00b5")){
									eventname = eventname.substring(2);
									eventname = "PkMn"+eventname;
								}
								curmsg = '🆚 **Battle:** '+eventname+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Blackouts"){
								curmsg = ':regional_indicator_f: **'+jsonData.events[i].name+'** at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Trainers Defeated"){
								eventname = jsonData.events[i].name;
								if(eventname.includes("\u03c0\u00b5")){
									eventname = eventname.substring(2);
									eventname = "PkMn"+eventname;
								}
								curmsg = '🥳 **Defeated trainer:** '+eventname+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s, on attempt '+jsonData.events[i].attempts2+'.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Key Items"){
								curmsg = '👜 **Item obtained:** '+jsonData.events[i].name+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Caught Pokerus"){
								curmsg = '🐛 Looks like '+jsonData.events[i].name+' caught Pok\u{00E9}rus at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else {
								//curmsg = '<@'+message.author.id+'> I can\'t read this event.\n'
								console.log('I can\'t read this event.\n');
								//msg = msg.concat(curmsg);
							}
							console.log(allpoint2);
							allpoint2++;

			//if it's getting too long send the front part and shorten it
							if(msg != ""){
								
								if(msg.length > msglen && msg.length > 0){
									sendMessage(msg.substring(0, msglen));
									fs.appendFile(file, msg.substring(0, msglen), (err) => {
										if (err) {
   											console.error(err);
											return;
 										}
									});
									msg = msg.substring(msglen, msg.length);
								}
							}
							
							
						}

						
						if(msg !=""){
							// if(query == "all.ping"){
							// 	msg = msg.concat("\n <@"+message.author.id+">");
							// }
							sendMessage(msg);
							fs.appendFile(file, msg, (err) => {
								if (err) {
   									console.error(err);
									return;
 								}
							});
						}





				} catch(err) {
						var errdate = new Date();
						console.log(err+"\n"+errdate.getTime());
					}
					//console.log('yay');
					
		 	}, updateLength);
		}
	}
