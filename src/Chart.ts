class Chart {
	context: CanvasRenderingContext2D
	/**
	 * Creates an instance of Chart.
	 * @param {string} id canvas id
	 * @memberof Chart
	 */
	constructor(id: string) {
		const container = document.getElementById(id)
		container.className = 'chartContainer'
		if (container) {
			container.innerHTML = ''
			const canvas = document.createElement('canvas')
			canvas.className = 'chartCanvas'
			container.appendChild(canvas)
			this.context = canvas.getContext('2d')
		} else {
			console.error('请传入正确的id!')
		}
	}
	setOption(option: object) {
		this.context.font = '24px STheiti, SimHei'
		this.context.fillText('chart', 50, 100)
		this.context.fillStyle = '#333'
		this.context.fillRect(0, 0, 100, 100)
		console.log(this.context)
		console.log(option)
	}
}

export default Chart
