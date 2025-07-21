// main.js - Flappy Bird Clone

class Game {
  constructor(canvasId) {
    // Get canvas element and verify it exists
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    // Initialize 2D rendering context and verify functionality
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('2D rendering context not supported');
    }

    // Game state properties
    this.isRunning = false;
    this.lastTime = 0;

    // Initialize bird (positioned center-left as per requirements)
    this.bird = new Bird(80, 300);

    // Initialize input manager
    this.inputManager = new InputManager(this.canvas);

    // Bind methods to maintain context
    this.gameLoop = this.gameLoop.bind(this);
  }

  init() {
    // Verify canvas functionality by drawing a test rectangle
    this.ctx.fillStyle = '#70c5ce';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    console.log('Game initialized successfully');
    console.log(`Canvas dimensions: ${this.canvas.width}x${this.canvas.height}`);
  }



  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastTime = performance.now();
    console.log('Game started');

    // Start the game loop
    requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.isRunning = false;
    console.log('Game stopped');
  }

  gameLoop(currentTime) {
    if (!this.isRunning) {
      return;
    }

    // Calculate delta time in milliseconds
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update game state
    this.update(deltaTime);

    // Render game
    this.render();

    // Continue the loop
    requestAnimationFrame(this.gameLoop);
  }

  update(deltaTime) {
    // Handle input for bird jumping
    if (this.inputManager.isJumpPressed()) {
      this.bird.jump();
    }

    // Update bird physics
    this.bird.update(deltaTime);

    // Check boundary collisions (requirements 1.4)
    if (this.bird.isAtTopBoundary() || this.bird.isAtBottomBoundary(this.canvas.height)) {
      console.log('Bird hit boundary - game should end');
      // Game over logic will be implemented in future tasks
    }
  }

  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set background color
    this.ctx.fillStyle = '#70c5ce';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render bird
    this.bird.render(this.ctx);

    // Render debug info (temporary)
    this.ctx.fillStyle = '#000';
    this.ctx.font = '12px Arial';
    this.ctx.fillText(`Bird Y: ${Math.round(this.bird.y)}`, 10, 20);
    this.ctx.fillText(`Bird VY: ${Math.round(this.bird.vy * 10) / 10}`, 10, 35);
    this.ctx.fillText(`Rotation: ${Math.round(this.bird.rotation * 180 / Math.PI)}°`, 10, 50);
  }
}

// Initialize and start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  try {
    const game = new Game('gameCanvas');
    game.init();
    game.start();
  } catch (error) {
    console.error('Failed to initialize game:', error.message);
  }
}); 