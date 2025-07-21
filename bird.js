// bird.js - Bird class for Flappy Bird game

class Bird {
  constructor(x, y) {
    // Position properties
    this.x = x;
    this.y = y;
    
    // Velocity properties
    this.vx = 0;
    this.vy = 0;
    
    // Size properties
    this.width = 34;
    this.height = 24;
    
    // Physics constants
    this.gravity = 0.5;
    this.jumpStrength = -8;
    this.terminalVelocity = 8;
    
    // Visual properties
    this.rotation = 0;
    this.color = '#FFD700'; // Gold color for the bird
  }

  update(deltaTime) {
    // Apply gravity to vertical velocity
    this.vy += this.gravity;
    
    // Limit terminal velocity
    if (this.vy > this.terminalVelocity) {
      this.vy = this.terminalVelocity;
    }
    
    // Update position based on velocity
    this.x += this.vx;
    this.y += this.vy;
    
    // Update rotation based on velocity for visual feedback
    // Falling: rotate downward, Jumping: rotate upward
    if (this.vy > 0) {
      // Falling - rotate downward (max 45 degrees)
      this.rotation = Math.min(this.vy * 0.1, Math.PI / 4);
    } else {
      // Jumping - rotate upward (max -30 degrees)
      this.rotation = Math.max(this.vy * 0.1, -Math.PI / 6);
    }
  }

  render(ctx) {
    ctx.save();
    
    // Translate to bird center for rotation
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    
    // Draw bird as a simple rectangle
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    // Add a simple eye for visual appeal
    ctx.fillStyle = '#000';
    ctx.fillRect(-this.width / 4, -this.height / 4, 4, 4);
    
    ctx.restore();
  }

  jump() {
    // Apply jump velocity
    this.vy = this.jumpStrength;
  }

  reset() {
    // Reset bird to initial position and state
    this.x = 80;
    this.y = 300;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
  }

  getBounds() {
    // Return collision bounds for the bird
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      centerX: this.x + this.width / 2,
      centerY: this.y + this.height / 2
    };
  }

  // Check if bird is at screen boundaries
  isAtTopBoundary() {
    return this.y <= 0;
  }

  isAtBottomBoundary(screenHeight) {
    return this.y + this.height >= screenHeight;
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Bird;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.Bird = Bird;
}