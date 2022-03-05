import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    fill: '#0099ff',
    width: 'auto',
    height: 40,
  },
});

export const ApertureLogoIcon = () => {
  const classes = useStyles();

  return (
    <svg
      viewBox="0 0 152 152"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={classes.svg}
    >
      <defs>
        <clipPath id="f">
          <circle r="125.5" />
        </clipPath>
        <clipPath id="g">
          <path transform="rotate(-45 15 -69)" d="M-128-212H15v143h-143z" />
        </clipPath>
      </defs>
      <g transform="matrix(.574 -.114 .114 .574 77 76)" clipPath="url(#f)">
        <g id="i">
          <path id="h" d="M-128-212H15v143h-143z" clipPath="url(#g)" />
          <use transform="scale(-1)" xlinkHref="#h" />
        </g>
        <use transform="rotate(45)" xlinkHref="#i" />
        <use transform="rotate(-45)" xlinkHref="#i" />
        <use transform="rotate(90)" xlinkHref="#i" />
      </g>
    </svg>
  );
};
