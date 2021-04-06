const {remote, ipcRenderer, shell} = require('electron');
const fs = require('fs');
let w = remote.getCurrentWindow();
let Sortable = require ('sortablejs');

const VERSION = '1.2'

var fCtrlIsPressed = false;

function randd(min, max) {
  return Math.floor(arguments.length > 1 ? (max - min + 1) * Math.random() + min : (min + 1) * Math.random());
};
function shuffle(o){
    for(var j, x, k = o.length; k; j = Math.floor(Math.random() * k), x = o[--k], o[k] = o[j], o[j] = x);
    return o;
};
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

Vue.component('modalWin', {
	props: {
		title: {
			type: String,
			default: ""
		},
		content: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {
			
		};
	},
	methods: {
		close: function(){
			this.$emit('close');
		}
	},
	computed: {
		
	},

	template: `<div class="mod_win_wrapper" style='background: rgba(0, 0, 0, 0.7);' @click="close" @scroll.stop>
	<div class="mod_win">
		<span class="bCloseInfoWin" @click="close">×</span>
		<div class="mod_win_content" v-html="content">
		</div>	
	</div>
</div>`
});

Vue.component('sounder', {
	props: {
		id: {
			type: String,
			default: ""
		},	
		title: {
			type: String,
			default: ""
		},
		active: {
			type: Boolean,
			default: false
		},
		ico: {
			type: String,
			default: ""
		},		
		items: {
			type: Array,
			default: []
		},
		show_title: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		audio_id: function(){
			return "a_"+this.id;
		},
		src: function() {
			return (this.items && this.items.length)? this.items[randd(0, this.items.length-1)].src : "";
		},
		full_ico: function(){
			return "fas fa-"+this.ico;
		}
	},
	methods: {		
		getRandomSound: function(){
			return (this.items && this.items.length>0)?this.items[randd(0, this.items.length-1)].src : "";
		},
		itemclick: function(oEvent){
			//this.$emit('iclick', oEvent);
			let sSound = this.getRandomSound();
			console.log();
			if(sSound){
				let player = document.querySelector("#"+this.audio_id);
				player.src = sSound;
				player.play();
			}
			this.$emit('press', oEvent);
		}
	},
	mounted: function(){
		
	},
	template: `<div :id="id" :class="{sounder: true, active: active}" :data-text="title" :title="title" @click="itemclick">
	<div class='core'>
		<span v-show="show_title">{{title}}</span>
		<i :class="full_ico"></i>
		<audio :id="audio_id" :src="src" preload="auto"></audio>
	</div>
</div>`
});

Vue.component('sounditem', {
	props: {
		src: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		
	},
	methods: {		
		remove: function(oEvent){
			this.$emit('remove', oEvent);
		}
	},
	mounted: function(){
		
	},
	template: `<div  class="sounditem">	
			<input  :value="src"  :title="src">
			<button @click="remove">x</button>
		
</div>`
});

Vue.component('titem', {
	props: {
		title: {
			type: String,
			default: ""
		},
		type: {
			type: String,
			default: ""
		},
		active: {
			type: Boolean,
			default: false
		},
		ico: {
			ico: String,
			default: ""
		},
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		style_class: function(){
			let aClass = ["toolbar_item"];
			if(this.type=='switch' && this.active==true) {
				aClass.push('active');
			}
			return aClass.join(" ");
		}
	},
	methods: {		
		press: function(oEvent){
			this.$emit('press', oEvent);
		}
	},
	mounted: function(){
		
	},
	template: `<button  :class="style_class" :title="title" @click="press">	
		<i :class="ico"></i>
</button>`
});

