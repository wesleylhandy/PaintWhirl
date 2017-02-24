# PaintWhirl

## About

This project utilizes CSS transformations along with HTML canvas to simulate the kiddie carnival attraction - Paint Spinner https://youtu.be/6kLwvCWzHpQ

See this app live [here](https://wesleylhandy.github.io/PaintWhirl/)

### How does it work?

This app is optimized for large-screens (sorry tabs and phones). The buttons on the left control the spinning of the canvas. Colors can be selected and drops will be poured onto the canvas only when it is spinning and only when the canvas detects mouse movement over the canvas.

Drops are created using an algorithm to drawn points on the canvas by calculated a slope between the mouses x and y location and the center point (0, 0). Several points are derived along the slope in both directions as well as along a line perpendicular to the slope to draw circles, curves, and triangles. See `logic.js` in this repo to see how this algebra is applied to the canvas.

The user can stop the spinning of the canvas and save the current state of the canvas.

This app currently utilizes `localstorage()` but will be moved over to `firebase()` in time. The goal is to allow users to create, store and view created images.

This will also require implementation of some sort of federated log-in. Email, Google, Facebook or Twitter are all supported by Firebase. This feature will in future developments.