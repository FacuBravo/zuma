const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const music = new Audio('assets/audio/music.mp3')
const shotSound = new Audio('assets/audio/shot.mp3')
const ballsRounding = new Audio('assets/audio/balls_rounding.mp3')
const destroyBall1 = new Audio('assets/audio/ball_destroy_1.mp3')

music.volume = 0.3
music.loop = true

window.addEventListener('resize', adjustCanvasSize)
canvas.addEventListener('mousemove', updateMousePosition)
canvas.addEventListener('click', shootBall)
canvas.addEventListener('contextmenu', changeColor)
document.querySelector("#play_button").addEventListener("click", playGame)

const frogImg = new Image()
frogImg.src = 'assets/imgs/frog.png'
const skullImg = new Image()
skullImg.src = 'assets/imgs/skull.png'
const skullImgDanger = new Image()
skullImgDanger.src = 'assets/imgs/skull_danger.png'
const skullImgLose = new Image()
skullImgLose.src = 'assets/imgs/skull_lose.png'
const imageSizeWidth = 143
const imageSizeHeight = 170
const imageSkullSize = 120
let ballRadius

adjustCanvasSize()

let extremeDanger = false, danger = false

let mouseX = canvas.width / 2, mouseY = 0

const mouthOffsetX = 45, mouthOffsetY = 0
const nextOffsetX = -36, nextOffsetY = 0
let drawStaticBall = true

let isShotted = false, shotAngle = 0, shooting = false, shotSpeed = 20
let canShoot = true
let ballX = 0, ballY = 0
let toShot = []

// const possibleColors = ['#FE284A', '#1673FE', '#E2C607', '#BC5AF5', '#93F328', '#908F98']
const possibleColors = ['red', 'green', 'blue']
let ballColors = []
let colorNext = pickColor(), currentColor = pickColor(), shootedColor = currentColor
let colorsSetted = true

let ballsCordinates = [
    [0.71, 0.36],
    [0.71, 0.416],
    [0.71, 0.472],
    [0.71, 0.528],
    [0.707, 0.584],
    [0.704, 0.640],
    [0.698, 0.696],
    [0.682, 0.741],
    [0.658, 0.765],
    [0.6315, 0.77],
    [0.6055, 0.77],
    [0.5795, 0.77],
    [0.5535, 0.77],
    [0.5275, 0.77],
    [0.5015, 0.77],
    [0.4755, 0.77],
    [0.4495, 0.77],
    [0.4235, 0.77],
    [0.3975, 0.77],
    [0.3715, 0.76],
    [0.349, 0.73],
    [0.34, 0.675],
    [0.336, 0.619],
    [0.336, 0.562],
    [0.336, 0.505],
    [0.336, 0.448],
    [0.336, 0.391],
    [0.336, 0.334],
    [0.342, 0.278],
    [0.36, 0.235],
    [0.385, 0.215],
    [0.411, 0.205],
    [0.437, 0.205],
    [0.463, 0.205],
    [0.489, 0.205],
    [0.515, 0.205],
    [0.541, 0.205],
    [0.567, 0.205],
    [0.593, 0.205],
    [0.619, 0.21],
    [0.645, 0.215],
    [0.671, 0.22],
    [0.697, 0.225],
    [0.723, 0.23],
    [0.749, 0.235],
    [0.775, 0.24],
    [0.795, 0.279],
    [0.797, 0.335],
    [0.797, 0.391],
    [0.797, 0.447],
    [0.798, 0.503],
    [0.799, 0.559],
    [0.8, 0.615],
    [0.802, 0.671],
    [0.799, 0.727],
    [0.797, 0.783],
    [0.795, 0.839],
    [0.789, 0.895],
    [0.768, 0.93],
    [0.742, 0.94],
    [0.716, 0.942],
    [0.69, 0.942],
    [0.664, 0.945],
    [0.638, 0.947],
    [0.612, 0.949],
    [0.586, 0.955],
    [0.560, 0.96],
    [0.534, 0.96],
    [0.508, 0.96],
    [0.482, 0.96],
    [0.456, 0.96],
    [0.43, 0.96],
    [0.404, 0.96],
    [0.378, 0.96],
    [0.352, 0.96],
    [0.326, 0.96],
    [0.3, 0.96],
    [0.274, 0.96],
    [0.248, 0.955],
    [0.225, 0.93],
    [0.21, 0.882],
    [0.206, 0.826],
    [0.206, 0.77],
    [0.206, 0.714],
    [0.208, 0.658],
    [0.21, 0.602],
    [0.212, 0.546],
    [0.212, 0.49],
    [0.212, 0.434],
    [0.212, 0.378],
    [0.212, 0.322],
    [0.212, 0.266],
    [0.212, 0.21],
    [0.212, 0.154]
]
let levelBalls = [], levelBallsFrezzed = [], count = 0
let currentProgress = 0
let interpolationSpeed = 0.8

