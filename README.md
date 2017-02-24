# PaintWhirl

## About

This project utilizes CSS transformations along with HTML canvas to simulate the kiddie carnival attraction - Paint Spinner https://youtu.be/6kLwvCWzHpQ

See this app live [here](https://wesleylhandy.github.io/PaintWhirl/)

### How does it work?

This app is optimized for large-screens (sorry tabs and phones). The buttons on the left control the spinning of the canvas. Color buttons change the color of the drops which the user will paint on the spinner. These drops only appear onto the canvas it is spinning and only when the canvas detects mouse movement over the canvas.

Drops are created by an algorithm which calculates the slope of a line between the `mouseX` and `mouseY` positions and the center point (0, 0) - since the canvas has been translated to the center of the screen. From this slope, several points are derived along the line in both directions as well as along a line perpendicular to the slope to draw circles, curves, and triangles. See `logic.js` in this repo to see how this algebra is applied to the canvas.

The user can stop the spinning of the canvas and save the current state of the canvas.

This app currently utilizes `localstorage()` but will be moved over to `firebase()` in time. The goal is to allow users to create, store and view created images.

This will also require implementation of some sort of federated log-in. Email, Google, Facebook or Twitter are all supported by Firebase. This feature will appear in future developments.