Vue.component('soundlist', {
	props: {
		items: {
			type: Array,
			default: function(){
				return [];
			}
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		
	},
	methods: {		
		// click: function(){
			// this.$emit('delete', oEvent);
		// }
		remove: function(oEvent){
			this.$emit('delete', oEvent);
		}
	},
	mounted: function(){
		
	},
	template: `<div  class="soundlist">	
	<div  class="sounditem" v-for="item in items">	
			<input  v-model="item.src">
			<button @click="remove">x</button>
		
	</div>		
</div>`
});

Vue.component('sconf', {
	props: {
		id: {
			type: String,
			default: ""
		},	
		title: {
			type: String,
			default: ""
		},
		name: {
			type: String,
			default: ""
		},
		ico: {
			type: String,
			default: ""
		},		
		items: {
			type: Array,
			default: []
		},		
		iconlist: {
			type: Array,
			default: []
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		// audio_id: function(){
			// return "a_"+this.id;
		// },
		// src: function() {
			// return this.items[randd(0, this.items.length-1)];
		// }
		aIcons: function(){
			let sIco = this.ico;
			return this.iconlist.filter(el=>el.indexOf(sIco)>-1);
		},
		full_ico: function(){
			return "fas fa-"+this.ico;
		}
	},
	methods: {		
		// getRandomSound: function(){
			// return this.items[randd(0, this.items.length-1)];
		// },
		// itemclick: function(oEvent){
			// this.$emit('iclick', oEvent);
			// let sSound = this.getRandomSound();
			// console.log();
			// let player = document.querySelector("#"+this.audio_id);
			// player.src = sSound;
			// player.play();
		// }
		ico_changed: function(oEvent){
			let sIco = oEvent.target.value;
			this.$emit('ico_changed', sIco);
		},
		title_changed: function(oEvent){
			let sTitle = oEvent.target.value;
			this.$emit('title_changed', sTitle);
		},
		remove: function(oEvent){
			this.$emit('remove', oEvent);
		}
	},
	mounted: function(){
		
	},
	template: `<div  class="sconf" :data-text="title" :data-id="id">
		<div class='header'><div class='handler' title='Перетащить'></div><button class='remove' title='Удалить' @click='remove'>x</button></div>
		<input :value="title" placeholder="Заголовок" title='Заголовок' @change="title_changed">
		<div class='ico_input'>
			<input :value="ico" placeholder="Иконка"  title='Иконка' @change="ico_changed">
			<select @change="ico_changed">
				<option v-for="icon in this.aIcons" :value="icon">{{icon}}</option>
			</select>
		<i :class="full_ico"></i></div>
		<slot></slot>		
</div>`
});

Vue.component('playList', {
	props: {
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		img: {
			type: String,
			default: ""
		},
		color: {
			type: String,
			default: ""
		},
		group: {
			type: String,
			default: ""
		},
		loop: {
			type: Boolean,
			default: false
		},
		compact: {
			type: Boolean,
			default: false
		},
		plaing: {
			type: Boolean,
			default: false
		},
		edit: {
			type: Boolean,
			default: false
		},
		group_opened: {
			type: Boolean,
			default: false
		},
		volume: {
			type: Number,
			default: 60
		},
		tindex: {
			type: Number,
			default: 0
		},
		list: {
			type: Array
		},
		groups: {
			type: Array
		}
	},
	data: function(){
		return {
			duration: 0,
			currentTime: 0
		};
	},
	computed: {
		_id: function(){
			if(this.id != undefined) {
				return `pl_${this.id}`;
			} else {
				return `pl_${guidGenerator()}`;
			}			
		},
		audio_id: function(){
			return `a_${this._id}`;
		},
		progress_id: function(){
			return `pr_${this._id}`;
		},
		cycle_id: function(){
			return `cycle_${this._id}`;
		},
		compact_id: function(){
			return `compact_${this._id}`;
		},
		adder_id: function(){
			return `add_${this._id}`;
		},
		groupper_id: function(){
			return `gr_${this._id}`;
		},
		
		audio_src: function(){
			//debugger;
			return (this.list && this.list.length>0 && this.tindex>-1)?this.list[this.tindex].path : "";
		},
		audio_looped: function(){
			return this.loop;
		},
		_volume: function(){
			let nVolume = this.volume;
			if(nVolume<0) {
				nVolume=0;
			}			
			if(nVolume>100) {
				nVolume=100;
			}		
			let oAudio = this.$el? this.$el.querySelector(`#a_${this._id}`) : false;
			if(oAudio) {
				oAudio.volume = nVolume/100;
			}
			return nVolume;			
		},
		
		timeline_title: function(){
			return `${this._convert_time(this.currentTime)}/${this._convert_time(this.duration)}`;
		},
		
		_color: function(){
			//console.log('group', this.group );
			//console.dir(this.groups)
			if(this.group && this.groups) {
				let oGroup = this.groups.find(el=>el.id == this.group);
				//console.dir(oGroup);
				return oGroup? oGroup.color : "";
			} 
			return "";
		},
		
		_style: function(){
			let o = {};
			if(this._color) {
				o['border-top-color'] = this._color;
			}
			return o;
		},
		
		_plaing: function(){
			if(!this.plaing) {
				let oAudio = this.$el? this.$el.querySelector(`#a_${this._id}`): false;
				if(oAudio) {
					oAudio.pause();
				}
			}
			return this.plaing;
		}
	},
	methods: {		
		/*remove: function(oEvent){
			this.$emit('remove', oEvent);
		},*/
		
		_convert_time_numbers(nNumber){
			nNumber = ~~nNumber;
			return (nNumber<10)? `0${nNumber}` : nNumber;
		},
		_convert_time: function(nSeconds){
			if(nSeconds>60*60) {
				return `${this._convert_time_numbers(nSeconds/(60*60))}:${this._convert_time_numbers(nSeconds/60)}:${this._convert_time_numbers(nSeconds%60)}`;
			}
			if(nSeconds>60) {
				return `${this._convert_time_numbers(nSeconds/60)}:${this._convert_time_numbers(nSeconds%60)}`;
			}
			
			return `00:${this._convert_time_numbers(nSeconds)}`;
		},
		onPlay: function(oEvent){
			if(!this.list || !this.list.length) {
				return false;
			}
			this.$emit('play', this.id);
			
			let oAudio = this.$el.querySelector(`#a_${this._id}`);
			if(oAudio) {
				/*if(!oAudio.src) {
					oAudio.src = this.list[this.tindexIndex].path;
				}*/
				try{
					oAudio.play();
				} catch (error){
					console.dir(error);
				}
			}
		},		
		onPause: function(oEvent){
			this.$emit('pause', this.id);
			let oAudio = this.$el.querySelector(`#a_${this._id}`);
			if(oAudio) {
				oAudio.pause();
			}
		},
		onRandom: function(oEvent){
			this.$emit('random', this.id);
		},
		onNext: function(oEvent){
			this.$emit('next', this.id);
		},
		onVolumed: function(oEvent){
			this.$emit('volumed', this.id, oEvent);
		},
		onLooped: function(oEvent){
			this.$emit('looped', this.id, oEvent);
		},
		onCompacted: function(oEvent){
			this.$emit('compacted', this.id, oEvent);
		},
		
		startTrack: function(nTrackIndex){
			this.$emit('switch', this.id, nTrackIndex);
		},
		removeTrack: function(nTrackIndex){
			this.$emit('remove_track', this.id, nTrackIndex);
		},
		addTracks: function(oEvent){
			this.$emit('add_track', oEvent);
		},
		
		test: function(){
			debugger;			
		},
		
		editTitle: function(){
			this.$emit('start_edit_title', this.id);
			let oInput = this.$el.querySelector('.title_input');
			if(oInput) {
				setTimeout(function(){oInput.focus()}, 30);
			}
			
		},
		onTitleEdited: function(oEvent){
			this.$emit('finish_edit_title', this.id, oEvent.target.value);
		},
		
		onGroup: function(){
			this.$emit('group_configing', this.id);
		},
		setGroup: function(sGroupId){
			this.$emit('set_group', this.id, sGroupId);
		},
		removeGroup: function(sGroupId){
			this.$emit('remove_group', sGroupId);
		},
		
		group_title_edited: function(sColor, sGroupId){
			this.$emit('group_title_edited', sGroupId, sColor);
		},
		group_color_edited: function(sColor, sGroupId){
			this.$emit('group_color_edited', sGroupId, sColor);
		},
		
		addGroup: function(){
			this.$emit('add_group');
		},
		onRemove: function(){
			this.$emit('remove', this.id);
		},
		_timelineUpdate: function(){
			let oAudio = this.$el.querySelector(`#a_${this._id}`);
			if(oAudio) {
				this.duration = oAudio.duration;
				this.currentTime = oAudio.currentTime;
				let playPercent = 100 * (this.currentTime / this.duration);
				let oProgress = this.$el.querySelector(`#pr_${this._id}`);
				if(oProgress) {
					oProgress.style.width = `${~~playPercent}%`;
				}		
			}
		}
		
	},
	mounted: function(){
		//debugger;
		console.dir(this.$el);
		setTimeout(function(){
			let oAudio = this.$el?this.$el.querySelector(`#a_${this._id}`) : null;
			if(oAudio) {
				 oAudio.onended = function(){
						//debugger;
						this.onNext();
				}.bind(this);
				
				oAudio.addEventListener('loadeddata', function() {
					//debugger;
					if(oAudio.readyState >= 2 && this.plaing) {
						oAudio.play();
					}
				}.bind(this));
				
				oAudio.addEventListener("timeupdate", this._timelineUpdate, false);					 
			}
		}.bind(this), 100);
		
		
	},
	template: `<div class="player_form" :id="_id" :style="_style">
		<audio :id="audio_id" :src="audio_src" :loop="audio_looped"></audio>
		<!--<div class="pf_lt">1 Q A Z</div>-->
		<div class="pf_sett">
			<div class="btns">
				<input type="checkbox" :checked="loop" :id="cycle_id" class="btn cycle" @change="onLooped">
				<label :for="cycle_id" title='Зациклить 1 трек'><i class="fa fa-retweet"></i></label>
				<button class="btn mix" @click="onRandom" title='Перемешать треки'><i class="fa fa-random"></i></button>
				<input type="checkbox" :checked="compact" :id="compact_id" class="btn hide" @change="onCompacted">
				<label :for="compact_id" title='Скрыть/показать треки'><i class="fa fa-eye-slash"></i></label>
			</div>
			<div class="vol">
				<input type="range" orient="vertical" class="volume" min="0" max="100" :value="_volume" @change="onVolumed">
				<div class="vol_num">{{_volume}}</div>
			</div>
		</div>
		<div class="pf_play" align="center">
			<button v-show="!this._plaing" class="pf_play_bt" @click="onPlay"> <i class="fa fa-play"></i> </button> 
			<button v-show="this._plaing" class="pf_play_bt" @click="onPause"> <i class="fa fa-pause"></i> </button> 
			<button class="pf_next_bt" @click="onNext"> <i class="fa fa-play"></i><i class="fa fa-play"></i> </button>
		</div>
		<div class="pf_name" >
			<div v-show='!edit' @dblclick="editTitle" class='title'>{{title}}</div>
			<div v-show='edit'><input :value="title" @change="onTitleEdited" v-on:blur="onTitleEdited" class='cinput title_input'></div>
			<div class="pf_trek_timeline" :title="timeline_title"><div class="pf_trek_playhead" :id='progress_id'></div></div>
		</div>
		<!--<div class="pf_img" style="display: block;">изображение</div>-->
		<div class="pf_list" style="display: block;" v-show="!compact && !group_opened">
			<pl-track 
				v-for="(track, i) in this.list"				
				:key="i"
				:src="track.path"
				:class="{active: i==tindex}"
				v-on:dblclick.native="startTrack(i)"
				@remove="removeTrack(i)"
			/>
		</div>
		<div class="pf_groups" style="display: block;" v-show="group_opened">
			<pl-group 
				v-for="(gr, i) in this.groups"				
				:key="i"
				:title="gr.title"
				:color="gr.color"
				:edit="gr.edit"
				:class="{active: gr.id==group}"
				@select="setGroup(gr.id)"
				@remove="removeGroup(gr.id)"
				
				@title_edited="group_title_edited($event, gr.id)"
				@color_edited="group_color_edited($event, gr.id)"
			/>
			<button class='addButton' title='Добавить группу' @click="addGroup"><i class="fa fa-plus"></i></button>
		</div>
		<div class="pf_mng">
			<input 
				:id="adder_id" 
				class="new_track" 
				type="file" 
				@change="addTracks" 
				accept="audio/*"
				multiple/>
			<label 
				:for="adder_id" 
				class='ico_button'
				title='Добавить треки'>
					<i class="fa fa-plus"></i>
			</label>
						
			<button class='ico_button' title='Настроить группу' @click="onGroup" :class="{active: group_opened}"><i class="fa fa-object-ungroup"></i></button>
			<div class='spacer'></div>
			<button class='ico_button' title='Удалить поток' @click="onRemove"><i class="fa fa-trash-alt"></i></button>
		</div>
	</div>`
});

Vue.component('pl-track', {
	props: {
		src: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		title: function(){
			if(this.src && this.src.length) {
				return this.src.split("/").pop();
			} 
			return "";
		}
	},
	methods: {		
		remove: function(oEvent){
			this.$emit('remove', oEvent);
		}
	},
	mounted: function(){
		
	},
	template: `<div class="tr_line">
		<div class='content'>
			<div class="name" :title="src">{{title}}</div>
		</div>	
		<button class='remove' @click="remove" title='Удалить из потока'><i class="fa fa-trash-alt"></i></button>
	</div>`
});

Vue.component('sound_item', {
	props: {
		src: {
			type: String,
			default: ""
		},
		number: {
			type: Number,
			default: 1
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		title: function(){
			if(this.src && this.src.length) {
				return this.src.split("/").pop();
			} 
			return "title";
		}
	},
	methods: {		
		remove: function(oEvent){
			this.$emit('remove', oEvent);
		},
		onNumberEdited: function(oEvent){
			this.$emit('set_number', oEvent.target.value);
		}
	},
	mounted: function(){
		
	},
	template: `<div class="sound_item">
		<div class='content'>
			<input class='cinput' :value="number" @change="onNumberEdited" type='number' min="0">
			<div class="name" :title="src">{{title}}</div>
		</div>	
		<button class='remove' @click="remove" title='Удалить'><i class="fa fa-trash-alt"></i></button>
	</div>`

});

Vue.component('pl-group', {
	props: {
		id: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
		color: {
			type: String,
			default: ""
		},
		edit: {
			type: Boolean,
			default: false
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
	/*	title: function(){
			if(this.src && this.src.length) {
				return this.src.split("/").pop();
			} 
			return "";
		}*/
		
		_color: function(){
			//debugger;
			
			return this.color;
		}
	},
	methods: {		
		remove: function(oEvent){
			this.$emit('remove', oEvent);
		},
		onSelect: function(oEvent){
			this.$emit('select', oEvent);
		},
		onTitleEdited: function(oEvent){
			this.$emit('title_edited', oEvent.target.value);			
		},
		onColorEdited: function(oEvent){
			this.$emit('color_edited', oEvent.target.value);			
		}
	},
	mounted: function(){
		
	},
	template: `<div class="pl_group">
		<div class='content'>
			<input type="color" :value="_color" @change="onColorEdited">
			<div v-show='!edit' class="name" :title="title"  @click="onSelect">{{title}}</div>
			<input v-show='edit' :value="title" @change="onTitleEdited" v-on:blur="onTitleEdited" class='cinput'>
		</div>	
		<button class='remove' @click="remove" title='Удалить группу'><i class="fa fa-trash-alt"></i></button>
	</div>`
});

Vue.component('icon_selector', {
	props: {
		id: {
			type: String,
			default: ""
		},
		value: {
			type: String,
			default: ""
		},
		list: {
			type: Array,
			default: []
		}
	},
	data: function(){
		return {
		
		};
	},
	computed: {
	
	},
	methods: {		
		remove: function(oEvent){
			this.$emit('remove', oEvent);
		},
		onSelect: function(oEvent){
			this.$emit('select', oEvent);
		},	
		onFilter: function(oEvent){
			let sValue = oEvent.target.value;
			this.$emit('filter', sValue);
		}
	},
	mounted: function(){
		
	},
	template: `<div class="ico_group">
		<div>
			<input class='cinput' @change="onFilter">
		</div>
		<div class='content'>
			<icon-item
				v-for="icon in list"
				:key="icon"
				:active='icon == value'
				:ico='icon'
				@click="onSelect"
				>
				<i :class="{fa: true, }"></i>
			</icon-item>
		</div>	
	</div>`

});

Vue.component('icon_item', {
	props: {		
		ico: {
			type: String,
			default: ""
		},		
		active: {
			type: Boolean,
			default: false
		},
	},
	data: function(){
		return {
		
		};
	},
	computed: {
		_class: function(){
			return `fa fa-${this.ico}`;			
		}
	},
	methods: {		
		onSounderIcoSelect: function(){
			this.$emit('select', this.ico);
		}
	},
	mounted: function(){
		
	},
	template: `
			<button			
				:class='{ico_item: true, active: active}'	
				@click="onSounderIcoSelect"			
				>
				<i :class="_class"></i>
			</button>
		`
	
});

  var app = new Vue({
    el: '#app',
    data: {
			aSoundCollections: [
				{
					id: "0",
					title: "0",
					ico: "",
					active :false,
					items: [
						
					]
				},
				{
					id: "1",
					title: "2",
					ico: "pause",
					active: false,
					items: [
						
					]
				}
			],
			
			aPlayLists: [
				{
					id: "1",
					order: 0,
					title: "Плейлист 1",
					color: "",
					group: "",
					img: "",
					config: {
						loop: false,
						compact: false,
						plaing: false,
						edit: false,
						group_opened: false
					},
					volume: 50,
					trackIndex: 0,
					list: [
					/*	{
							path: "http://youknowwho.ru/scripts/deviantplayer/music/nature/drops.mp3"
						},
						{
							path: "http://youknowwho.ru/scripts/deviantplayer/music/nature/river.mp3"
						},
						{
							path: "http://youknowwho.ru/scripts/deviantplayer/music/nature/forest.mp3"
						},*/
					]
				}
			],
			
			aPlayListGroups: [
			/*	{
					id: "",
					title: "",
					color: "#ff0000",
					edit: false
				}*/
			],
						
			aIconNames: [
				"ad","address-book","address-card","adjust","air-freshener","align-center","align-justify","align-left","align-right","allergies","ambulance","american-sign-language-interpreting","anchor","angle-double-down","angle-double-left","angle-double-right","angle-double-up","angle-down","angle-left","angle-right","angle-up","angry","ankh","apple-alt","archive","archway","arrow-alt-circle-down","arrow-alt-circle-left","arrow-alt-circle-right","arrow-alt-circle-up","arrow-circle-down","arrow-circle-left","arrow-circle-right","arrow-circle-up","arrow-down","arrow-left","arrow-right","arrow-up","arrows-alt","arrows-alt-h","arrows-alt-v","assistive-listening-systems","asterisk","at","atlas","atom","audio-description","award","baby","baby-carriage","backspace","backward","bacon","bahai","balance-scale","balance-scale-left","balance-scale-right","ban","band-aid","barcode","bars","baseball-ball","basketball-ball","bath","battery-empty","battery-full","battery-half","battery-quarter","battery-three-quarters","bed","beer","bell","bell-slash","bezier-curve","bible","bicycle","biking","binoculars","biohazard","birthday-cake","blender","blender-phone","blind","blog","bold","bolt","bomb","bone","bong","book","book-dead","book-medical","book-open","book-reader","bookmark","border-all","border-none","border-style","bowling-ball","box","box-open","boxes","braille","brain","bread-slice","briefcase","briefcase-medical","broadcast-tower","broom","brush","bug","building","bullhorn","bullseye","burn","bus","bus-alt","business-time","calculator","calendar","calendar-alt","calendar-check","calendar-day","calendar-minus","calendar-plus","calendar-times","calendar-week","camera","camera-retro","campground","candy-cane","cannabis","capsules","car","car-alt","car-battery","car-crash","car-side","caravan","caret-down","caret-left","caret-right","caret-square-down","caret-square-left","caret-square-right","caret-square-up","caret-up","carrot","cart-arrow-down","cart-plus","cash-register","cat","certificate","chair","chalkboard","chalkboard-teacher","charging-station","chart-area","chart-bar","chart-line","chart-pie","check","check-circle","check-double","check-square","cheese","chess","chess-bishop","chess-board","chess-king","chess-knight","chess-pawn","chess-queen","chess-rook","chevron-circle-down","chevron-circle-left","chevron-circle-right","chevron-circle-up","chevron-down","chevron-left","chevron-right","chevron-up","child","church","circle","circle-notch","city","clinic-medical","clipboard","clipboard-check","clipboard-list","clock","clone","closed-captioning","cloud","cloud-download-alt","cloud-meatball","cloud-moon","cloud-moon-rain","cloud-rain","cloud-showers-heavy","cloud-sun","cloud-sun-rain","cloud-upload-alt","cocktail","code","code-branch","coffee","cog","cogs","coins","columns","comment","comment-alt","comment-dollar","comment-dots","comment-medical","comment-slash","comments","comments-dollar","compact-disc","compass","compress","compress-alt","compress-arrows-alt","concierge-bell","cookie","cookie-bite","copy","copyright","couch","credit-card","crop","crop-alt","cross","crosshairs","crow","crown","crutch","cube","cubes","cut","database","deaf","democrat","desktop","dharmachakra","diagnoses","dice","dice-d20","dice-d6","dice-five","dice-four","dice-one","dice-six","dice-three","dice-two","digital-tachograph","directions","divide","dizzy","dna","dog","dollar-sign","dolly","dolly-flatbed","donate","door-closed","door-open","dot-circle","dove","download","drafting-compass","dragon","draw-polygon","drum","drum-steelpan","drumstick-bite","dumbbell","dumpster","dumpster-fire","dungeon","edit","egg","eject","ellipsis-h","ellipsis-v","envelope","envelope-open","envelope-open-text","envelope-square","equals","eraser","ethernet","euro-sign","exchange-alt","exclamation","exclamation-circle","exclamation-triangle","expand","expand-alt","expand-arrows-alt","external-link-alt","external-link-square-alt","eye","eye-dropper","eye-slash","fan","fast-backward","fast-forward","fax","feather","feather-alt","female","fighter-jet","file","file-alt","file-archive","file-audio","file-code","file-contract","file-csv","file-download","file-excel","file-export","file-image","file-import","file-invoice","file-invoice-dollar","file-medical","file-medical-alt","file-pdf","file-powerpoint","file-prescription","file-signature","file-upload","file-video","file-word","fill","fill-drip","film","filter","fingerprint","fire","fire-alt","fire-extinguisher","first-aid","fish","fist-raised","flag","flag-checkered","flag-usa","flask","flushed","folder","folder-minus","folder-open","folder-plus","font","football-ball","forward","frog","frown","frown-open","funnel-dollar","futbol","gamepad","gas-pump","gavel","gem","genderless","ghost","gift","gifts","glass-cheers","glass-martini","glass-martini-alt","glass-whiskey","glasses","globe","globe-africa","globe-americas","globe-asia","globe-europe","golf-ball","gopuram","graduation-cap","greater-than","greater-than-equal","grimace","grin","grin-alt","grin-beam","grin-beam-sweat","grin-hearts","grin-squint","grin-squint-tears","grin-stars","grin-tears","grin-tongue","grin-tongue-squint","grin-tongue-wink","grin-wink","grip-horizontal","grip-lines","grip-lines-vertical","grip-vertical","guitar","h-square","hamburger","hammer","hamsa","hand-holding","hand-holding-heart","hand-holding-usd","hand-lizard","hand-middle-finger","hand-paper","hand-peace","hand-point-down","hand-point-left","hand-point-right","hand-point-up","hand-pointer","hand-rock","hand-scissors","hand-spock","hands","hands-helping","handshake","hanukiah","hard-hat","hashtag","hat-cowboy","hat-cowboy-side","hat-wizard","hdd","heading","headphones","headphones-alt","headset","heart","heart-broken","heartbeat","helicopter","highlighter","hiking","hippo","history","hockey-puck","holly-berry","home","horse","horse-head","hospital","hospital-alt","hospital-symbol","hot-tub","hotdog","hotel","hourglass","hourglass-end","hourglass-half","hourglass-start","house-damage","hryvnia","i-cursor","ice-cream","icicles","icons","id-badge","id-card","id-card-alt","igloo","image","images","inbox","indent","industry","infinity","info","info-circle","italic","jedi","joint","journal-whills","kaaba","key","keyboard","khanda","kiss","kiss-beam","kiss-wink-heart","kiwi-bird","landmark","language","laptop","laptop-code","laptop-medical","laugh","laugh-beam","laugh-squint","laugh-wink","layer-group","leaf","lemon","less-than","less-than-equal","level-down-alt","level-up-alt","life-ring","lightbulb","link","lira-sign","list","list-alt","list-ol","list-ul","location-arrow","lock","lock-open","long-arrow-alt-down","long-arrow-alt-left","long-arrow-alt-right","long-arrow-alt-up","low-vision","luggage-cart","magic","magnet","mail-bulk","male","map","map-marked","map-marked-alt","map-marker","map-marker-alt","map-pin","map-signs","marker","mars","mars-double","mars-stroke","mars-stroke-h","mars-stroke-v","mask","medal","medkit","meh","meh-blank","meh-rolling-eyes","memory","menorah","mercury","meteor","microchip","microphone","microphone-alt","microphone-alt-slash","microphone-slash","microscope","minus","minus-circle","minus-square","mitten","mobile","mobile-alt","money-bill","money-bill-alt","money-bill-wave","money-bill-wave-alt","money-check","money-check-alt","monument","moon","mortar-pestle","mosque","motorcycle","mountain","mouse","mouse-pointer","mug-hot","music","network-wired","neuter","newspaper","not-equal","notes-medical","object-group","object-ungroup","oil-can","om","otter","outdent","pager","paint-brush","paint-roller","palette","pallet","paper-plane","paperclip","parachute-box","paragraph","parking","passport","pastafarianism","paste","pause","pause-circle","paw","peace","pen","pen-alt","pen-fancy","pen-nib","pen-square","pencil-alt","pencil-ruler","people-carry","pepper-hot","percent","percentage","person-booth","phone","phone-alt","phone-slash","phone-square","phone-square-alt","phone-volume","photo-video","piggy-bank","pills","pizza-slice","place-of-worship","plane","plane-arrival","plane-departure","play","play-circle","plug","plus","plus-circle","plus-square","podcast","poll","poll-h","poo","poo-storm","poop","portrait","pound-sign","power-off","pray","praying-hands","prescription","prescription-bottle","prescription-bottle-alt","print","procedures","project-diagram","puzzle-piece","qrcode","question","question-circle","quidditch","quote-left","quote-right","quran","radiation","radiation-alt","rainbow","random","receipt","record-vinyl","recycle","redo","redo-alt","registered","remove-format","reply","reply-all","republican","restroom","retweet","ribbon","ring","road","robot","rocket","route","rss","rss-square","ruble-sign","ruler","ruler-combined","ruler-horizontal","ruler-vertical","running","rupee-sign","sad-cry","sad-tear","satellite","satellite-dish","save","school","screwdriver","scroll","sd-card","search","search-dollar","search-location","search-minus","search-plus","seedling","server","shapes","share","share-alt","share-alt-square","share-square","shekel-sign","shield-alt","ship","shipping-fast","shoe-prints","shopping-bag","shopping-basket","shopping-cart","shower","shuttle-van","sign","sign-in-alt","sign-language","sign-out-alt","signal","signature","sim-card","sitemap","skating","skiing","skiing-nordic","skull","skull-crossbones","slash","sleigh","sliders-h","smile","smile-beam","smile-wink","smog","smoking","smoking-ban","sms","snowboarding","snowflake","snowman","snowplow","socks","solar-panel","sort","sort-alpha-down","sort-alpha-down-alt","sort-alpha-up","sort-alpha-up-alt","sort-amount-down","sort-amount-down-alt","sort-amount-up","sort-amount-up-alt","sort-down","sort-numeric-down","sort-numeric-down-alt","sort-numeric-up","sort-numeric-up-alt","sort-up","spa","space-shuttle","spell-check","spider","spinner","splotch","spray-can","square","square-full","square-root-alt","stamp","star","star-and-crescent","star-half","star-half-alt","star-of-david","star-of-life","step-backward","step-forward","stethoscope","sticky-note","stop","stop-circle","stopwatch","store","store-alt","stream","street-view","strikethrough","stroopwafel","subscript","subway","suitcase","suitcase-rolling","sun","superscript","surprise","swatchbook","swimmer","swimming-pool","synagogue","sync","sync-alt","syringe","table","table-tennis","tablet","tablet-alt","tablets","tachometer-alt","tag","tags","tape","tasks","taxi","teeth","teeth-open","temperature-high","temperature-low","tenge","terminal","text-height","text-width","th","th-large","th-list","theater-masks","thermometer","thermometer-empty","thermometer-full","thermometer-half","thermometer-quarter","thermometer-three-quarters","thumbs-down","thumbs-up","thumbtack","ticket-alt","times","times-circle","tint","tint-slash","tired","toggle-off","toggle-on","toilet","toilet-paper","toolbox","tools","tooth","torah","torii-gate","tractor","trademark","traffic-light","trailer","train","tram","transgender","transgender-alt","trash","trash-alt","trash-restore","trash-restore-alt","tree","trophy","truck","truck-loading","truck-monster","truck-moving","truck-pickup","tshirt","tty","tv","umbrella","umbrella-beach","underline","undo","undo-alt","universal-access","university","unlink","unlock","unlock-alt","upload","user","user-alt","user-alt-slash","user-astronaut","user-check","user-circle","user-clock","user-cog","user-edit","user-friends","user-graduate","user-injured","user-lock","user-md","user-minus","user-ninja","user-nurse","user-plus","user-secret","user-shield","user-slash","user-tag","user-tie","user-times","users","users-cog","utensil-spoon","utensils","vector-square","venus","venus-double","venus-mars","vial","vials","video","video-slash","vihara","voicemail","volleyball-ball","volume-down","volume-mute","volume-off","volume-up","vote-yea","vr-cardboard","walking","wallet","warehouse","water","wave-square","weight","weight-hanging","wheelchair","wifi","wind","window-close","window-maximize","window-minimize","window-restore","wine-bottle","wine-glass","wine-glass-alt","won-sign","wrench","x-ray","yen-sign","yin-yang"
			],
			//page: "PlayLists",
			pages: {
				Config: false,				
			},
			sounder: {
				edit: false,
				editor: {
					title: "",
					ico: "",
					items: [
						{
							src: "",
							number: 0
						},
						{
							src: "",
							number: 0
						},
						{
							src: "",
							number: 0
						},
						{
							src: "",
							number: 0
						}
					],
					id: "",
					ico_filter: ""
				}
			},
			//bEditMode: false,
			//bConfigMode: false,
			bReady: false,
			db: {
				connection: null,
				DB: null,
				name: 'DP',
				version: 2
			},
			sAppView: "default", // square, panel
			oWinSizes: {
				"default": {
					w: 800,
					h: 600
				},				
				"square": {
					w: 300,
					h: 400
				},			
				"panel": {
					w: 100,
					h: 300
				}
			},
			oWin: {
				pos: {
					x: 0,
					y: 0
				},
				bForeground: false
			},
			oHotkeys: {
				"SHIFT": false,
				"CTRL": false,
				"ALT": false,
			},
			aLocalDataDebug: [],
			bModalWinShow: false,
			sModalWinCont: "",
			oMeta: {
				bNewVersionAvailable: false,
				sCurVersion: VERSION,
				sLatestVersion: "",
				aStarts: [
					"Вроде как",
					"Смотри-ка,",
					"Гляди,",
					"Ну надо же,"
				],
				aEnds: [
					"доступна",
					"есть",
					"появилась",
					"найдена"
				]
			}
    },

		computed: {
			aIconsFiltered: function(){
				return this.sounder.editor.ico_filter? this.aIconNames.filter(el=>el.includes(this.sounder.editor.ico_filter)) : this.aIconNames;
			},
			aToolbarItems: function(){
				return [
				/*	{
						type: "switch",
						tumblr: "bEditMode",
						id: "edit",
						title: "Редактировать звуковые панели",
						ico: "fas fa-edit",
						action: "toggleEditMode",
						active: this.bEditMode
					},*/
					{
						type: "switch",
						tumblr: "bConfigMode",
						id: "config",
						title: "Настройки",
						ico: "fas fa-cog",
						action: "toggleConfigMode",
						active: this.pages.Config
					},
					/*{
						type: "switch",
						id: "view_default",
						title: "Обычный вид",
						ico: "fas fa-th-large",
						action: "toDefaultView",
						active: this.sAppView=='default'
					},
					{
						type: "switch",
						id: "view_square",
						title: "Квадратный вид",
						ico: "fas fa-th",
						action: "toSquareView",
						active: this.sAppView=='square'
					},
					{
						type: "switch",
						id: "view_panel",
						title: "Компактный вид",
						ico: "fas fa-ellipsis-v",
						action: "toPanelView",
						active: this.sAppView=='panel'
					},
					{
						type: "switch",
						id: "foreground",
						title: "Всегда на первом плане",
						ico: "fas fa-thumbtack",
						action: "setForeground",
						active: this.oWin.bForeground
					}*/
				]
			},
			
			sNewVersionText: function(){
				let aStarts = this.oMeta.aStarts;
				let aEnds = this.oMeta.aEnds;
				let sStart = aStarts[randd(0, aStarts.length-1)];
				let sEnd = aEnds[randd(0, aEnds.length-1)];
				
				return `${sStart} ${sEnd}`;
			},
			sNewVersionLink: function(){
				return `https://github.com/Etignis/dPlayer/releases/tag/${this.oMeta.sLatestVersion}`;
			},
			
			page: function(){
				for (let key in this.pages) {
					if(this.pages[key]) {
						return key;
					}
				}
				
				return "PlayLists";
			},
			
			sounder_selected: function(){
				return this.aSoundCollections.filter(el=>el.active).length>0;
			},
			sounder_editor_ico: function(){
				return this.sounder.editor.ico? `fa fa-${this.sounder.editor.ico}` : "";
			},
			
			
		},
		mounted: function() {			
			this.start();
			//this._initSortable();
			//this._setHotkeys();
			//this._checkUpdates();
			

			w.setSize(this.oWinSizes[this.sAppView].w,this.oWinSizes[this.sAppView].h);
			if(this.oWin.pos.x !=0 || this.oWin.pos.y != 0){
				w.setPosition(this.oWin.pos.x, this.oWin.pos.y);
			}
			
			w.setAlwaysOnTop(this.oWin.bForeground);

			w.on('resize', function () {
				let size   = w.getSize();
				let width  = size[0];
				let height = size[1];
				this.oWinSizes[this.sAppView].w= width;
				this.oWinSizes[this.sAppView].h= height;
				
				this._saveData("oWinSizes");	
			}.bind(this));
			
			w.on('move', function () {
				let pos   = w.getPosition();
				let x  = pos[0];
				let y = pos[1];
				this.oWin.pos.x= x;
				this.oWin.pos.y= y;
				
				this._saveData("oWin");	
				this._postWindow();
			}.bind(this));			
		},
		methods: {
			start: function(){
				this._loadData();
				this._startDB().then(()=>{
					this._loadFromDB();
					this.sounder.edit = false;
					this.edit_sounds();
				
					setTimeout(()=>{this.bReady = true}, 20);
				});
			},
			_startDB: function(){
				return new Promise((resolve, reject)=>{
					this.db.connection = indexedDB.open(this.db.name, this.db.version);
				
					// если на клиенте нет базы данных
					this.db.connection.onupgradeneeded = function() {
						// ...выполнить инициализацию...
						this.db.DB = this.db.connection.result;
						switch(this.db.DB.version) { // существующая (старая) версия базы данных
							case 0:
								// версия 0 означает, что на клиенте нет базы данных
								// выполнить инициализацию
							case 1:
								// на клиенте версия базы данных 1
								// обновить
						}
						
						if (!this.db.DB.objectStoreNames.contains('PlayLists')) { // если хранилище не существует
							this.db.DB.createObjectStore('PlayLists', {keyPath: 'id'}); // создаем хранилище
						}
						if (!this.db.DB.objectStoreNames.contains('PlayListGroups')) { 
							this.db.DB.createObjectStore('PlayListGroups', {keyPath: 'id'}); 
						}
						if (!this.db.DB.objectStoreNames.contains('Sounds')) { 
							this.db.DB.createObjectStore('Sounds', {keyPath: 'id'}); 
						}
						
						//resolve();
					}.bind(this);

					this.db.connection.onerror = function() {
						console.error("Error", this.db.connection.error);
						reject();
					}.bind(this);
					
					// продолжить работу с базой данных, используя объект db
					this.db.connection.onsuccess = function() {
						this.db.DB = this.db.connection.result;
						
						this.db.DB.onversionchange = function() {
							this.db.DB.close();
							alert("База данных устарела, пожалуста, перезагрузите страницу.")
						};
						resolve();
															
					}.bind(this);
					
						// есть другое соединение к той же базе
						// и оно не было закрыто после срабатывания на нём db.onversionchange
					this.db.connection.onblocked = function() {
					}.bind(this);
				});
				
			},
			_loadFromDB: async function(){				
					let aPlayLists = await this._getCollection('PlayLists');
					if(aPlayLists) {
						this.aPlayLists = aPlayLists;
					}				
					let aPlayListGroups = await this._getCollection('PlayListGroups');
					if(aPlayListGroups) {
						this.aPlayListGroups = aPlayListGroups;
					}				
					let aSoundCollections = await this._getCollection('Sounds');
					if(aSoundCollections) {
						this.aSoundCollections = aSoundCollections;
					}
			},
			_groupPause: function(sGroupId){
				let aPlayLists = this.aPlayLists.filter(el=>el.group==sGroupId);
				aPlayLists.forEach(PL=>{
					this.pause(PL.id);
				});
			},
			play: function(sPlayListId){				
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					this._groupPause(oPlayList.group);
					oPlayList.config.plaing = true;
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			pause: function(sPlayListId){
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.config.plaing = false;
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			random: function(sPlayListId){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					this.pause(sPlayListId);
					oPlayList.trackIndex = -1;
					setTimeout(function(){
						oPlayList.list = shuffle(oPlayList.list);
						oPlayList.trackIndex = 0;
						this.play(sPlayListId);		

						this._updateCollection('PlayLists', oPlayList);
					}.bind(this), 30);
				}
			},
			compacted: function(sPlayListId){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.config.compact = !oPlayList.config.compact;
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			looped: function(sPlayListId){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.config.loop = !oPlayList.config.loop;
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			
			nextTrack: function(sPlayListId){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					//if(!oPlayList.config.loop){
						oPlayList.trackIndex = oPlayList.trackIndex+1;
						if(oPlayList.trackIndex >= oPlayList.list.length) {
							oPlayList.trackIndex = 0;
						}
					//}
					this._updateCollection('PlayLists', oPlayList);
					this.play(sPlayListId);
				}
			},
			switchTrack: function(sPlayListId, nTrackIndex){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.trackIndex = nTrackIndex;
					this.play(sPlayListId);
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			_addTrack: function(oPlayList, sPath){
				sPath = sPath.replace(/\\/g,"/");
				if(/.(mp3)|(flac)|(wav)$/.test(sPath) && !oPlayList.list.find(el=>el.path==sPath)){					
					oPlayList.list.push({
						path: sPath
					});
				}
			},
			addTrack: function(oEvent, sPlayListId){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					for (const f of oEvent.target.files) {
						this._addTrack(oPlayList, f.path);
					}
					this._saveData();
					this._updateCollection('PlayLists', oPlayList);					
				}
			},
			removeTrack: function(sPlayListId, nTrackIndex){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.list.splice(nTrackIndex, 1);
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			volumeChanged: function(sPlayListId, oEvent){
				//debugger;
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {					
					let nValue = oEvent.target.value;
					oPlayList.volume = nValue;
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			
			start_edit_title: function(sPlayListId){
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.config.edit = true;
				}
			},
			finish_edit_title: function(sPlayListId, sNewTitle){
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.config.edit = false;			
					oPlayList.title = sNewTitle;
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			
			group_configing: function(sPlayListId,){
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.config.group_opened = !oPlayList.config.group_opened;
				}
			},
			set_group: function(sPlayListId, nGroupId){
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				if(oPlayList) {
					oPlayList.config.group_opened = false;
					oPlayList.group = nGroupId;
					this._updateCollection('PlayLists', oPlayList);
				}
			},
			remove_group: function(sGroupId){
				let oGroup = this.aPlayListGroups.find(el=>el.id==sGroupId);
				if(oGroup) {
					let nGroupIndex = this.aPlayListGroups.findIndex(el=>el.id==sGroupId);
					this.aPlayListGroups.splice(nGroupIndex, 1);
					this._removeFromCollection('PlayListGroups', oGroup);
				}
			},
			
			group_title_edited: function(sGroupId, sTitle){
				//debugger;
				let oGroup = this.aPlayListGroups.find(el=>el.id==sGroupId);
				if(oGroup) {
					oGroup.title = sTitle;
					this._updateCollection('PlayListGroups', oGroup);
				}
			},
			group_color_edited: function(sGroupId, sColor){
				//debugger;
				let oGroup = this.aPlayListGroups.find(el=>el.id==sGroupId);
				if(oGroup) {
					oGroup.color = sColor;
					this._updateCollection('PlayListGroups', oGroup);
				}
			},
			add_group: function(){
				let oGroup = {					
					id: guidGenerator(),
					title: "",
					color: "#ff0000",
					edit: false
				};
				this.aPlayListGroups.push(oGroup);
				this._addToCollection('PlayListGroups', oGroup);
			},
			
			_addToCollection(sName, oItem){
				return new Promise((resolve, reject) => {
					let transaction = this.db.DB.transaction(sName, "readwrite"); // (1)

					// получить хранилище объектов для работы с ним
					let collection = transaction.objectStore(sName); // (2)
			
					let request = collection.add(oItem); // (3)

					request.onsuccess = function() { // (4)
						console.log("Добавлено", request.result);
						resolve();
					};

					request.onerror = function() {
						console.log("Ошибка", request.error);
						reject();
					};
				});
			},
			_updateCollection(sName, oItem){ // 
				return new Promise((resolve, reject) => {
					let transaction = this.db.DB.transaction(sName, "readwrite"); // (1)

					// получить хранилище объектов для работы с ним
					let collection = transaction.objectStore(sName); // (2)
			
					let request = collection.put(oItem); // (3)

					request.onsuccess = function() { // (4)
						console.log("Обновлено", request.result);
						resolve();
					};

					request.onerror = function() {
						console.log("Ошибка", request.error);
						reject();
					};
				});
			},
			_removeFromCollection(sName, oItem){ // 
				return new Promise((resolve, reject) => {
					let transaction = this.db.DB.transaction(sName, "readwrite"); // (1)

					// получить хранилище объектов для работы с ним
					let collection = transaction.objectStore(sName); // (2)
			
					let request = collection.delete(oItem.id); // (3)

					request.onsuccess = function() { // (4)
						console.log("Обновлено", request.result);
						resolve();
					};

					request.onerror = function() {
						console.log("Ошибка", request.error);
						reject();
					};
				});
			},
			_getCollection(sName){
				return new Promise((resolve, reject) => {					
					let transaction = this.db.DB.transaction(sName, "readwrite"); // (1)

					// получить хранилище объектов для работы с ним
					let collection = transaction.objectStore(sName); // (2)
					debugger;
					let request = collection.getAll(); // (3)

					request.onsuccess = function() { // (4)
						//console.log("Добавлено", request.result);
						debugger;
						resolve(request.result);
					};

					request.onerror = function() {
						console.log("Ошибка", request.error);
						reject();
					};
				});
			},
			
			add_playlist: function(){
				let oPlayList = {
					id: guidGenerator(),
					order: this.aPlayLists.length,
					title: `Плейлист ${this.aPlayLists.length}`,
					color: "red",
					group: "",
					img: "",
					config: {
						loop: false,
						compact: false,
						plaing: false,
						edit: false,
						group_opened: false
					},
					volume: 50,
					trackIndex: 0,
					list: [						
					]
				};
				this.aPlayLists.push(oPlayList);
				this._addToCollection('PlayLists', oPlayList);
				
			},
			
			remove_playlist: function(sPlayListId){
				let oPlayList = this.aPlayLists.find(el=>el.id==sPlayListId);
				let oPlayListIndex = this.aPlayLists.findIndex(el=>el.id==sPlayListId);
				if(oPlayListIndex>-1) {
					this.aPlayLists.splice(oPlayListIndex, 1);
					this._removeFromCollection('PlayLists', oPlayList);
				}
			},
			
			checkUpdates: async function(){
				var sUrl = 'https://api.github.com/repos/Etignis/dPlayer/releases';
				var response = await fetch(sUrl);
				let that = this;
				if (response.ok) { // если HTTP-статус в диапазоне 200-299
					// получаем тело ответа (см. про этот метод ниже)
					//debugger;
					var json = await response.json();
					console.dir(json);
					console.log(json[0].tag_name);
					let sNewTagName= json[0].tag_name.replace("v","");
					let aTagName = sNewTagName.split(".");
					let aVersion = VERSION.split(".");
					for(let i=0; i<4; i++) {
						let sNew = aTagName[i] || 0;
						let sCur = aVersion[i] || 0;
						
						if(sNew<sCur) {return}
						if(sNew>sCur) {
							this.oMeta.bNewVersionAvailable = true;
							this.oMeta.sLatestVersion = `v${sNewTagName}`; 
							return;
						}
						
					}
				} else {
					alert("Ошибка HTTP: " + response.status);
				}
			},
			openNewVersion: function(){				
				shell.openExternal(this.sNewVersionLink);
			},
			setHotkeys: function(){
				this._registerHotkeys();
				ipcRenderer.on('hotkey_press', (event, arg) => {
					console.log(arg);
					if(arg==="0") {
						arg=10;
					}
					this._callSounder(arg);
				})
			},
			
			callSounder(nIndex){
				nIndex--;
				if(nIndex>=0 && nIndex<10) {
					let aSounders = app.$children.filter(el=>el.getRandomSound!=undefined);
					aSounders[nIndex].itemclick();
				}
			},
			
			initSortable: function(){				
				let that = this;
				setTimeout(function(){
					let oList = document.getElementById('edit');
					Sortable.create(oList, {
						handle: ".handler",
						ghostClass: "drag_ghost",
						dragClass: "drag_drag",
						onEnd: that.SoundersReordered
					});
				}, 100);
			},
			
			_saveData: function(sParam) {
				let aParams= [
					//"aSoundCollections",
					"sAppView",
					"oWinSizes",
					"oWin",
					"oHotkeys"
				];
				if(sParam) {
					aParams= [sParam];
				}
				
				aParams.forEach(function(sVal){
					localStorage.setItem(sVal, JSON.stringify(this[sVal]));
				}.bind(this));
				
				
			},
			_loadData: function() {
				let aParams= [
					//"aSoundCollections",
					"sAppView",
					"oWinSizes",
					"oWin",
					"oHotkeys"
				];
				let that = this;
				
				aParams.forEach(function(sParam){
					let oLocalData = localStorage.getItem(sParam);
					//that.aLocalDataDebug.push(sParam+": "+oLocalData);
					if(oLocalData) {
						oLocalData = JSON.parse(oLocalData);
					}
					if(oLocalData) {						
						//alert(sParam+": "+JSON.stringify(oLocalData));
						that[sParam] = oLocalData;
					}
				}.bind(this));
				
				
			},
			
			////////////// SOUNDS
	
			_setSoubderEditor: function(oData){
				let oEditor = this.sounder.editor;
				
				for (let key in oEditor) {
					oEditor[key] = oData[key];
				}
			},
			sounder_press: function(sounder_id){
				let oSounder = this.aSoundCollections.find(el=>el.id==sounder_id);
				this.aSoundCollections.forEach(el=>{el.active=false});
				if(oSounder) {
					if(this.sounder.edit) {
						oSounder.active = true;
						this._setSoubderEditor(oSounder);
					} else {
						
					}					
				}
			},
			edit_sounds: function(bEdit){
				this.sounder.edit = ((typeof bEdit === "boolean") && bEdit) || !this.sounder.edit;
				
				if(!this.sounder.edit) {
					this.aSoundCollections.forEach(el=>{el.active=false});
				}
			},
			_updateSoundFromEditor: function(){
				let oEditor = this.sounder.editor;
				let oSounder = this.aSoundCollections.find(el=>el.id==oEditor.id);
				if(oSounder) {
					for (let key in oEditor) {
						oSounder[key] = oEditor[key];
					}
				}
				this._updateCollection('Sounds', oSounder);
			},
			onSounderTrackRemove: function(nIndex){
				let oEditor = this.sounder.editor;
				oEditor.items.splice(nIndex, 1);
				this._updateSoundFromEditor();
			},
			onSounderTrackNumberEdited: function(sNumber, nIndex){
				let oEditor = this.sounder.editor;
				oEditor.items[nIndex].number = Number(sNumber);
				this._updateSoundFromEditor();
			},
			sound_title_changed: function(oEvent){
				this.sounder.editor.title = oEvent.target.value;
				this._updateSoundFromEditor();
			},
			sound_icon_filter: function(oEvent){
				if(oEvent.target.value && oEvent.target.value.length>1) {
					this.sounder.editor.ico_filter = oEvent.target.value;
				} else {
					this.sounder.editor.ico_filter = "";
				}
				this.sounder.editor.ico = oEvent.target.value;
				this._updateSoundFromEditor();
			},
			onSounderIcoSelect: function(sIco){
				this.sounder.editor.ico = sIco;
				this._updateSoundFromEditor();
			},
			deleteSound: function(oItem, oSound){
				
				let Collection = this.aSoundCollections.find(el=>el.id==oItem.id);
				if(Collection) {
					Collection.items = Collection.items.filter(el=>el.src!=oSound.src);
				}
				this._saveData();
			},
			
			_addSound: function(oItem, sPath){
				sPath = sPath.replace(/\\/g,"/");
				if(/.(mp3)|(flac)|(wav)$/.test(sPath) && !oItem.items.find(el=>el.src==sPath)){					
					oItem.items.push({
						src: sPath
					});
				}
			},
			addSound: function(oEvent) {
				let oItem = this.sounder.editor;
				for (const f of oEvent.target.files) {
					this._addSound(oItem, f.path);
				}
				this._updateSoundFromEditor();
				//this._saveData();
			},
			dropSound: function(oEvent, oItem){
				let that = this;
				for(let i=0; i<oEvent.dataTransfer.items.length; i++ ) {
					if(oEvent.dataTransfer.items[i].webkitGetAsEntry().isFile){
						this._addSound(oItem, oEvent.dataTransfer.files[i].path);						
					} else {
						let aFiles = fs.readdirSync(oEvent.dataTransfer.files[i].path);
						if(aFiles && aFiles.length) {
							aFiles.forEach(function(sFile){
								that._addSound(oItem, oEvent.dataTransfer.files[i].path.replace(/\\/g,"/")+"/"+sFile);	
							});
						}
					}
				}
				
				this._saveData();
			},

			addSounder: function(){
				let sNewId = guidGenerator();
				if(this.aSoundCollections.find(el=>el.id==sNewId)) {
					sNewId = guidGenerator();
				}
				let oSounder = {
					title: "",
					id: sNewId,
					ico: this.aIconNames[randd(0, this.aIconNames.length)],
					items: []
				};
				this.aSoundCollections.push(oSounder);
				
				this.edit_sounds(true);
				this.sounder_press(sNewId);
				this._addToCollection('Sounds', oSounder);
				
				//this._saveData();
				//this._initSortable();
			},
			
			remove_sounder: function(){
				let sId = this.sounder.editor.id;
				this.aSoundCollections = this.aSoundCollections.filter(el=>el.id!=sId);
				//this._saveData();
				this._removeFromCollection('Sounds', {id: sId});
			},
			
			change_ico: function(sIco, oItem){
				this.aSoundCollections.find(el=>el.id==oItem.id).ico = sIco;
				this._saveData();
			},
			change_title: function(sTitle, oItem){
				this.aSoundCollections.find(el=>el.id==oItem.id).title = sTitle;
				this._saveData();
			},
			
			SoundersReordered: function(){
				let oNewIdList = {};
				let aConf = document.querySelectorAll(".sconf");
				for(let i=0; i<aConf.length; i++) {
					oNewIdList[aConf[i].dataset.id] = i;
				}
				this.aSoundCollections = this.aSoundCollections.sort(function(a,b){
					return oNewIdList[a.id]-oNewIdList[b.id];
				});
				this._saveData();
			},
			
			proxy: function(sMethod){
				this[sMethod]();
			},
			toggleEditMode: function(){
				this.bEditMode = !this.bEditMode;
			},
			toggleConfigMode: function(){
				this.pages.Config = !this.pages.Config;
			},
			/*
			toDefaultView: function(){
				this.sAppView = "default";	
				this._saveData("sAppView");	
				w.setSize(this.oWinSizes["default"].w,this.oWinSizes["default"].h);
				this._postWindow();
			},
			toSquareView: function(){
				this.sAppView = "square"; 
				this._saveData("sAppView");	
				w.setSize(this.oWinSizes["square"].w,this.oWinSizes["square"].h);
				this._postWindow();
			},
			toPanelView: function(){
				this.sAppView = "panel"; 
				this._saveData("sAppView");	
				w.setSize(this.oWinSizes["panel"].w,this.oWinSizes["panel"].h);
				this._postWindow();
			},
			*/
			
			_postWindow() {
				const { width, height } = remote.screen.getPrimaryDisplay().workAreaSize;
				
				let size = w.getSize();
				let w_w  = size[0];
				let w_h = size[1];
				
				let pos   = w.getPosition();
				let x  = pos[0];
				let y = pos[1];
				
				let bottom = w_h+y;
				let right = w_w+x;
				
				let b_delta = bottom-height;
				let r_delta = right-width;
				// if(b_delta>0 || r_delta>0) {
					// let new_x = x-r_delta,
					// new_y = y-b_delta-100;
					// this.oWin.pos.x = new_x;
					// this.oWin.pos.y = new_y;
					// w.setPosition(this.oWin.pos.x, this.oWin.pos.y);
					// this._saveData("oWin");	
				// }
				if(y<0) {
					this.oWin.pos.y = 0;
					w.setPosition(this.oWin.pos.x, this.oWin.pos.y);
					this._saveData("oWin");	
				}
			},
			setForeground: function(){
				this.oWin.bForeground = !this.oWin.bForeground;
				w.setAlwaysOnTop(this.oWin.bForeground);
				this._saveData("oWin");	
			},
			
			_registerHotkeys: function(){
				let aKeys = [];
				if(this.oHotkeys.SHIFT) {
					aKeys.push('SHIFT');
				}
				if(this.oHotkeys.CTRL) {
					aKeys.push('CTRL');
				}
				if(this.oHotkeys.ALT) {
					aKeys.push('ALT');
				}
				
				ipcRenderer.send('hotkeys', aKeys);
			},
			setSoundHotkeyShift: function(){
				this.oHotkeys.SHIFT = !this.oHotkeys.SHIFT;
				this._registerHotkeys();
				this._saveData("oHotkeys");	
			},
			setSoundHotkeyCtrl: function(){
				this.oHotkeys.CTRL = !this.oHotkeys.CTRL;
				this._registerHotkeys();	
				this._saveData("oHotkeys");				
			},
			setSoundHotkeyAlt: function(){
				this.oHotkeys.ALT = !this.oHotkeys.ALT;	
				this._registerHotkeys();
				this._saveData("oHotkeys");				
			},
			
			quite: function(){
				w.close();
			}
		}
  });
	
	// $(document).keydown(function(event){
		// CTRL pressed
		// if(event.which=="17") {
			// fCtrlIsPressed = true;
		// }

		// A pressed
		// if(event.which=="65" && fCtrlIsPressed) {
			// /*/
			// if($(".spellCard.selected").length == $(".spellCard").length) {
				// deselect all
				// $(".spellCard").removeClass("selected");
			// } else {
				// select all
				// $(".spellCard").addClass("selected");
			// }
			// /**/
			// app.selectAll();
			// return false;
		// }
	// });

	// $(document).keyup(function(){
		// fCtrlIsPressed = false;
	// });