# Design Document

## Overview

This design document outlines the technical architecture for a Flappy Bird clone implemented using HTML5 Canvas and vanilla JavaScript. The game will use object-oriented programming principles with a main game loop handling updates and rendering at 60 FPS.

## Architecture

### Core Game Loop
The game will follow a standard game loop pattern:
1. **Input Processing** - Handle user input events
2. **Update** - Update game state and object positions
3. **Render** - Draw all game objects to the canvas
4. **Repeat** - Continue loop using `requestAnimationFrame`

### State Management
The game will have three primary states:
- **START** - Initial screen with instructions
- **PLAYING** - Active gameplay
- **GAME_OVER** - End screen with score and restart option

## Components and Interfaces

### Game Class
The main game controller that manages the overall game state and coordinates all other components.

```javascript
class Game {
  constructor(canvas)
  init()
  start()
  update(deltaTime)
  render()
  handleInput(inputType)
  setState(newState)
  restart()
}
```

**Responsibilities:**
- Initialize canvas and context
- Manage game state transitions
- Coordinate update and render cycles
- Handle global input events
- Manage score and high score

### Bird Class
Represents the player-controlled bird with physics and rendering.

```javascript
class Bird {
  constructor(x, y)
  update(deltaTime)
  render(ctx)
  jump()
  reset()
  getBounds()
}
```

**Properties:**
- Position (x, y)
- Velocity (vx, vy)
- Rotation angle
- Size dimensions
- Jump strength
- Gravity constant

**Responsibilities:**
- Apply gravity and movement physics
- Handle jump mechanics
- Provide collision bounds
- Render bird with rotation

### Pipe Class
Represents individual pipe obstacles with collision detection.

```javascript
class Pipe {
  constructor(x, gapY, gapHeight)
  update(deltaTime)
  render(ctx)
  isOffScreen()
  getBounds()
  hasPassedBird(birdX)
}
```

**Properties:**
- Position (x, gapY)
- Gap height
- Pipe width
- Movement speed
- Passed flag (for scoring)

**Responsibilities:**
- Move from right to left
- Provide collision bounds for top and bottom sections
- Track if bird has passed for scoring
- Render top and bottom pipe sections

### PipeManager Class
Manages the collection of pipes, spawning, and cleanup.

```javascript
class PipeManager {
  constructor()
  update(deltaTime, birdX)
  render(ctx)
  spawnPipe()
  cleanup()
  checkCollisions(bird)
  checkScoring(bird)
  reset()
}
```

**Responsibilities:**
- Spawn pipes at regular intervals
- Update all active pipes
- Remove off-screen pipes
- Handle collision detection with bird
- Track scoring when bird passes pipes

### InputManager Class
Handles all user input events and provides a clean interface to the game.

```javascript
class InputManager {
  constructor(canvas)
  bindEvents()
  isJumpPressed()
  reset()
}
```

**Responsibilities:**
- Listen for mouse clicks, keyboard events
- Provide unified input interface
- Handle input state management
- Prevent input spam

## Data Models

### Game State Object
```javascript
const gameState = {
  current: 'START', // 'START', 'PLAYING', 'GAME_OVER'
  score: 0,
  highScore: 0,
  isRunning: false
}
```

### Bird State Object
```javascript
const birdState = {
  x: 80,
  y: 300,
  vx: 0,
  vy: 0,
  rotation: 0,
  width: 34,
  height: 24
}
```

### Pipe Configuration
```javascript
const pipeConfig = {
  width: 80,
  gapHeight: 150,
  speed: 2,
  spawnInterval: 1500, // milliseconds
  minGapY: 100,
  maxGapY: 400
}
```

## Error Handling

### Canvas Context Validation
- Verify canvas element exists before initialization
- Check for 2D context support
- Graceful fallback if canvas is not supported

### Input Event Handling
- Prevent default browser behaviors for game keys
- Handle multiple rapid inputs gracefully
- Validate input events before processing

### Game State Consistency
- Ensure state transitions are valid
- Reset all objects properly on game restart
- Handle edge cases in collision detection

### Performance Safeguards
- Limit maximum number of active pipes
- Cap frame rate to prevent excessive CPU usage
- Clean up unused objects to prevent memory leaks

## Testing Strategy

### Unit Testing Approach
1. **Bird Physics Testing**
   - Test gravity application over time
   - Verify jump velocity and timing
   - Test boundary collision detection

2. **Pipe Management Testing**
   - Test pipe spawning intervals
   - Verify collision bounds calculation
   - Test scoring logic when bird passes pipes

3. **Game State Testing**
   - Test state transitions (START → PLAYING → GAME_OVER)
   - Verify score tracking and high score persistence
   - Test game reset functionality

### Integration Testing
1. **Game Loop Integration**
   - Test complete update/render cycle
   - Verify frame rate consistency
   - Test input handling during gameplay

2. **Collision System Integration**
   - Test bird-pipe collision detection
   - Test bird-boundary collision detection
   - Verify game over triggers

### Manual Testing Scenarios
1. **Gameplay Flow**
   - Start game → Play → Collision → Restart
   - Score accumulation through multiple pipe passages
   - High score persistence across sessions

2. **Input Responsiveness**
   - Test various input methods (mouse, keyboard)
   - Test input during different game states
   - Test rapid input handling

3. **Visual Quality**
   - Smooth animation at 60 FPS
   - Proper object positioning and movement
   - Clear visual feedback for all interactions

## Performance Considerations

### Rendering Optimization
- Use `requestAnimationFrame` for smooth 60 FPS
- Clear only necessary canvas areas when possible
- Minimize object creation during gameplay

### Memory Management
- Remove off-screen pipes from arrays
- Reuse objects where possible
- Avoid creating new objects in update loops

### Input Optimization
- Debounce rapid input events
- Use event delegation for better performance
- Cache DOM element references

## Implementation Notes

### Canvas Setup
- Canvas dimensions: 400x600 pixels
- Context: 2D rendering context
- Coordinate system: (0,0) at top-left

### Physics Constants
- Gravity: 0.5 pixels/frame²
- Jump velocity: -8 pixels/frame
- Pipe speed: 2 pixels/frame
- Bird terminal velocity: 8 pixels/frame

### Visual Design
- Bird: Simple colored rectangle with rotation
- Pipes: Green rectangles with consistent width
- Background: Light blue (#70c5ce)
- Score: White text, top-center of screen