function shuffleAnimation() {
    if (!window.stars || !window.stars.geometry) return;

    let positions = window.stars.geometry.attributes.position.array;
    let velocities = window.stars.geometry.attributes.velocity.array;
    let startPositions = window.stars.geometry.attributes.startPosition.array;

    for (let i = 0; i < positions.length; i += 3) {

        positions[i] = startPositions[i];
        positions[i + 1] = startPositions[i + 1];
        positions[i + 2] = startPositions[i + 2];

        velocities[i / 3] = THREE.MathUtils.randInt(100, 500);
    }

    window.stars.geometry.attributes.position.needsUpdate = true;
    window.stars.geometry.attributes.velocity.needsUpdate = true;

    let originalSpeed = window.starSpeed;
    window.starSpeed = 5;

    document.querySelector('.aurora-container').style.opacity = '1';
    
    setTimeout(() => {
        window.starSpeed = originalSpeed;
        document.querySelector('.aurora-container').style.opacity = '0.8';
    }, 2000);
}

window.shuffleAnimation = shuffleAnimation;