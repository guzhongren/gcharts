import {IOption} from './options'

class Chart {
	context: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
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
			this.canvas = document.createElement('canvas') as HTMLCanvasElement
			this.canvas.width = window.innerWidth
			this.canvas.height = window.innerHeight
			container.appendChild(this.canvas)
			this.context = this.canvas.getContext('2d')
		} else {
			console.error('请传入正确的id!')
		}
		window.onresize = () => {
			this.canvas.width = window.innerWidth
			this.canvas.height = window.innerHeight
		}
	}
	setOption(option: IOption) {
		// 验证数据结构
		const data = option.data
		if (data.xAxis.length !== data.yAxis.length) {
			console.error('横纵坐标数据长度不一致，请检查！')
			return
		}
		this.context.save()
		// const font = option.font
		this.drawRect(100, 50, 10 , 10, 50, 50, option.theme.color)
		// this.context.font = `${font.size} ${font.style}`
		// this.context.fillStyle = `${font.color}`
		// this.context.fillText('chart', 150, 100)
		// this.context.fillStyle = '#333'
		// this.context.fillRect(0, 0, 100, 100)
		this.context.save()
	}
	/**
	 * 标注文字
	 *
	 * @param {string} text 要标注的文字
	 * @param {number} x 横坐标
	 * @param {number} y 纵坐标
	 * @param {string} color 字体颜色
	 * @memberof Chart
	 */
	drawFont(text: string, x: number, y: number, color: string) {
		this.context.save()
		this.context.fillStyle = color
		this.context.fillText(text, x, y)
	}
	/**
	 *
	 *
	 * @param {number} x 横坐标
	 * @param {number} y 纵坐标
	 * @param {number} xOffset x偏移
	 * @param {number} yOffset y偏移
	 * @param {number} width 矩形宽度
	 * @param {number} height 矩形高度
	 * @param {string} color 填充颜色
	 * @memberof Chart
	 */
	drawRect(x: number, y: number, xOffset: number, yOffset: number, width: number, height: number, color: string) {
		this.context.save()
		this.context.fillStyle = color
		this.context.fillRect(x, y, x + xOffset + width, y + yOffset + height)
	}
}

export default Chart
