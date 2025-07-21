// bird.test.js - Unit tests for Bird class physics

// Import Bird class for Node.js testing
const Bird = require('./bird.js');

// Simple test framework for browser environment
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  run() {
    console.log('Running Bird Physics Tests...\n');
    
    this.tests.forEach(({ name, testFn }) => {
      try {
        testFn();
        console.log(`✓ ${name}`);
        this.passed++;
      } catch (error) {
        console.error(`✗ ${name}: ${error.message}`);
        this.failed++;
      }
    });

    console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
    return this.failed === 0;
  }

  assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
    }
  }

  assertAlmostEqual(actual, expected, tolerance = 0.01, message = '') {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(`Expected ${expected} (±${tolerance}), got ${actual}. ${message}`);
    }
  }

  assertTrue(condition, message = '') {
    if (!condition) {
      throw new Error(`Expected true, got false. ${message}`);
    }
  }

  assertFalse(condition, message = '') {
    if (condition) {
      throw new Error(`Expected false, got true. ${message}`);
    }
  }
}

// Test Bird class physics
const testRunner = new TestRunner();

// Test Bird constructor
testRunner.test('Bird constructor initializes properties correctly', () => {
  const bird = new Bird(100, 200);
  
  testRunner.assertEqual(bird.x, 100, 'X position should be set');
  testRunner.assertEqual(bird.y, 200, 'Y position should be set');
  testRunner.assertEqual(bird.vx, 0, 'Initial X velocity should be 0');
  testRunner.assertEqual(bird.vy, 0, 'Initial Y velocity should be 0');
  testRunner.assertEqual(bird.width, 34, 'Width should be 34');
  testRunner.assertEqual(bird.height, 24, 'Height should be 24');
  testRunner.assertEqual(bird.gravity, 0.5, 'Gravity should be 0.5');
  testRunner.assertEqual(bird.jumpStrength, -8, 'Jump strength should be -8');
});

// Test gravity application
testRunner.test('Gravity is applied correctly over time', () => {
  const bird = new Bird(100, 200);
  
  // Initial state
  testRunner.assertEqual(bird.vy, 0, 'Initial velocity should be 0');
  
  // After one update
  bird.update(16); // ~60 FPS delta
  testRunner.assertEqual(bird.vy, 0.5, 'Velocity should increase by gravity');
  testRunner.assertEqual(bird.y, 200.5, 'Position should update by velocity');
  
  // After second update
  bird.update(16);
  testRunner.assertEqual(bird.vy, 1.0, 'Velocity should continue increasing');
  testRunner.assertEqual(bird.y, 201.5, 'Position should continue updating');
});

// Test terminal velocity
testRunner.test('Terminal velocity is enforced', () => {
  const bird = new Bird(100, 200);
  
  // Simulate many updates to reach terminal velocity
  for (let i = 0; i < 20; i++) {
    bird.update(16);
  }
  
  testRunner.assertEqual(bird.vy, 8, 'Velocity should be capped at terminal velocity');
});

// Test jump mechanics
testRunner.test('Jump applies correct upward velocity', () => {
  const bird = new Bird(100, 200);
  
  // Apply gravity first
  bird.update(16);
  testRunner.assertEqual(bird.vy, 0.5, 'Should have downward velocity from gravity');
  
  // Jump
  bird.jump();
  testRunner.assertEqual(bird.vy, -8, 'Jump should set velocity to jump strength');
});

// Test jump mechanics with multiple jumps
testRunner.test('Multiple jumps reset velocity correctly', () => {
  const bird = new Bird(100, 200);
  
  // First jump
  bird.jump();
  testRunner.assertEqual(bird.vy, -8, 'First jump should set velocity to -8');
  
  // Apply some gravity
  bird.update(16);
  testRunner.assertEqual(bird.vy, -7.5, 'Velocity should be affected by gravity');
  
  // Second jump should reset velocity
  bird.jump();
  testRunner.assertEqual(bird.vy, -8, 'Second jump should reset velocity to -8');
});

// Test jump mechanics don't affect horizontal velocity
testRunner.test('Jump does not affect horizontal velocity', () => {
  const bird = new Bird(100, 200);
  
  // Set some horizontal velocity
  bird.vx = 5;
  
  // Jump
  bird.jump();
  
  testRunner.assertEqual(bird.vx, 5, 'Horizontal velocity should not be affected by jump');
  testRunner.assertEqual(bird.vy, -8, 'Vertical velocity should be set by jump');
});

