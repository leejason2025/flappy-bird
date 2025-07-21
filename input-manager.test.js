// input-manager.test.js - Unit tests for InputManager class

// Import InputManager class for Node.js testing
const InputManager = require('./input-manager.js');

// Mock canvas and DOM for testing
class MockCanvas {
  constructor() {
    this.eventListeners = {};
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(handler);
      if (index > -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  }

  dispatchEvent(event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(handler => handler(event));
    }
  }
}

// Mock document for testing
const mockDocument = {
  eventListeners: {},
  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  },
  removeEventListener(event, handler) {
    if (this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(handler);
      if (index > -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  },
  dispatchEvent(event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(handler => handler(event));
    }
  }
};

// Mock performance.now for testing
global.performance = {
  now: () => Date.now()
};

// Simple test framework
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
    console.log('Running InputManager Tests...\n');
    
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

// Test InputManager class
const testRunner = new TestRunner();

// Test InputManager constructor
testRunner.test('InputManager constructor initializes correctly', () => {
  const mockCanvas = new MockCanvas();
  
  // Mock document for this test
  const originalDocument = global.document;
  global.document = mockDocument;
  
  const inputManager = new InputManager(mockCanvas);
  
  testRunner.assertEqual(inputManager.canvas, mockCanvas, 'Canvas should be stored');
  testRunner.assertFalse(inputManager.jumpPressed, 'Jump pressed should be false initially');
  testRunner.assertEqual(inputManager.lastJumpTime, 0, 'Last jump time should be 0 initially');
  testRunner.assertEqual(inputManager.jumpCooldown, 100, 'Jump cooldown should be 100ms');
  
  // Restore original document
  global.document = originalDocument;
});

// Test keyboard input handling
testRunner.test('Keyboard input triggers jump correctly', () => {
  const mockCanvas = new MockCanvas();
  
  // Mock document for this test
  const originalDocument = global.document;
  global.document = mockDocument;
  
  const inputManager = new InputManager(mockCanvas);
  
  // Test spacebar
  const spaceEvent = {
    code: 'Space',
    key: ' ',
    preventDefault: () => {}
  };
  
  inputManager.handleKeyDown(spaceEvent);
  testRunner.assertTrue(inputManager.isJumpPressed(), 'Spacebar should trigger jump');
  
  // Reset for next test
  inputManager.reset();
  
  // Test arrow up key
  const arrowEvent = {
    code: 'ArrowUp',
    key: 'ArrowUp',
    preventDefault: () => {}
  };
  
  inputManager.handleKeyDown(arrowEvent);
  testRunner.assertTrue(inputManager.isJumpPressed(), 'Arrow up should trigger jump');
  
  // Restore original document
  global.document = originalDocument;
});

// Test mouse input handling
testRunner.test('Mouse click triggers jump correctly', () => {
  const mockCanvas = new MockCanvas();
  const inputManager = new InputManager(mockCanvas);
  
  const clickEvent = {
    button: 0, // Left mouse button
    preventDefault: () => {}
  };
  
  inputManager.handleMouseClick(clickEvent);
  testRunner.assertTrue(inputManager.isJumpPressed(), 'Left mouse click should trigger jump');
});

// Test jump cooldown mechanism
testRunner.test('Jump cooldown prevents input spam', () => {
  const mockCanvas = new MockCanvas();
  const inputManager = new InputManager(mockCanvas);
  
  // Set a shorter cooldown for testing
  inputManager.jumpCooldown = 50;
  
  // First jump should work
  inputManager.processJumpInput();
  testRunner.assertTrue(inputManager.isJumpPressed(), 'First jump should work');
  
  // Immediate second jump should be blocked
  inputManager.processJumpInput();
  testRunner.assertFalse(inputManager.isJumpPressed(), 'Second immediate jump should be blocked');
  
  // Wait for cooldown and try again
  setTimeout(() => {
    inputManager.processJumpInput();
    testRunner.assertTrue(inputManager.isJumpPressed(), 'Jump after cooldown should work');
  }, 60);
});

// Test isJumpPressed state management
testRunner.test('isJumpPressed returns and resets state correctly', () => {
  const mockCanvas = new MockCanvas();
  const inputManager = new InputManager(mockCanvas);
  
  // Initially should be false
  testRunner.assertFalse(inputManager.isJumpPressed(), 'Should be false initially');
  
  // After processing input
  inputManager.processJumpInput();
  testRunner.assertTrue(inputManager.isJumpPressed(), 'Should be true after input');
  
  // Should be false again after reading
  testRunner.assertFalse(inputManager.isJumpPressed(), 'Should be false after reading');
});

// Test reset functionality
testRunner.test('Reset clears input state', () => {
  const mockCanvas = new MockCanvas();
  const inputManager = new InputManager(mockCanvas);
  
  // Set some state
  inputManager.processJumpInput();
  inputManager.lastJumpTime = 1000;
  
  // Reset
  inputManager.reset();
  
  testRunner.assertFalse(inputManager.jumpPressed, 'Jump pressed should be false after reset');
  testRunner.assertEqual(inputManager.lastJumpTime, 0, 'Last jump time should be 0 after reset');
});

// Test event listener binding
testRunner.test('Event listeners are bound correctly', () => {
  const mockCanvas = new MockCanvas();
  
  // Mock document for this test
  const originalDocument = global.document;
  global.document = mockDocument;
  
  const inputManager = new InputManager(mockCanvas);
  
  // Check that event listeners were added
  testRunner.assertTrue(mockDocument.eventListeners.keydown && mockDocument.eventListeners.keydown.length > 0, 
    'Keydown listener should be added to document');
  testRunner.assertTrue(mockCanvas.eventListeners.click && mockCanvas.eventListeners.click.length > 0, 
    'Click listener should be added to canvas');
  
  // Restore original document
  global.document = originalDocument;
});

// Test non-jump keys are ignored
testRunner.test('Non-jump keys are ignored', () => {
  const mockCanvas = new MockCanvas();
  const inputManager = new InputManager(mockCanvas);
  
  const otherKeyEvent = {
    code: 'KeyA',
    key: 'a',
    preventDefault: () => {}
  };
  
  inputManager.handleKeyDown(otherKeyEvent);
  testRunner.assertFalse(inputManager.isJumpPressed(), 'Non-jump keys should be ignored');
});

// Test right mouse button is ignored
testRunner.test('Right mouse button is ignored', () => {
  const mockCanvas = new MockCanvas();
  const inputManager = new InputManager(mockCanvas);
  
  const rightClickEvent = {
    button: 2, // Right mouse button
    preventDefault: () => {}
  };
  
  inputManager.handleMouseClick(rightClickEvent);
  testRunner.assertFalse(inputManager.isJumpPressed(), 'Right mouse button should be ignored');
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