function drawFrog(x, y, angle) {
    ctx.save()
    ctx.translate(x + imageSizeWidth / 2, y + imageSizeHeight / 2)
    ctx.rotate(angle)
    ctx.shadowColor = "#000000ad"
    ctx.shadowOffsetX = 7
    ctx.shadowOffsetY = 7
    ctx.drawImage(frogImg, -imageSizeWidth / 2, -imageSizeHeight / 2, imageSizeWidth, imageSizeHeight)
    ctx.restore()
}

function drawSkull() {
    let x = ballsCordinates[ballsCordinates.length - 1][0] * canvas.width - imageSkullSize / 2

    if (!extremeDanger && !danger) {
        let y = ballsCordinates[ballsCordinates.length - 1][1] * canvas.height - imageSkullSize / 2 - 30
        ctx.drawImage(skullImg, x, y, imageSkullSize, imageSkullSize)
    } else if (!extremeDanger && danger) {
        let y = ballsCordinates[ballsCordinates.length - 1][1] * canvas.height - 140 / 2 - 30
        ctx.drawImage(skullImgDanger, x, y, imageSkullSize, imageSkullSize)
    } else {
        let y = ballsCordinates[ballsCordinates.length - 1][1] * canvas.height - 140 / 2 - 30
        ctx.drawImage(skullImgLose, x, y, imageSkullSize, imageSkullSize)
    }
}

function drawBall(x, y, colour, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = colour
    ctx.fill()
    ctx.closePath()
}

function drawShootedBall(shotIndex) {
    isShotted = false
    let deleted = false
    let shot = toShot[shotIndex]

    detectCollisions(shotIndex)

    drawBall(shot.x, shot.y, shot.color, ballRadius)

    if (shot.x < canvas.width + ballRadius && shot.x > -ballRadius) {
        shot.x += shotSpeed * Math.cos(shot.angle)
        shot.leftExtreme = shot.x - ballRadius
        shot.rightExtreme = shot.x + ballRadius
    } else {
        deleted = true
        toShot.splice(shotIndex, 1)
    }

    if (!deleted) {
        if (shot.y < canvas.height + ballRadius && shot.y > -ballRadius) {
            shot.y += shotSpeed * Math.sin(shot.angle)
            shot.topExtreme = shot.y - ballRadius
            shot.bottomExtreme = shot.y + ballRadius
        } else {
            toShot.splice(shotIndex, 1)
        }
    }
}

function detectCollisions(shotIndex) {
    let shot = toShot[shotIndex]

    for (let i = 0; i < levelBalls.length; i++) {
        let ball = levelBalls[i]

        if ((shot.leftExtreme <= ball.rightExtreme && shot.rightExtreme >= ball.leftExtreme) && (shot.topExtreme <= ball.bottomExtreme && shot.bottomExtreme >= ball.topExtreme)) {
            toShot.splice(shotIndex, 1)

            let insertAt
            if (shot.rightExtreme < ball.rightExtreme) {
                insertAt = 'l'
            } else {
                insertAt = 'r'
            }
            insertLevelBall(i, shot.color, insertAt)

            return
        }
    }
}

