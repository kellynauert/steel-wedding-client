import React from 'react';
import ReactDOM from 'react-dom';
import { useSpring, animated } from 'react-spring';

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
const trans1 = (x, y) => `translate3d(${x / 10}px,0px,0)`;
const trans2 = (x, y) => `translate3d(${x / 8 + 35}px,0px,0)`;
const trans3 = (x, y) => `translate3d(${x / 6 - 250}px,0px,0)`;
const trans4 = (x, y) => `translate3d(${x / 3.5}px,0px,0)`;

function Background() {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: {
      mass: 1,
      tension: 60,
      friction: 800,
    },
  }));
  return (
    <div
      className='containerbg'
      onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
    >
      <animated.div
        className='card1'
        style={{ transform: props.xy.interpolate(trans1) }}
      />
    </div>
  );
}
export default Background;
ReactDOM.render(<Background />, document.getElementById('root'));
