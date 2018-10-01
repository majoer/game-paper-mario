import './index.scss';

const FACTOR_MOVEMENT_SPEED = 10;
const FACTOR_FALL_SPEED = 15;
const FACTOR_JUMP_SPEED = 50;

const keyState = {};
const marioState = {
  ref: document.querySelector('#mario'),
  jump: {
    count: 0,
    forceFall: false
  }
};

const luigiState = {
  ref: document.querySelector('#luigi'),
  jump: {
    count: 0,
    forceFall: false
  }
};

(function init() {
  initializePositions();
  registerInput();
  startGameloop();
})();

function initializePositions() {
  marioState.ref.style.left = '0px';
  marioState.ref.style.bottom = '0px';

  luigiState.ref.style.left = '800px';
  luigiState.ref.style.bottom = '0px';
  luigiState.ref.style.transform = 'rotateY(180deg)';
}

function registerInput() {

  document.addEventListener('keydown', e => {
    if (e.repeat) {
      return;
    }

    keyState[ e.code ] = true;
  });

  document.addEventListener('keyup', e => {
    keyState[ e.code ] = false;
  });
}

function rotateZ(state) {
  const currentTransform = state.ref.style.transform.replace(/rotateZ\(.*\)/, '');

  state.ref.animate([
    {
      transform: `${currentTransform} rotateZ(0deg)`
    },
    {
      transform: `${currentTransform} rotateZ(360deg)`
    },
  ], {
    duration: 400,
    iterations: 1
  });
}

function move(ref, direction) {
  switch (direction) {
    case 'right':
      ref.style.left = `${parseInt(ref.style.left) + 1 * FACTOR_MOVEMENT_SPEED}px`;
      break;
    case 'left':
      ref.style.left = `${parseInt(ref.style.left) - 1 * FACTOR_MOVEMENT_SPEED}px`;
      break;
  }
}

function jump(state) {
  if (!isInAir(state.ref)) {
    state.jump.count++;
  }

  if (reachedMaxJumpingHeight(state.ref)) {
    state.jump.forceFall = true;
  }

  state.ref.style.bottom = `${parseInt(state.ref.style.bottom) + 1 * FACTOR_JUMP_SPEED}px`;

  if (state.jump.count === 3) {
    rotateZ(state, 'right');
    state.jump.count = 0;
  }
}

function processMarioKeys() {
  if (keyState[ 'KeyD' ]) {
    move(marioState.ref, 'right');
  }

  if (keyState['KeyA']) {
    move(marioState.ref, 'left');
  }

  if (keyState['KeyW'] && !marioState.jump.forceFall) {
    jump(marioState);
  } else if (isInAir(marioState.ref)) {
    marioState.jump.forceFall = true;
  }
}

function processLuigiKeys() {
  if (keyState[ 'ArrowLeft' ]) {
    move(luigiState.ref, 'left');
  }

  if (keyState[ 'ArrowRight' ]) {
    move(luigiState.ref, 'right');
  }

  if (keyState['ArrowUp'] && !luigiState.jump.forceFall) {
    jump(luigiState);
  } else if (isInAir(luigiState.ref)) {
    luigiState.jump.forceFall = true;
  }
}

function processKeys() {
  processMarioKeys();
  processLuigiKeys();
}

function isInAir(ref) {
  return parseInt(ref.style.bottom) > 0;
}

function reachedMaxJumpingHeight(ref) {
  return parseInt(ref.style.bottom) >= 500;
}

function calculateFall(ref) {
  const y = parseInt(ref.style.bottom);

  return `${Math.max(y - 1 * FACTOR_FALL_SPEED, 0)}px`
}

function processGravity() {
  if (isInAir(marioState.ref)) {
    marioState.ref.style.bottom = calculateFall(marioState.ref);
  } else {
    marioState.jump.forceFall = false;
  }

  if (isInAir(luigiState.ref)) {
    luigiState.ref.style.bottom = calculateFall(luigiState.ref);
  } else {
    luigiState.jump.forceFall = false;
  }
}

function startGameloop() {
  setInterval(() => {
    processKeys();
    processGravity();
  }, 10);
}
