import mojs from 'mo-js';

export default new mojs.Burst({
    left:     0,
    top:      0,
    radius:   { 4: 19 },
    angle:    45,
    children: {
      shape:            'line',
      radius:           3,
      scale:            1,
      stroke:          '#FD7932',
      strokeDasharray: '100%',
      strokeDashoffset: { '-100%' : '100%' },
      duration:         700,
      easing:           'quad.out',
    }
  });
