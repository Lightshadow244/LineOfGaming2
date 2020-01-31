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

class GameCardGroup extends React.Component {
	constructor(props) {
    super(props);
	}
	
//needs a key for every child
	createGameCards(){
		console.log(this.props.gamePerYear)
		var gameCardList = []
		for(var game in this.props.gamePerYear){
			if(game != 0){
				console.log('game per year ' + this.props.gamePerYear[game])
				gameCardList.push(
					create('div',{className: "card text-white bg-primary mb-3",style: {maxWidth: "20rem"}},
						create('div', {className: 'card-header'},'Header'),
						create('div', {className: 'carousel slide', 'data-ride':'carousel'},
							create('div', {className: 'carousel-inner'},
								create('div', {className: 'carousel-item active'},
									create('img', {className: 'd-block w-100',src: this.props.gamePerYear[game].screens[0]},)
								),
								create('div', {className: 'carousel-item'},
									create('img', {className: 'd-block w-100',src: this.props.gamePerYear[game].screens[1]},),
								),
								create('div', {className: 'carousel-item'},
									create('img', {className: 'd-block w-100',src: this.props.gamePerYear[game].screens[2]},)
								)
							)
						)
					)
				);
			};
		
		};
//year have to be hear
		return(gameCardList)
	};
	
	render(){
		return(create('div', {className: 'row'}, this.createGameCards()));
	};
};

class Timeline extends React.Component {
	constructor(props) {
    super(props);
	}
	
	render(){
		var timeline = [];
			
		for (var item in this.props.allGames){
			if(item % 2 === 0){
				timeline.push(create('div',{className: 'container bg-primary timeline-item-1',},create(GameCardGroup,{gamePerYear:this.props.allGames[item]}))) 
			}else{
				timeline.push(create('div',{className: 'container bg-primary timeline-item-2'},create(GameCardGroup,{gamePerYear:this.props.allGames[item]})))
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
		var allGames = []
		for(var year in list){
			var games = [list[year][0],];
			for(var GameID in list[year]){
				if(GameID != 0){
					//console.log(list[year][GameID]);
					const response = await fetch(steamAPI_url + list[year][GameID]);
					const json =  await response.json().then(data => {
						  //console.log(data)
						const data_list = {
							name: data[list[year][GameID]].data.name,
							description: data[list[year][GameID]].data.detailed_description,
							screens: []
						}
						for (var screen in data[list[year][GameID]].data.screenshots) {
						//data_list[screen] = data[list[year][GameID]].data.screenshots[screen].path_full
						data_list.screens.push(data[list[year][GameID]].data.screenshots[screen].path_full)
						}
						console.log(data_list);
						games.push(data_list)
					  })
					  .catch(error => console.log(error));
				}
			}
			allGames.push(games)
		}
					console.log(allGames);
					this.setState({allGames: allGames});
	}
	render(){
		var r = create('div')
		if(this.state != null){
			r = create('div',null,create(Timeline,{allGames: this.state.allGames}));
		}
		return(r)
	}
}

const domContainer = document.querySelector('#react_container');
ReactDOM.render(create(Container), domContainer);