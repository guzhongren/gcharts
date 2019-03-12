import { IOption } from './options'

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
			this.resetCanvasSize()
			container.appendChild(this.canvas)
			this.context = this.canvas.getContext('2d')
		} else {
			console.error('请传入正确的id!')
		}
		window.onresize = () => {
			this.resetCanvasSize()
			this.setOption(this.option)
		}
	}
	/**
	 * 重置 canvas 画布的大小
	 */
	resetCanvasSize() {
		this.canvas.width = window.document.body.clientWidth
		this.canvas.height = window.document.body.clientHeight
	}
	/**
	 * 入口，将数据放入配置并画图
	 * @param option 配置信息
	 */
	setOption(option: IOption) {
		this.option = option
		this.draw(option)
	}
	/**
	 * 画图
	 * @param option 配置信息
	 */
	draw(option: IOption) {
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
		this.context.textAlign = 'right'
		this.drawAxis(YStart, YEnd)
		// 绘制横坐标轴
		const X = canvasSize[0] - option.canvas.offset
		const XStart = [option.canvas.offset, X]
		const XEnd = [canvasSize[1] - option.canvas.offset, X]
		this.drawAxis(XStart, XEnd)
		// 根据数据画柱状图
		this.getRectArray(this.option, canvasSize).map((rect) => {
			this.drawRect(rect.x, rect.y, rect.w, -rect.h, option.theme.color)
		})
		this.drawYLabels(option, canvasSize)
		this.drawXLabels(option, canvasSize)
		this.context.save()
	}
	drawXLabels(option: IOption, canvasSize: [number, number]) {
		const xAxis = option.data.xAxis
		const halfWidth = this.getChartSize(option, canvasSize)[1] / xAxis.length / 2
		const offset = option.canvas.offset
		const y = canvasSize[0] - offset
		xAxis.forEach((item: string, index: number) => {
			const x = offset + (2 * index + 1) * halfWidth
			this.context.textAlign = 'center'
			this.drawText(item, x, y + this.option.canvas.offset / 2)
		})
	}
	drawYLabels(option: IOption, canvasSize: [number, number]) {
		const [maxValue, realNumberCount] = this.getRealNumCount(option.data.yAxis)
		// 将纵坐标等分
		const canvasOffset = option.canvas.offset
		const halfCanvasOffset = canvasOffset / 4 * 3
		const partCount = Math.ceil(maxValue / Math.pow(10, realNumberCount - 1))
		const chartSize = this.getChartSize(option, canvasSize)
		const partHeight = chartSize[0] / partCount
		for (let i = 0; i <= partCount; i++) {
			const tempYHeight = canvasSize[0] - canvasOffset - partHeight * i
			const text = (i * Math.pow(10, realNumberCount - 1)).toString()
			this.drawText(text, canvasOffset - this.option.canvas.offset / 2, tempYHeight, '#000')
			this.context.textAlign = 'right'
			this.drawAxis([canvasOffset, tempYHeight], [halfCanvasOffset, tempYHeight])
		}
	}
	/**
	 * 获取每个柱状图数据的数组
	 *
	 * @param {IOption} option
	 * @param {[number, number]} canvasSize
	 * @returns
	 * @memberof Chart
	 */
	getRectArray(option: IOption, canvasSize: [number, number]) {
		const data = option.data
		const chartSize = this.getChartSize(option, canvasSize)
		const width = chartSize[1] / data.xAxis.length
		// 柱状图空白部分
		const offset = width * (option.chart.xOffset / 100)
		const [maxValue, realNumberCount] = this.getRealNumCount(data.yAxis)
		const partCount = Math.ceil(maxValue / Math.pow(10, realNumberCount - 1))
		// y轴最大值的近似整十、整百数....
		const yAxisMaxValue = partCount * Math.pow(10, realNumberCount - 1)
		const rects = []
		const yStart = chartSize[0] + option.canvas.offset
		const blockWidth = width - (2 * offset)
		data.yAxis.map((value: number, index: number) => {
			const xStart = option.canvas.offset + width * index + offset
			const blockHeight = chartSize[0] * (value / yAxisMaxValue)
			const rect = {
				x: xStart,
				y: yStart,
				w: blockWidth,
				h: blockHeight,
			}
			rects.push(rect)
		})
		return rects
	}
	/**
	 * 获取真实画图画布的大小
	 *
	 * @param {IOption} option
	 * @param {[number, number]} canvasSize
	 * @returns {[number, number]} [height, width]
	 * @memberof Chart
	 */
	getChartSize(option: IOption, canvasSize: [number, number]): [number, number] {
		const canvasOffset = option.canvas.offset
		return [canvasSize[0] - canvasOffset * 2, canvasSize[1] - option.canvas.offset * 2]
	}
	/**
	 * 获取数据的最大值和最大值的实数部分的长度
	 *
	 * @param {number[]} yAxisData
	 * @returns {[number, number]}
	 * @memberof Chart
	 */
	getRealNumCount(yAxisData: number[]): [number, number] {
		const maxValue = Math.max(...yAxisData)
		const maxValueString = maxValue.toString()
		let realNumberCount = 0 // 实数部分的长度
		// Bug科学计数法Math.flow
		if (maxValueString.indexOf('.') === -1) {
			realNumberCount = maxValueString.length
		} else {
			realNumberCount = maxValueString.split('.')[0].length
		}
		return [maxValue, realNumberCount]
	}
	/**
	 * 计算 canvas 画布的大小
	 *
	 * @param {HTMLCanvasElement} canvas
	 * @returns [height, width]
	 * @memberof Chart
	 */
	calcChartSize(canvas: HTMLCanvasElement): [number, number] {
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
		this.context.strokeStyle = 'black'
		this.context.lineWidth = 1

		this.context.lineCap = 'round'
		this.context.moveTo(start[0], start[1])
		this.context.lineTo(end[0], end[1])
		this.context.stroke()
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
	drawText(text: string, x: number, y: number, color: string = '#333', size: number = 16, fontStyle: string = 'Arial') {
		this.context.save()
		this.context.font = `${size}px ${fontStyle}`
		this.context.fillStyle = color
		this.context.fillText(text, x, y + (size / 2))
	}
	/**
	 * 画图表矩形
	 *
	 * @param {number} x 横坐标
	 * @param {number} y 纵坐标
	 * @param {number} width 矩形宽度
	 * @param {number} height 矩形高度
	 * @param {string} color 填充颜色
	 * @memberof Chart
	 */
	drawRect(x: number, y: number, width: number, height: number, color: string) {
		this.context.save()
		this.context.fillStyle = color
		this.context.fillRect(x, y, width, height)
	}
}

export default Chart
