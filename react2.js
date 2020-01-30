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
	[
		'2008',
		'218620',
		'49520'
	],
	[
		'2009',
		'218620',
		'49520'
	],
	[
		'2010',
		'218620',
		'49520'
	],
	[
		'2012',
		'218620',
		'49520'
	],
	[
		'2013',
		'218620',
		'49520'
	],
	[
		'2014',
		'218620',
		'49520'
	],
	[
		'2015',
		'218620',
		'49520'
	],
	[
		'2016',
		'218620',
		'49520'
	],
];
const create = React.createElement;
const steamAPI_url = 'https://store.steampowered.com/api/appdetails?appids='
const header = {'Content-Type': 'application/json'}

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
	}
	
	getSteamAppInfo(GameID){
		fetch(steamAPI_url + GameID, {
			method:'GET',
			headers: header,
		  }).then(results => {
			return results.json()
		  }).then(data => {
			const data_list = data.map(c => {
			  return{
				type: c.GameID.data.type
			  };
			});
			const newState = Object.assign({}, this.state, {
				 [GameID]: data_list
		   });
		   this.setState(newState);
		  })
		  .catch(error => console.log(error));
	}
	
	render(){
		this.getSteamAppInfo('218620')
		return(create('div',null,create(Timeline)));
	}
}

const domContainer = document.querySelector('#react_container');
ReactDOM.render(create(Container), domContainer);