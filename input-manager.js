// input-manager.js - Input handling for Flappy Bird game

class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.jumpPressed = false;
    this.lastJumpTime = 0;
    this.jumpCooldown = 100; // Minimum time between jumps in milliseconds
    
    // Bind event handlers to maintain context
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    
    // Only bind events if we're in a browser environment
    if (typeof document !== 'undefined') {
      this.bindEvents();
    }
  }

  bindEvents() {
    // Keyboard event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Mouse event listeners
    this.canvas.addEventListener('click', this.handleMouseClick);
    
    // Prevent context menu on right click
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  handleKeyDown(event) {
    // Handle spacebar and arrow keys for jumping
    if (event.code === 'Space' || 
        event.code === 'ArrowUp' || 
        event.key === ' ' || 
        event.key === 'ArrowUp') {
      
      this.processJumpInput();
      event.preventDefault(); // Prevent default browser behavior
    }
  }

  handleMouseClick(event) {
    // Handle mouse clicks for jumping
    if (event.button === 0) { // Left mouse button
      this.processJumpInput();
      event.preventDefault();
    }
  }

  processJumpInput() {
    const currentTime = performance.now();
    
    // Prevent input spam by enforcing cooldown
    if (currentTime - this.lastJumpTime >= this.jumpCooldown) {
      this.jumpPressed = true;
      this.lastJumpTime = currentTime;
    }
  }

  isJumpPressed() {
    // Return and reset jump state
    const wasPressed = this.jumpPressed;
    this.jumpPressed = false;
    return wasPressed;
  }

  reset() {
    // Reset input state
    this.jumpPressed = false;
    this.lastJumpTime = 0;
  }

  // Clean up event listeners
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('click', this.handleMouseClick);
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputManager;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.InputManager = InputManager;
}