function insertLevelBall(index, color, insertAt) {
    if (destroyBalls(index, color)) {
        return
    }

    count++
    const currentCordinates = ballsCordinates[index]
    let currentX = currentCordinates[0] * canvas.width
    let currentY = currentCordinates[1] * canvas.height
    let nBall

    switch (insertAt) {
        case 'l':
            for (let i = index; i < levelBalls.length; i++) {
                let cordinates = ballsCordinates[i + 1]
                let x = cordinates[0] * canvas.width
                let y = cordinates[1] * canvas.height
                levelBalls[i].x = x
                levelBalls[i].y = y
            }

            nBall = {
                x: currentX,
                y: currentY,
                leftExtreme: currentX - ballRadius,
                rightExtreme: currentX + ballRadius,
                topExtreme: currentY - ballRadius,
                bottomExtreme: currentY + ballRadius,
                color: color
            }

            levelBalls.splice(index, 0, nBall)
            ballColors.splice(ballColors.length - 1 - index, 0, color)
            break;
        default:
            let cordinates = ballsCordinates[index + 1]
            let x = cordinates[0] * canvas.width
            let y = cordinates[1] * canvas.height
            nBall = {
                x: x,
                y: y,
                leftExtreme: x - ballRadius,
                rightExtreme: x + ballRadius,
                topExtreme: y - ballRadius,
                bottomExtreme: y + ballRadius,
                color: color
            }
            levelBalls.splice(index, 0, nBall)
            ballColors.splice(ballColors.length - 1 - index, 0, color)
            break;
    }
}

function detectSkullDanger() {
    if (count == ballsCordinates.length - 1) {
        alert("GAME OVER")
        count++
    } else if (count >= ballsCordinates.length - 4) {
        extremeDanger = true
    } else if (count >= ballsCordinates.length - 13) {
        danger = true
    } else {
        extremeDanger = false
        danger = false
    }
}

function drawLevelBalls() {
    detectSkullDanger()

    if (count < ballsCordinates.length - 1) {
        if (currentProgress == 0) {
            ballColors.push(pickColor())
        }

        let currentCordinate = ballsCordinates[count]
        let nextCordinate = ballsCordinates[count + 1]

        let x = (1 - currentProgress) * currentCordinate[0] * canvas.width + currentProgress * nextCordinate[0] * canvas.width
        let y = (1 - currentProgress) * currentCordinate[1] * canvas.height + currentProgress * nextCordinate[1] * canvas.height
        let leftExtreme = x - ballRadius                
        let rightExtreme = x + ballRadius                
        let topExtreme = y - ballRadius            
        let bottomExtreme = y + ballRadius            

        joinFrezzedBalls(leftExtreme, rightExtreme, topExtreme, bottomExtreme)

        levelBalls[count] = {
            x: x,
            y: y,
            leftExtreme: leftExtreme,
            rightExtreme: rightExtreme,
            topExtreme: topExtreme,
            bottomExtreme: bottomExtreme,
            color: ballColors[0]
        }

        for (let i = 0; i < levelBalls.length - 1; i++) {
            let currentCordinate = ballsCordinates[i]
            let nextCordinate = ballsCordinates[i + 1]

            let x = (1 - currentProgress) * currentCordinate[0] * canvas.width + currentProgress * nextCordinate[0] * canvas.width
            let y = (1 - currentProgress) * currentCordinate[1] * canvas.height + currentProgress * nextCordinate[1] * canvas.height

            levelBalls[i] = {
                x: x,
                y: y,
                leftExtreme: x - ballRadius,
                rightExtreme: x + ballRadius,
                topExtreme: y - ballRadius,
                bottomExtreme: y + ballRadius,
                color: ballColors[ballColors.length - 1 - i]
            }
        }

        currentProgress += interpolationSpeed

        if (currentProgress >= 1) {
            currentProgress = 0
            count++

            if (count == 31) {
                interpolationSpeed = 0.01
                ballsRounding.pause()
            }
        }
    }

    for (const ball of levelBalls) {
        drawBall(ball.x, ball.y, ball.color, ballRadius)
    }
}

function joinFrezzedBalls(leftExtreme, rightExtreme, topExtreme, bottomExtreme) {
    if (levelBallsFrezzed.length > 0) {
        if ((leftExtreme <= levelBallsFrezzed[0][0].rightExtreme && rightExtreme >= levelBallsFrezzed[0][0].leftExtreme) && (topExtreme <= levelBallsFrezzed[0][0].bottomExtreme && bottomExtreme >= levelBallsFrezzed[0][0].topExtreme)) {
            while (levelBallsFrezzed[0].length > 0) {
                levelBalls.push(levelBallsFrezzed[0][0])
                ballColors.splice(0, 0, levelBallsFrezzed[0][0].color)
                count++
                levelBallsFrezzed[0].splice(0, 1)
            }
            levelBallsFrezzed.splice(0, 1)
        }
    }
}

