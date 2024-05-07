import "./style.css";

const dropper = document.getElementById("dropper") as HTMLButtonElement;
const headerColor = document.getElementById("header-color") as HTMLDivElement;
const file = document.getElementById("file") as HTMLInputElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d", {
  willReadFrequently: true,
}) as CanvasRenderingContext2D;
const zoom = document.getElementById("zoom") as HTMLDivElement;
const zoomColor = document.getElementById("zoom-color") as HTMLDivElement;
const zoomSize = 160;

let loaded = false;
let dropping = false;
let hovering = false;
let mouseX = 0;
let mouseY = 0;
let image = new Image();

const update = () => {
  if (dropping) {
    document.documentElement.classList.add("dropping");
  } else {
    document.documentElement.classList.remove("dropping");
  }
  if (loaded && dropping && hovering) {
    zoom.style.display = "flex";
    zoom.style.top = `${mouseY - zoomSize / 2}px`;
    zoom.style.left = `${mouseX - zoomSize / 2}px`;
    const hex = getColor();
    zoomColor.innerHTML = hex;
    zoom.style.setProperty("--color", hex);
  } else {
    zoom.style.display = "none";
  }
};

const getColor = () => {
  const pixel = ctx.getImageData(
    mouseX * (image.width / canvas.clientWidth),
    mouseY * (image.height / canvas.clientHeight),
    1,
    1,
  );
  return (
    "#" +
    Array.from(pixel.data.slice(0, 3))
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
  );
};

dropper.addEventListener("click", () => {
  dropping = !dropping;
  update();
});

canvas.addEventListener("mousemove", (event) => {
  hovering = true;
  mouseX = event.offsetX;
  mouseY = event.offsetY;
  update();
});

canvas.addEventListener("mouseout", () => {
  hovering = false;
  update();
});

canvas.addEventListener("click", () => {
  if (loaded && dropping && hovering) {
    headerColor.innerHTML = getColor();
  }
});

const loadImage = (url: string) => {
  image = new Image();
  image.addEventListener("error", () => {
    alert("Image load error");
  });
  image.addEventListener("load", () => {
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.style.aspectRatio = String(image.width / image.height);
    ctx.drawImage(image, 0, 0);
    loaded = true;
    update();
  });
  image.src = url;
};

file.addEventListener("change", () => {
  if (file.files?.length === 1) {
    loaded = false;
    update();
    const fileReader = new FileReader();
    fileReader.addEventListener("error", () => {
      alert("failed to read file");
    });
    fileReader.addEventListener("load", () => {
      loadImage(fileReader.result as string);
    });
    fileReader.readAsDataURL(file.files[0]);
  }
});

loadImage(
  "/1920x1080-4598441-beach-water-pier-tropical-sky-sea-clouds-island-palm-trees.jpg",
);
