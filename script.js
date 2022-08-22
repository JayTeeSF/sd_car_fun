const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const N = 1;
const cars = generateCars(N);
const mutateAmt = 0.27;
let bestCar = cars[0];
let bestBrain = load("bestBrain");
if (bestBrain) {
  bestCar.brain = JSON.parse(bestBrain);
  for(let i = 1; i<cars.length; i++) {
    cars[i].brain = JSON.parse(bestBrain);
    NeuralNetwork.mutate(cars[i].brain, mutateAmt);
  }
}
//= new Car(road.getLaneCenter(1),100,30,50, "AI");

const traffic = [
  // put a rogue car in our way ...that drives slower
  new Car(road.getLaneCenter(1),-100,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(0),-300,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(2),-300,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(1),-500,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(1),-700,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(2),-700,30,50,"ROGUE",2),
  new Car(road.getLaneCenter(1),-1000,30,50,"ROGUE",2),
]

animate();

function load(key="bestBrain") {
  console.log("loading...");
  return localStorage.getItem(key);
}

function save(key="bestBrain") {
  console.log("saving...");
  localStorage.setItem(
    key,
    JSON.stringify(bestCar.brain)
  );
}

function destroy(key="bestBrain") {
  console.log("destroying old best car...");
  localStorage.removeItem(key);
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
  const smallPercent = 0.23;
  let furthestCars = [];
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].y <= (bestCar.y + (smallPercent * bestCar.y))) {
      furthestCars.push(cars[i])
    }
  }

  let halfALane = road.laneWidth / 2;
  let closestToCenter = halfALane;
  /*
  for (let i = 0; i < furthestCars.length; i++) {
    let c = furthestCars[i];
    for( let j = 0; j < road.laneCount; j++) {
      if ((((c.x**2) - (road.getLaneCenter(j)**2)) <= closestToCenter) &&
        (cars[i].y <= (bestCar.y + (smallPercent * bestCar.y)))) {
        bestCar = c;
      }
    }
  }
  */

  let carLanes = {};
  let smallestDistanceFromCenter = road.laneWidth * 2;
  let bc = bestCar;
  for(let i=0; i < furthestCars.length; i++) {
    let c = furthestCars[i];
    carLanes[c] = {lane: 0, distance: road.laneWidth * 2}
    for(let j = 0; j < road.laneCount; j++) {
      let d = (((c.x + 0.5 * c.width)**2) - (road.getLaneCenter(j)**2))

      if (d <= road.laneWidth) {
        carLanes[c] = {lane: j, distance: d};
        if ((d <= smallestDistanceFromCenter) && (d > 0)) {
          console.log(`new smallestDistance: ${d}`);
          smallestDistanceFromCenter = d;
          bc = c;
        }
      }
    }
  }
  /*
  bestCar = furthestCars.find((c) => {
    carLanes[c].distance <= smallestDistanceFromCenter;
  });
  */

  bestCar = bc;
  /*
  furthestCars[Math.floor(Math.random()*furthestCars.length)];
  // while (!bestCar) {
  if (!bestCar) {
    //console.log(`missing bestCar: ${bestCar}`);
    bestCar = bc;
  }

  if (!bestCar) {
    console.log(`missing bestCar: ${bestCar}`);
    bestCar = furthestCars.pop();
  }
*/
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
