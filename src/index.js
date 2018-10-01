import './index.scss';

const marioRef = document.querySelector('#mario');
const luigiRef = document.querySelector('#luigi');

const marioState = {
  jumpCount: 0,
  position: {
    x: 0,
    y: 0
  }
};

const luigiState = {
  jumpCount: 0,
  position: {
    x: 0,
    y: 0
  }
};

(function init() {
  registerInput();
})();

function registerInput() {
  document.addEventListener('keyup', (e) => {
    console.log(e.code);

    switch (e.code) {
      case 'KeyW':
        jump(marioRef, marioState, 'right');
        break;
      case 'ArrowUp':
        jump(luigiRef, luigiState, 'left');
        break;
    }
  });
}

function rotate(ref, state, facing) {
  ref.animate([
    {
      transform: facing === 'right' ? 'rotateZ(0deg)' : 'rotateY(180deg) rotateZ(0deg)'
    },
    {
      transform: facing === 'right' ? 'rotateZ(360deg)' : 'rotateY(180deg) rotateZ(360deg)'
    },
  ], {
    duration: 400,
    iterations: 1
  })
}

function move(ref) {
  ref.animate([
    {
      left: '30px'
    }, {
      left: '1300px'
    }
  ], {
    duration: 5000,
    delay: 2000
  });
}

function jump(ref, state, facing) {

  state.jumpCount++;

  if (state.jumpCount === 3) {
    rotate(ref, state, facing);
    state.jumpCount = 0;
  }

  ref.animate([
    {
      bottom: '0px'
    },
    {
      bottom: `${100 + Math.random() * 300}px`
    },
    {
      bottom: '0px'
    }
  ], {
    duration: 500,
    iterations: 1
  });
}
