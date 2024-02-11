const { SlashCommandBuilder } = require('discord.js');
const { authorId } = require('../config.json');
const fs = require('node:fs');
const {parse, stringify, toJSON, fromJSON} = require('flatted');
const request = require('request');
const { client_id } = require('../twitch-config.json');
const { client_secret } = require('../twitch-config.json');
const axios = require('axios');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');


var game = "Intermission";
var thumbnail_url = "https://static-cdn.jtvnw.net/previews-ttv/live_user_twitchplayspokemon-1920x1080.jpg";
var runstart = 1707779884000; //red | easy way to get the start time for a different one is here: https://currentmillis.com/
const updateLength = 60 * 5 * 1000;
var msg = "";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giratina2')
		.setDescription('Uploads TPP thumbnail every 5 minutes.'),
	async execute(interaction) {
		if(interaction.user.id === authorId){
			await interaction.reply({ content: 'Starting updater :)', ephemeral: true });
		}

		function sendMessage(wordsgohere){
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

		const sendEmbed = async (embed, file) => {
			try{ 
				interaction.channel.send({ embeds: [embed], files: [file] }, (err) => {
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

			//this bit makes it know when the run time is
			var diff = {};
			var time = new Date(Date.now());
			var startdate = new Date(runstart).getTime()
			if(time < startdate){
				var elapsed = (startdate - time) / 1000;
			} else {
				var elapsed = (time - startdate) / 1000;
			}
				diff.days    = Math.floor(elapsed / 86400);
				diff.hours   = Math.floor(elapsed / 3600 % 24);
				diff.minutes = Math.floor(elapsed / 60 % 60);
				diff.seconds = Math.floor(elapsed % 60);
			var timestamp = diff.days+"d_"+diff.hours+"h_"+diff.minutes+"m_"+diff.seconds+"s";
			
			var image_path = "./screenshots2/"+game+"_"+timestamp+".png";

			var timestamp2 = timestamp.replaceAll("_", " ");
			if(time < startdate){
				timestamp2 = "-"+timestamp2;
			} 
			timestamp2 = game+", "+timestamp2+" ish";
			msg = timestamp2;

			//console.log(image_path);
			var list = {};
		 	try{
		 		const download_image = async (url, path) => {
				    const writer = fs.createWriteStream(path);

				    const streamResponse = await axios({
				        url,
				        method: 'GET',
				        responseType: 'stream'
				    });
				    streamResponse.data.pipe(writer);;

				    writer.on('finish', () => console.log("screenshot at "+timestamp));
				    writer.on('error', () => console.error("Error while dowloading image"));



				    try{ 

					const exFile = new AttachmentBuilder(image_path);
					//console.log("a");
					const exampleEmbed = {

						title: timestamp2,
						image: {
							url: "attachment://"+image_path,
						},
					};

					setTimeout(() => {
						//console.log('timeout');
						sendEmbed(exampleEmbed, exFile);
					}, 5000);
					

					
				} catch(err){
					console.log(err);
				}
				}
		 		
		 		download_image(thumbnail_url, image_path);


				
				


		 			// await getData("https://api.twitch.tv/helix/streams?user_login=twitchplayspokemon&first=1", tpp_data).then(data => {
		 			// 	tpp_data = data;
		 			// 	console.log(tpp_data);
		 			// });

				// if(msg !=""){
				// 	sendMessage(msg);
				// 	msg = "";
				// }

			} catch(err) {
				var errdate = new Date();
				console.log(err+"\n"+errdate.getTime());
			}
			
		}, updateLength);
	}
}