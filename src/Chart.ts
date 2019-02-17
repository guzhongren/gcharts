import {IOption} from './options'

class Chart {
	context: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	option: any
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
			this.setOption(this.option)
		}
	}
	setOption(option: IOption) {
		this.option = option
		// 验证数据结构
		const data = option.data
		if (data.xAxis.length !== data.yAxis.length) {
			console.error('横纵坐标数据长度不一致，请检查！')
			return
		}
		const canvasSize = this.calcChartSize(this.canvas)
		this.context.save()
		// 绘制纵坐标轴
		const YStart = [option.canvas.offset, canvasSize[0] - option.canvas.offset]
		const YEnd = [option.canvas.offset, option.canvas.offset]
		this.drawAxis(YStart, YEnd)
		// 绘制横坐标轴
		const X = canvasSize[0] - option.canvas.offset
		const XStart = [option.canvas.offset, X]
		const XEnd = [canvasSize[1] - option.canvas.offset, X]
		this.drawAxis(XStart, XEnd)
		// TODO: 根据数据画柱状图
		this.drawRect(500, 50, 10 , 10, 50, 50, option.theme.color)
		this.drawFont('ter', 200, 200, 'red', 30)
		this.context.save()
	}
	/**
	 * 计算 cavas 画布的大小
	 *
	 * @param {HTMLCanvasElement} canvas
	 * @returns [height, width]
	 * @memberof Chart
	 */
	calcChartSize(canvas: HTMLCanvasElement) {
		const height = canvas.height
		const width = canvas.width
		return [height, width]
	}
	/**
	 * 在 context 上画坐标轴
	 *
	 * @param {number[]} start 起点坐标
	 * @param {number[]} end 终点坐标
	 * @memberof Chart
	 */
	drawAxis(start: number[], end: number[]) {
		this.context.beginPath()
		this.context.moveTo(start[0], start[1])
		this.context.lineTo(end[0], end[1])
		this.context.stroke()
		this.context.lineCap = 'round'
		this.context.closePath()
	}
	/**
	 * 标注文字
	 *
	 * @param {string} text 要标注的文字
	 * @param {number} x 横坐标
	 * @param {number} y 纵坐标
	 * @param {string} [color='#333'] 字体颜色
	 * @param {number} [size=16] 字号
	 * @param {string} [fontStyle='Arial'] 字体
	 * @memberof Chart
	 */
	drawFont(text: string, x: number, y: number, color: string = '#333', size: number = 16, fontStyle: string = 'Arial') {
		this.context.save()
		this.context.font = `${size}px ${fontStyle}`
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
