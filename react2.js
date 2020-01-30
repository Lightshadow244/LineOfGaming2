'use strict';

//https://store.steampowered.com/api/appdetails?appids=218620

const list = [
	[
		'2006',
		'218620',
		'49520'
	],
	[
		'2007',
		'218620',
		'49520'
	],
//	[
//		'2008',
//		'218620',
//		'49520'
//	],
//	[
//		'2009',
//		'218620',
//		'49520'
//	],
//	[
//		'2010',
//		'218620',
//		'49520'
//	],
//	[
//		'2012',
//		'218620',
//		'49520'
//	],
//	[
//		'2013',
//		'218620',
//		'49520'
//	],
//	[
//		'2014',
//		'218620',
//		'49520'
//	],
//	[
//		'2015',
//		'218620',
//		'49520'
//	],
//	[
//		'2016',
//		'218620',
//		'49520'
//	],
];
const create = React.createElement;
const steamAPI_url = 'https://cors-anywhere.herokuapp.com/https://store.steampowered.com/api/appdetails?appids='
const header = {}

class Timeline extends React.Component {
	render(){
		var timeline = [];
		for (var item in list){
			if(item % 2 === 0){
				timeline.push(create('div',{className: 'container bg-primary timeline-item-1',},list[item][0]))
			}else{
				timeline.push(create('div',{className: 'container bg-primary timeline-item-2'},list[item][0]))
			};
		}
		return(timeline);
	}
}

class Container extends React.Component {
	constructor(props) {
    super(props);
	this.getSteamAppInfo()
	}
	
	
	async getSteamAppInfo(){
		var GameID
		var data_list
		var games = [];
		for(var year in list){
			for(var GameID in list[year]){
				if(GameID != 0){
					console.log(list[year][GameID]);
					const response = await fetch(steamAPI_url + list[year][GameID]);
					const json =  await response.json().then(data => {
						  console.log(data)
						const data_list = {
							name: data[list[year][GameID]].data.name,
							description: data[list[year][GameID]].data.detailed_description
						}
						for (var screen in data[list[year][GameID]].data.screenshots) {
						data_list[screen] = data[list[year][GameID]].data.screenshots[screen].path_full
						}
						console.log(data_list);
						games.push(data_list)
					  })
					  .catch(error => console.log(error));
				}
			}
		}
					console.log(games);
					this.setState({games: games});
	}
	render(){
		var r = create('div')
		if(this.state != null){
			r = create('div',null,create(Timeline,{games: this.state.games}));
		}
		return(r)
	}
}

const domContainer = document.querySelector('#react_container');
ReactDOM.render(create(Container), domContainer);