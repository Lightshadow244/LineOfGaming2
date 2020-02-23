'use strict';
const list = [
	[
		'2006',
		'4880',
		'12320'
	],
	[
		'2008',
		'225640',
	],
	[
		'2009',
		'8980',
	],
	[
		'2010',
		'40800',
		'15100',
		'33230',
	],
	[
		'2011',
		'48190',
		'238960',
		'489830',
	],
	[
		'2012',
		'49520',
	],
	[
		'2013',
		'251470',
		'214730',
	],
	[
		'2014',
		'256290',
	],
	[
		'2015',
		'261570',
		'292030',
	],
	[
		'2016',
		'374320',
	],
	[
		'2017',
		'578080',
	],
	[
		'2018',
		'294100',
		'378540',
	],
	[
		'2019',
		'333420',
	],
	[
		'2020',
		'594650',
	],

];
const create = React.createElement;
const steamAPI_url = 'https://cors-anywhere.herokuapp.com/https://store.steampowered.com/api/appdetails?appids=';
const header = {};

//creates the game info. The game info is also a part of the game card, so if you click anywhere on the info it will close the info.
class GameInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state={screenCounter:0};
	};

	componentDidMount() {
		setInterval(() => {
			//console.log(this.props.screens.length -1)
				if(this.props.game.screens.length -1 == this.state.screenCounter){
					this.setState({screenCounter: 0})
				}else{
					this.setState({screenCounter: this.state.screenCounter + 1})
				};
		}, 5000);
	};

	render(){
		var info = create('div');
		if(this.props.showInfo == true){
			info = create('div',{className:'container bg-secondary position-fixed gameInfo '},
				create('button', {className:'close'},'x'),
				create('h1',{className:'container'},
					this.props.game.name
				),
				create('div',{className:'container'},
					create(Slider2, {screens:this.props.game.screens, screenCounter:this.state.screenCounter})
				),
				create('div',{className:'container overflow-auto mt-2 mb-2'},this.props.game.description)
			)
		};
		return(info);
	};
};

//returns just a picture which is given.
class Slider2 extends React.Component {
	render(){
		return(create('img',{className: 'img-fluid', src:this.props.screens[this.props.screenCounter]}))
	};
};

//creates the card for every game.
class GameCard extends React.Component {
	constructor(props) {
		super(props);
		this.state={screenCounter:0,showInfo:false};
	};
	//invert if the info is shown or not when you click on the card.
	changeInfoStatus(){
		this.setState({showInfo:!this.state.showInfo});
	};
	//let the slider randomly show the next picture
	componentDidMount() {
		setInterval(() => {
			//console.log(this.props.screens.length -1)
			if(Math.floor(Math.random() * 10) < 4){
				if(this.props.game.screens.length -1 == this.state.screenCounter){
					this.setState({screenCounter: 0})
				}else{
					this.setState({screenCounter: this.state.screenCounter + 1})
				};
			};
		}, 3000);
	};

	render(){
		return(
			create('div',{className: "card text-white bg-primary mb-3 w-25 h-100", onClick:() => {this.changeInfoStatus()}},
				create('div', {className: 'card-header'},this.props.game.name),
				create(Slider2, {screens:this.props.game.screens, screenCounter:this.state.screenCounter}),
				create(GameInfo,{game:this.props.game, showInfo:this.state.showInfo})
			)
		);
	};


};

//creates a game-card-group for every year and the year for every year-block
class GameCardGroup extends React.Component {
	constructor(props) {
		super(props);
	};


	render(){
		var group
		var gameCardList = []

		for(var game in this.props.gamePerYear){
			if(game != 0){
				gameCardList.push(
					create(GameCard, {game:this.props.gamePerYear[game]})
				);
			};
		};

		//console.log('itemNumber: ' + this.props.itemNumber)
		if(this.props.itemNumber % 2 === 0){
			group = create('div', {className: 'row'},
					create('h2', {className: 'yearLeft mb-auto mt-auto'}, this.props.gamePerYear[0]),
					gameCardList,
				);
		}else{
			group = create('div', {className: 'row'},
					create('h2', {className: 'yearRight mb-auto mt-auto'}, this.props.gamePerYear[0]),
					gameCardList,
				);
		};
		return(group);
	};
};

//creates every Timeline-block with the corresponding css class, so it looks like a white line is circling around the years to the bottom.
class Timeline extends React.Component {
	constructor(props) {
    super(props);
	};

	render(){
		var timeline = [];

		for (var item in this.props.allGames){
			if(item % 2 === 0){
				timeline.push(
					create('div',{className: 'container bg-primary timeline-item-1',},
						create(GameCardGroup,{gamePerYear:this.props.allGames[item],itemNumber: item})
					)
				);
			}else{
				timeline.push(
					create('div',{className: 'container bg-primary timeline-item-2'},
						create(GameCardGroup,{gamePerYear:this.props.allGames[item], itemNumber: item})
					)
				)
			};
		};

		return(timeline);
	}
}

// Main container. Contains the bar on the top and the whole timeline. Also contains a the mechanism to show loading, if not everything is fetched from steam.
class Container extends React.Component {
	constructor(props) {
		super(props);
		this.getSteamAppInfo()
	};


	async getSteamAppInfo(){
		var GameID;
		var data_list;
		var allGames = [];
		for(var year in list){
			var games = [list[year][0],];
			for(var GameID in list[year]){
				if(GameID != 0){
					const response = await fetch(steamAPI_url + list[year][GameID]);
					const json =  await response.json().then(data => {
						const data_list = {
							name: data[list[year][GameID]].data.name,
							description: data[list[year][GameID]].data.short_description,
							screens: []
						}
						for (var screen in data[list[year][GameID]].data.screenshots) {
						data_list.screens.push(data[list[year][GameID]].data.screenshots[screen].path_full)
						}
						games.push(data_list)
					  })
					  .catch(error => console.log(error));
				};
			};
			allGames.push(games)
		};
					this.setState({allGames: allGames});
	};
	render(){
		var r = create('div')
		if(this.state != null){
			r = create('div',null,
				create(Timeline,{allGames: this.state.allGames}),
				create('div',{className:'navbar navbar-expand-lg fixed-top navbar-dark bg-primary'},
					create('h4',{className:'mb-0'},'Gaming-Timeline'))
			);
		}else{
			r = create('div', {className:'container m-auto'},
				create('h1',{className:'text-muted text-center'},'Loading...')
			)
		};
		return(r);
	};
};

const domContainer = document.querySelector('#react_container');
ReactDOM.render(create(Container), domContainer);