function draw() {
    clear()

    const imageX = canvas.width / 2 - imageSizeWidth / 2
    const imageY = canvas.height / 2 - imageSizeHeight / 2

    const dx = mouseX - (imageX + imageSizeWidth / 2)
    const dy = mouseY - (imageY + imageSizeHeight / 2)
    const angle = Math.atan2(dy, dx)

    let staticBallX = (imageX + imageSizeWidth / 2) + mouthOffsetX * Math.cos(angle) - mouthOffsetY * Math.sin(angle)
    let staticBallY = (imageY + imageSizeHeight / 2) + mouthOffsetX * Math.sin(angle) + mouthOffsetY * Math.cos(angle)

    if (!isShotted) {
        shotAngle = angle
        ballX = staticBallX
        ballY = staticBallY
    }

    if (toShot.length > 0) {
        for (let i = 0; i < toShot.length; i++) {
            drawShootedBall(i)
        }
    }

    drawFrog(imageX, imageY, angle)
    drawSkull(250, 25)

    if (drawStaticBall) {
        drawBall(staticBallX, staticBallY, currentColor, ballRadius)
    }

    let nextBallX = (imageX + imageSizeWidth / 2) + nextOffsetX * Math.cos(angle) - nextOffsetY * Math.sin(angle)
    let nextBallY = (imageY + imageSizeHeight / 2) + nextOffsetX * Math.sin(angle) + nextOffsetY * Math.cos(angle)

    drawBall(nextBallX, nextBallY, colorNext, 10)
    drawLevelBalls()

    for (const frezzedBall1 of levelBallsFrezzed) {
        for (const frezzedBall of frezzedBall1) {
            drawBall(frezzedBall.x, frezzedBall.y, frezzedBall.color, ballRadius)
        }
    }

    requestAnimationFrame(draw)
}

function shootBall() {
    if (canShoot) {
        toShot.push({
            x: ballX,
            y: ballY,
            leftExtreme: ballX - ballRadius,
            rightExtreme: ballX + ballRadius,
            topExtreme: ballY - ballRadius,
            bottomExtreme: ballY + ballRadius,
            angle: shotAngle,
            color: currentColor
        })

        isShotted = true
        drawStaticBall = false

        canShoot = false
        setTimeout(() => {
            canShoot = true
            drawStaticBall = true
        }, 200)
        shotSound.currentTime = 0
        shotSound.play()
        currentColor = colorNext
        colorNext = pickColor()
    }
}

function changeColor(e) {
    e.preventDefault()

    let aux = currentColor
    currentColor = colorNext
    colorNext = aux
}

function destroyBalls(index, color) {
    let toDeleteCount = 1, i = index, stop = false, indexToDelete = -1

    while (levelBalls[i] && !stop) {
        if (levelBalls[i].color == color) {
            toDeleteCount++
            if (indexToDelete > i || indexToDelete == -1) {
                indexToDelete = i
            }
        } else {
            stop = true
        }
        i--
    }

    i = index + 1, stop = false

    while (levelBalls[i] && !stop) {
        if (levelBalls[i].color == color) {
            toDeleteCount++
            if (indexToDelete > i || indexToDelete == -1) {
                indexToDelete = i
            }
        } else {
            stop = true
        }
        i++
    }

    if (toDeleteCount >= 3) {
        destroyBall1.currentTime = 0
        destroyBall1.play()
        let quantity = levelBalls.length - indexToDelete
        let aux = []

        for (let j = indexToDelete + toDeleteCount - 1; j < levelBalls.length; j++) {
            aux.push(levelBalls[j])
        }

        if (aux.length > 0) {
            levelBallsFrezzed.splice(0, 0, aux)
        }
            

        ballColors.splice(0, quantity)
        levelBalls.splice(indexToDelete, quantity)
        count -= quantity

        return true
    }

    return false
}

function pickColor() {
    let randomN = Math.trunc(Math.random() * possibleColors.length)
    return possibleColors[randomN]
}

function adjustCanvasSize() {
    canvas.width = window.innerWidth - 1
    canvas.height = window.innerHeight - 4

    if (canvas.width > 1800) {
        ballRadius = 26
    } else {
        ballRadius = 20
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function updateMousePosition(event) {
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
}
playGame()
function playGame() {
    draw()
    document.querySelector("#cover").classList.add("hide")
    music.play()
    ballsRounding.play()
}