const main = (canvas) => {
	const width = 400
	const height = 400
	const ctx = canvas.getContext('2d')
	const imgData = ctx.getImageData(0, 0, width, height)
	let isWriteDown = false
	let count = 0

	// 改变像素块颜色
	const setPixelColor = (x, y, color, size = 2) => {
		// console.log('x', x, 'y', y)
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				imgData.data[((y + i) * width + x + j) * 4] = color.r
				imgData.data[((y + i) * width + x + j) * 4 + 1] = color.g
				imgData.data[((y + i) * width + x + j) * 4 + 2] = color.b
				imgData.data[((y + i) * width + x + j) * 4 + 3] = color.a
			}
		}
	}

	// 对称复制线条
	const setSymmetryPixel = (x, y, color, width = 400, height = 400) => {
		count++
		if (count > 255 * 3) count = 0
		if (count < 255) {
			color.r = count
			color.g = 0
			color.b = 0
		}
		if (count > 255 && count < 255 * 2) {
			color.r = 0
			color.g = count - 255
			color.b = 0
		}
		if (count > 255 * 2) {
			color.r = 0
			color.g = 0
			color.b = count - 255 * 2
		}
		setPixelColor(x, y, color)
		setPixelColor(width - x, height - y, color)
		setPixelColor(width - x, y, color)
		setPixelColor(x, height - y, color)

		// setPixelColor(x, y, color)
		// const pixel = rotatePoint({ x, y }, { x: 200, y: 200 }, 90)
		// setPixelColor(pixel.x, pixel.y, color)
		// ctx.rotate(90 * Math.PI / 180)
		// ctx.putImageData(imgData, 0, 0)
	}

	// const rotate = (source, angle) => {
	//   let a = Math.atan2(source.y, source.x) // atan2自带坐标系识别, 注意X,Y的顺序
	//   a += angle // 旋转
	//   const r = Math.sqrt(source.x * source.x + source.y * source.y) // 半径
	//   return {
	//     x: Math.cos(a) * r,
	//     y: Math.sin(a) * r
	//   }
	// }
	//
	// console.log('rotate', rotate({ x: 2, y: 6 }, 180))

	// const rotatePoint = (ptSrt, ptRotationCenter, angle) => {
	//   const a = ptRotationCenter.x
	//   const b = ptRotationCenter.y
	//   const x0 = ptSrt.x
	//   const y0 = ptSrt.y
	//   const rx = a + (x0 - a) * Math.cos(angle * Math.PI / 180) - (y0 - b) * Math.sin(angle * Math.PI / 180)
	//   const ry = a + (x0 - a) * Math.cos(angle * Math.PI / 180) + (y0 - b) * Math.sin(angle * Math.PI / 180)
	//   return {
	//     x: rx,
	//     y: ry
	//   }
	// }

	// console.log('rotatePoint', rotatePoint({ x: 2, y: 6 }, { x: 0, y: 0 }, 0))

	// 已知角度和斜边，求直角边
	// const hypotenuse = (long, angle) => {
	//   const radian = 2 * Math.PI / 360 * angle
	//   return {
	//     a: Math.sin(radian) * long,
	//     b: Math.cos(radian) * long
	//   }
	// }

	ctx.putImageData(imgData, 0, 0)

	const oLayer = { x: 0, y: 0 }
	canvas.onmousedown = (e) => {
		isWriteDown = true
		oLayer.x = e.layerX
		oLayer.y = e.layerY
	}
	canvas.onmouseup = () => {
		isWriteDown = false
	}

	// console.log('hypotenuse', hypotenuse(5, 53))
	// 36.8698976 °，53.1301024°，90°

	canvas.onmousemove = (e) => {
		if (!isWriteDown) return false
		const color = { r: 111, g: 111, b: 227, a: 130 }
		// 使线条保持连贯
		const _xa = [e.layerX, oLayer.x].sort((a, b) => a - b)
		const _ya = [e.layerY, oLayer.y].sort((a, b) => a - b)
		if (_xa[1] - _xa[0] > _ya[1] - _ya[0]) {
			for (let i = 0; i < (_xa[1] - _xa[0]); i++) {
				const x = oLayer.x > e.layerX ? oLayer.x - i : oLayer.x + i
				const y = oLayer.y > e.layerY ? Number((oLayer.y - (_ya[1] - _ya[0]) / (_xa[1] - _xa[0]) * i).toFixed(0)) : Number((oLayer.y + (_ya[1] - _ya[0]) / (_xa[1] - _xa[0]) * i).toFixed(0))
				setSymmetryPixel(x, y, color)
			}
		} else {
			for (let i = 0; i < (_ya[1] - _ya[0]); i++) {
				const x = oLayer.x > e.layerX ? Number((oLayer.x - (_xa[1] - _xa[0]) / (_ya[1] - _ya[0]) * i).toFixed(0)) : Number((oLayer.x + (_xa[1] - _xa[0]) / (_ya[1] - _ya[0]) * i).toFixed(0))
				const y = oLayer.y > e.layerY ? oLayer.y - i : oLayer.y + i
				setSymmetryPixel(x, y, color)
			}
		}
		// ctx.rotate(45 * Math.PI / 180)
		ctx.putImageData(imgData, 0, 0)

		oLayer.x = e.layerX
		oLayer.y = e.layerY
	}

	return false
}

module.exports = main
