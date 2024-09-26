// ... (previous code remains largely unchanged)

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
    rotation: 0
}

// ... (other variables and functions remain the same)

const MAX_ROTATION_SPEED = 0.05;
const ROTATION_THRESHOLD = 0.5; // Adjust this value to control when rotation starts

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.rotation = Math.min(MAX_ROTATION_SPEED, bird.rotation + velocityY / 50); // Limit rotation speed
    
    // Apply rotation only when jumping
    if (velocityY < 0) {
        bird.y = Math.max(bird.y + velocityY, 0);
        
        // Apply rotation
        context.save();
        context.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
        context.rotate(bird.rotation);
        context.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
        context.restore();
    } else {
        // When falling, reset rotation and position
        bird.rotation = 0;
        bird.y = Math.max(bird.y + velocityY, 0);
    }

    // Check collision with pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        
        // Draw pipes
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Check collision
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function detectCollision(a, b) {
    let angle = Math.atan2(b.y - a.y, b.x - a.x);
    let distance = Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
    
    return distance <= (a.width / 2 + b.width / 2) &&
           Math.abs(angle - a.rotation) <= Math.PI / 8 &&
           Math.abs(angle - b.rotation) <= Math.PI / 8;
}
