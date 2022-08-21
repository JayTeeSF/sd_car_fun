const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const N = 100;
const cars = generateCars(N);
//= new Car(road.getLaneCenter(1),100,30,50, "AI");

const traffic = [
  // put a rogue car in our way ...that drives slower
  new Car(road.getLaneCenter(1),-100,30,50,"ROGUE",2)
]

animate();

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

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -cars[0].y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for(let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }

  carCtx.restore();

  Visualizer.drawNetwork(networkCtx, cars[0].brain);

  networkCtx.lineDashOffset=-time/50;
  requestAnimationFrame(animate);
}
