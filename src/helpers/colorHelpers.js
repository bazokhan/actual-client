/* eslint-disable */
// https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
const isDarkColor = hexCode => {
  if (!/#/.test(hexCode)) return new Error('Only hex codes are accpetable');
  const c = hexCode.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  // eslint-disable-next-line no-bitwise
  const r = (rgb >> 16) & 0xff; // extract red
  // eslint-disable-next-line no-bitwise
  const g = (rgb >> 8) & 0xff; // extract green
  // eslint-disable-next-line no-bitwise
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 140 /* ranges between 0, 255 */) {
    // pick a different colour
    return true;
  }
  return false;
};

// https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
const hashCode = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const intToRGB = i => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
};

// '#1382eb'
const colorizeString = str =>
  blend_colors(
    `#${intToRGB(hashCode(str))}`,
    blend_colors('#1382eb', '#000000', 0.6),
    0.6
  );

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
const shadeColor = (color, percent) => {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};

// https://coderwall.com/p/z8uxzw/javascript-color-blender
/*
    blend two colors to create the color that is at the percentage away from the first color
    this is a 5 step process
        1: validate input
        2: convert input to 6 char hex
        3: convert hex to rgb
        4: take the percentage to create a ratio between the two colors
        5: convert blend to hex
    @param: color1      => the first color, hex (ie: #000000)
    @param: color2      => the second color, hex (ie: #ffffff)
    @param: percentage  => the distance from the first color, as a decimal between 0 and 1 (ie: 0.5)
    @returns: string    => the third color, hex, represenatation of the blend between color1 and color2 at the given percentage
*/
const int_to_hex = num => {
  var hex = Math.round(num).toString(16);
  if (hex.length == 1) hex = '0' + hex;
  return hex;
};

const blend_colors = (color1, color2, percentage) => {
  // check input
  color1 = color1 || '#000000';
  color2 = color2 || '#ffffff';
  percentage = percentage || 0.5;

  // 1: validate input, make sure we have provided a valid hex
  if (color1.length != 4 && color1.length != 7)
    throw new error('colors must be provided as hexes');

  if (color2.length != 4 && color2.length != 7)
    throw new error('colors must be provided as hexes');

  if (percentage > 1 || percentage < 0)
    throw new error('percentage must be between 0 and 1');

  /*// output to canvas for proof
  var cvs = document.createElement('canvas');
  var ctx = cvs.getContext('2d');
  cvs.width = 90;
  cvs.height = 25;
  document.body.appendChild(cvs);

  // color1 on the left
  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, 30, 25);

  // color2 on the right
  ctx.fillStyle = color2;
  ctx.fillRect(60, 0, 30, 25);
  */

  // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
  //      the three character hex is just a representation of the 6 hex where each character is repeated
  //      ie: #060 => #006600 (green)
  if (color1.length == 4)
    color1 =
      color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
  else color1 = color1.substring(1);
  if (color2.length == 4)
    color2 =
      color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
  else color2 = color2.substring(1);

  //   console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);

  // 3: we have valid input, convert colors to rgb
  color1 = [
    parseInt(color1[0] + color1[1], 16),
    parseInt(color1[2] + color1[3], 16),
    parseInt(color1[4] + color1[5], 16)
  ];
  color2 = [
    parseInt(color2[0] + color2[1], 16),
    parseInt(color2[2] + color2[3], 16),
    parseInt(color2[4] + color2[5], 16)
  ];

  //   console.log(
  //     'hex -> rgba: c1 => [' +
  //       color1.join(', ') +
  //       '], c2 => [' +
  //       color2.join(', ') +
  //       ']'
  //   );

  // 4: blend
  var color3 = [
    (1 - percentage) * color1[0] + percentage * color2[0],
    (1 - percentage) * color1[1] + percentage * color2[1],
    (1 - percentage) * color1[2] + percentage * color2[2]
  ];

  //   console.log('c3 => [' + color3.join(', ') + ']');

  // 5: convert to hex
  color3 =
    '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

  //   console.log(color3);
  /*
  // color3 in the middle
  ctx.fillStyle = color3;
  ctx.fillRect(30, 0, 30, 25);
*/
  // return hex
  return color3;
};

/*
    convert a Number to a two character hex string
    must round, or we will end up with more digits than expected (2)
    note: can also result in single digit, which will need to be padded with a 0 to the left
    @param: num         => the number to conver to hex
    @returns: string    => the hex representation of the provided number
*/

export { isDarkColor, colorizeString, shadeColor };