// Test rotation calculation
testRunner.test('Rotation is calculated based on velocity', () => {
  const bird = new Bird(100, 200);
  
  // Test falling rotation
  bird.vy = 4;
  bird.update(16);
  testRunner.assertTrue(bird.rotation > 0, 'Should rotate downward when falling');
  testRunner.assertTrue(bird.rotation <= Math.PI / 4, 'Should not exceed max downward rotation');
  
  // Test jumping rotation
  bird.jump();
  bird.update(16);
  testRunner.assertTrue(bird.rotation < 0, 'Should rotate upward when jumping');
  testRunner.assertTrue(bird.rotation >= -Math.PI / 6, 'Should not exceed max upward rotation');
});

// Test boundary detection
testRunner.test('Boundary detection works correctly', () => {
  const bird = new Bird(100, 200);
  
  // Test top boundary
  bird.y = -1;
  testRunner.assertTrue(bird.isAtTopBoundary(), 'Should detect top boundary');
  
  bird.y = 0;
  testRunner.assertTrue(bird.isAtTopBoundary(), 'Should detect top boundary at edge');
  
  bird.y = 1;
  testRunner.assertFalse(bird.isAtTopBoundary(), 'Should not detect top boundary when inside');
  
  // Test bottom boundary (screen height 600)
  bird.y = 600 - bird.height;
  testRunner.assertTrue(bird.isAtBottomBoundary(600), 'Should detect bottom boundary at edge');
  
  bird.y = 600 - bird.height + 1;
  testRunner.assertTrue(bird.isAtBottomBoundary(600), 'Should detect bottom boundary when past edge');
  
  bird.y = 600 - bird.height - 1;
  testRunner.assertFalse(bird.isAtBottomBoundary(600), 'Should not detect bottom boundary when inside');
});

// Test getBounds method
testRunner.test('getBounds returns correct collision bounds', () => {
  const bird = new Bird(100, 200);
  const bounds = bird.getBounds();
  
  testRunner.assertEqual(bounds.x, 100, 'Bounds X should match bird X');
  testRunner.assertEqual(bounds.y, 200, 'Bounds Y should match bird Y');
  testRunner.assertEqual(bounds.width, 34, 'Bounds width should match bird width');
  testRunner.assertEqual(bounds.height, 24, 'Bounds height should match bird height');
  testRunner.assertEqual(bounds.centerX, 117, 'Center X should be calculated correctly');
  testRunner.assertEqual(bounds.centerY, 212, 'Center Y should be calculated correctly');
});

// Test reset functionality
testRunner.test('Reset restores bird to initial state', () => {
  const bird = new Bird(100, 200);
  
  // Modify bird state
  bird.update(16);
  bird.jump();
  bird.x = 150;
  bird.y = 250;
  
  // Reset
  bird.reset();
  
  testRunner.assertEqual(bird.x, 80, 'X should reset to initial position');
  testRunner.assertEqual(bird.y, 300, 'Y should reset to initial position');
  testRunner.assertEqual(bird.vx, 0, 'X velocity should reset to 0');
  testRunner.assertEqual(bird.vy, 0, 'Y velocity should reset to 0');
  testRunner.assertEqual(bird.rotation, 0, 'Rotation should reset to 0');
});

// Test physics integration over multiple frames
testRunner.test('Physics integration works correctly over multiple frames', () => {
  const bird = new Bird(100, 200);
  const initialY = bird.y;
  
  // Simulate 5 frames of falling
  for (let i = 0; i < 5; i++) {
    bird.update(16);
  }
  
  // After 5 frames: vy should be 2.5, total distance should be sum of velocities
  // Frame 1: vy=0.5, y+=0.5
  // Frame 2: vy=1.0, y+=1.0  
  // Frame 3: vy=1.5, y+=1.5
  // Frame 4: vy=2.0, y+=2.0
  // Frame 5: vy=2.5, y+=2.5
  // Total distance: 0.5 + 1.0 + 1.5 + 2.0 + 2.5 = 7.5
  
  testRunner.assertEqual(bird.vy, 2.5, 'Velocity should be 2.5 after 5 frames');
  testRunner.assertEqual(bird.y, initialY + 7.5, 'Position should be updated correctly');
});

// Run all tests
if (typeof window !== 'undefined') {
  // Browser environment - run tests when page loads
  window.addEventListener('load', () => {
    testRunner.run();
  });
} else {
  // Node environment - run tests immediately
  testRunner.run();
}