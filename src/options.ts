const option = {
	font: {
		size: '55px',
		style: 'STheiti, SimHei',
		color: 'red',
	},
	canvas: {
		offset: 100,
	},
	theme: {
		// todo: bug
		color: 'red',
	},
	chart: {
		xOffset: 80, // 百分比
	},
	data: {
		xAxis: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子', '衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
		yAxis: [5, 20, 36, 10, 88, 20, 5, 20, 36, 10, 88, 20],
	},
}

export type IOption  = typeof option

export default option
