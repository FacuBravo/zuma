const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const music = new Audio('assets/audio/music.mp3')
const shotSound = new Audio('assets/audio/shot.mp3')
const introSound = new Audio('assets/audio/introduction_sound.mp3')
const destroyBall1 = new Audio('assets/audio/ball_destroy_1.mp3')

music.volume = 0.5
music.loop = true

window.addEventListener('resize', adjustCanvasSize)
canvas.addEventListener('mousemove', updateMousePosition)
canvas.addEventListener('click', shootBall)
canvas.addEventListener('contextmenu', changeColor)
document.querySelector("#play_button").addEventListener("click", playGame)
adjustCanvasSize()

const frogImg = new Image()
frogImg.src = 'assets/imgs/frog.png'
const imageSizeWidth = 143
const imageSizeHeight = 170

let mouseX = canvas.width / 2, mouseY = 0

const mouthOffsetX = 45, mouthOffsetY = 0
const nextOffsetX = -36, nextOffsetY = 0
let drawStaticBall = true

let isShotted = false, shotAngle = 0, shooting = false
let canShoot = true
let ballX = 0, ballY = 0
let toShot = []

const possibleColors = ['#FE284A', '#1673FE', '#E2C607', '#BC5AF5', '#93F328', '#908F98']
let colorNext = pickColor(), currentColor = pickColor(), shootedColor = currentColor
let colorsSetted = true

let levelBalls = [
    {
        x: 800,
        y: 300,
        leftExtreme: 800 - 20,
        rightExtreme: 800 + 20,
        topExtreme: 300 - 20,
        bottomExtreme: 300 + 20,
        color: pickColor()
    },
    {
        x: 50,
        y: 300,
        leftExtreme: 50 - 20,
        rightExtreme: 50 + 20,
        topExtreme: 300 - 20,
        bottomExtreme: 300 + 20,
        color: pickColor()
    },
    {
        x: 500,
        y: 50,
        leftExtreme: 500 - 20,
        rightExtreme: 500 + 20,
        topExtreme: 50 - 20,
        bottomExtreme: 50 + 20,
        color: pickColor()
    },
    {
        x: 500,
        y: 600,
        leftExtreme: 500 - 20,
        rightExtreme: 500 + 20,
        topExtreme: 600 - 20,
        bottomExtreme: 600 + 20,
        color: pickColor()
    }
]

function drawFrogWithBall(x, y, angle) {
    ctx.save()
    ctx.translate(x + imageSizeWidth / 2, y + imageSizeHeight / 2)
    ctx.rotate(angle)
    ctx.shadowColor = "#000000ad"
    ctx.shadowOffsetX = 7
    ctx.shadowOffsetY = 7
    ctx.drawImage(frogImg, -imageSizeWidth / 2, -imageSizeHeight / 2, imageSizeWidth, imageSizeHeight)
    ctx.restore()
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

    drawBall(shot.x, shot.y, shot.color, 20)

    if (shot.x < canvas.width + 20 && shot.x > -35) {
        shot.x += 22 * Math.cos(shot.angle)
        shot.leftExtreme = shot.x - 20
        shot.rightExtreme = shot.x + 20
    } else {
        deleted = true
        toShot.splice(shotIndex, 1)
    }

    if (!deleted) {
        if (shot.y < canvas.height + 20 && shot.y > -35) {
            shot.y += 22 * Math.sin(shot.angle)
            shot.topExtreme = shot.y - 20
            shot.bottomExtreme = shot.y + 20
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

            if (ball.color == shot.color) {
                destroyBalls(i)
            } else {
                levelBalls.splice(i, 0, {
                    x: shot.x,
                    y: shot.y,
                    leftExtreme: shot.leftExtreme,
                    rightExtreme: shot.rightExtreme,
                    topExtreme: shot.topExtreme,
                    bottomExtreme: shot.bottomExtreme,
                    color: shot.color
                })
            }

            return
        }
    }
}

function drawLevelBalls() {
    for (const ball of levelBalls) {
        drawBall(ball.x, ball.y, ball.color, 20)
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

    drawFrogWithBall(imageX, imageY, angle)

    if (drawStaticBall) {
        drawBall(staticBallX, staticBallY, currentColor, 20)
    }

    let nextBallX = (imageX + imageSizeWidth / 2) + nextOffsetX * Math.cos(angle) - nextOffsetY * Math.sin(angle)
    let nextBallY = (imageY + imageSizeHeight / 2) + nextOffsetX * Math.sin(angle) + nextOffsetY * Math.cos(angle)

    drawBall(nextBallX, nextBallY, colorNext, 10)
    drawLevelBalls()

    requestAnimationFrame(draw)
}

function shootBall() {
    if (canShoot) {
        toShot.push({
            x: ballX,
            y: ballY,
            leftExtreme: ballX - 20,
            rightExtreme: ballX + 20,
            topExtreme: ballY - 20,
            bottomExtreme: ballY + 20,
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

function destroyBalls(index) {
    destroyBall1.currentTime = 0
    destroyBall1.play()
    levelBalls.splice(index, 1)
}

function pickColor() {
    let randomN = Math.trunc(Math.random() * possibleColors.length)
    return possibleColors[randomN]
}

function adjustCanvasSize() {
    canvas.width = window.innerWidth - 1
    canvas.height = window.innerHeight - 4
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
    introSound.play()
}