const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
let bestBrain = localStorage.getItem("bestBrain")
if (bestBrain) {
  bestCar.brain = JSON.parse(bestBrain)
}
//= new Car(road.getLaneCenter(1),100,30,50, "AI");

const traffic = [
  // put a rogue car in our way ...that drives slower
  new Car(road.getLaneCenter(1),-100,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(0),-1000,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(3),-500,30,50,"ROGUE",2),
]

animate();

function save() {
  console.log("saving...");
  localStorage.setItem(
    "bestBrain",
    JSON.stringify(bestCar.brain)
  );
}
function destroy() {
  console.log("destroying old best car...");
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i<N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for(let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  
  // define best car as the one that makes it the furthest
  // i.e. has lowest 'y' value
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].y < bestCar.y) {
      bestCar = cars[i];
    }
  }

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for(let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  // redraw the first car to emphasize it
  // and only draw its with sensors...
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  networkCtx.lineDashOffset=-time/50;
  requestAnimationFrame(animate);
}
