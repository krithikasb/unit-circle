const s = (sketch) => {
  let x, y;
  let vec;
  let fr = 1;
  let tex;
  const circleStrokeWeight = 5;

  sketch.setup = function setup() {
    let w = Math.min(sketch.windowWidth, 600);
    sketch.createCanvas(w, w);
    sketch.frameRate(fr);
    tex = sketch.createP();
    x = sketch.width / 2;
    y = 0;
    vec = sketch.createVector(x, y);
  };

  function getDiameter() {
    return sketch.height < sketch.width ? sketch.height : sketch.width;
  }

  function calculateLength(x1, y1, x2, y2, multiplier = 1) {
    if (
      Math.round(x1 * 100) === Math.round(x2 * 100) &&
      Math.round(y1 * 100) === Math.round(y2 * 100)
    ) {
      return sketch.nfc(0, 3);
    }
    let d = (sketch.dist(x1, y1, x2, y2) * multiplier) / (getDiameter() / 2);
    return sketch.nfc(d, 3);
  }

  function boxedText(text, textPositionX, textPositionY, color) {
    sketch.push();
    sketch.textSize(16);
    // draw rectangle around the text

    sketch.push();
    // sketch.strokeWeight(1);
    sketch.fill(color || "white");
    annotatedTextWidth = sketch.textWidth(text); // textWidth() returns the width of the text
    annotatedTextHeight = sketch.textAscent(text);
    // add border radius to rectangle

    sketch.rect(
      textPositionX - 4,
      textPositionY - 10 - 6 - 1,
      annotatedTextWidth + 8,
      annotatedTextHeight + 12,
      8
    );
    sketch.pop();

    // draw the text
    sketch.text(text, textPositionX, textPositionY);
    sketch.pop();
  }

  function annotateLength(x1, y1, x2, y2, d) {
    // Let's write d along the line we are drawing!
    sketch.push();
    sketch.stroke("black");
    sketch.strokeWeight(0);
    sketch.translate((x1 + x2) / 2, (y1 + y2) / 2);
    sketch.scale(-1, 1);
    sketch.rotate(-sketch.PI);
    // rotate(atan2(y2 - y1, x2 - x1));
    boxedText(d, 0, -5, "#FFD970");
    // Fancy!
    // line(x, y, vec.x, vec.y)
    sketch.pop();
  }

  function displaySineFormula(angle, opposite, adjacent, hypotenuse) {
    tex.style("font-size", "16px");
    tex.position(150, opposite > 0 ? 350 : 150);
    katex.render(
      `sin (${angle}) = \\frac{opposite}{hypotenuse} = \\frac{${opposite}}{${hypotenuse}} = ${
        opposite / hypotenuse
      }`,
      tex.elt
    );
  }

  function displayCosineFormula(angle, opposite, adjacent, hypotenuse) {
    tex.style("font-size", "16px");
    tex.position(150, opposite > 0 ? 350 : 150);
    tex.style("background-color", "#F6B6C2");
    tex.style("padding", "4px 10px");
    tex.style("border-radius", "7px");
    katex.render(
      `cos (${angle}) = \\frac{adjacent}{hypotenuse} = \\frac{${adjacent}}{${hypotenuse}} = ${
        adjacent / hypotenuse
      }`,
      tex.elt
    );
  }

  sketch.draw = function draw() {
    sketch.background(255);
    sketch.translate(sketch.width / 2, sketch.height / 2);
    sketch.scale(-1, 1);
    sketch.scale(0.9, 0.9);
    sketch.rotate(sketch.PI);

    sketch.push();
    sketch.strokeWeight(circleStrokeWeight);
    sketch.stroke("#FF8966");
    sketch.fill("#FFF0EB");
    sketch.circle(0, 0, getDiameter());
    sketch.pop();

    // x axis
    sketch.line(-x + circleStrokeWeight / 2, 0, x - circleStrokeWeight / 2, y); // draw a line fr
    sketch.push();
    sketch.scale(-1, 1);
    sketch.rotate(-sketch.PI);
    boxedText("(-1, 0)", -sketch.width / 2 - 20, 10);
    boxedText("(1, 0)", sketch.width / 2 - 10, 10);
    sketch.pop();
    //y axis

    sketch.line(
      0,
      -sketch.height / 2 + circleStrokeWeight / 2,
      0,
      sketch.height / 2 - circleStrokeWeight / 2
    );
    sketch.push();
    sketch.scale(-1, 1);
    sketch.rotate(-sketch.PI);
    boxedText("(0, 1)", -20, -sketch.height / 2);
    boxedText("(0, -1)", -20, sketch.height / 2 + 10);
    sketch.pop();

    sketch.push();
    sketch.strokeWeight(7);
    sketch.stroke("#E5446D");
    vec.rotate(sketch.PI / 12);
    // the hypotenuse
    sketch.line(0, 0, vec.x, vec.y);
    let hypotenuseLength = calculateLength(0, 0, vec.x, vec.y);
    annotateLength(0, 0, vec.x, vec.y, hypotenuseLength);
    sketch.push();
    sketch.fill("black");
    sketch.circle(vec.x, vec.y, 10);
    sketch.pop();
    // the opposite line
    sketch.line(vec.x, y, vec.x, vec.y);
    let oppositeLength = calculateLength(
      vec.x,
      y,
      vec.x,
      vec.y,
      vec.y > y ? 1 : -1
    );
    annotateLength(vec.x, y, vec.x, vec.y, oppositeLength);

    // the adjacent line
    sketch.line(0, 0, vec.x, y);
    let adjacentLength = calculateLength(0, 0, vec.x, y, vec.x > 0 ? 1 : -1);
    annotateLength(0, 0, vec.x, y, adjacentLength);
    let angle = sketch.degrees(vec.heading()).toFixed(2);
    sketch.push();
    sketch.strokeWeight(0);
    sketch.stroke("black");
    // sketch.rotate(vec.heading());
    sketch.scale(-1, 1);
    sketch.rotate(-sketch.PI);
    boxedText(
      angle + "°",
      vec.x > 0 ? 10 : -60,
      vec.y > 0 ? -10 : 20,
      "#C1C3D7"
    );
    sketch.pop();
    // displaySineFormula(angle, oppositeLength, adjacentLength, hypotenuseLength);
    displayCosineFormula(
      angle,
      oppositeLength,
      adjacentLength,
      hypotenuseLength
    );

    sketch.pop();
  };
};

let myp5 = new p5(s, "p5sketch");
