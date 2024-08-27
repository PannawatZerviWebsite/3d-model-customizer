const LOADER = document.getElementById("js-loader");
const DRAG_NOTICE = document.getElementById("js-drag-notice");
const TRAY = document.getElementById("js-tray-slide");
var theModel;
const MODEL_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb";
var loaded = !1;
var cameraFar = 5;
var activeOption = "legs";
const colors = [
  // { texture: "./img/wood.jpg",
  //   size: [1, 1, 1],
  //   shininess: 0 },
  // { texture: "./img/pool.jpg",
  //   size: [1, 1, 1],
  //   shininess: 0 },
  // { texture: "./img/table.jpg",
  //   size: [6, 6, 6],
  //   shininess: 0 },
  // { texture: "./img/brick.jpg",
  //   size: [6, 6, 6],
  //   shininess: 0 },
  // { texture: "./img/art.jpg",
  //   size: [3, 3, 3],
  //   shininess: 0 },
  // { texture: "./img/ocean.jpg",
  //   size: [1, 1, 1],
  //   shininess: 0 },
  // { texture: "./img/sun.jpg",
  //   size: [6, 6, 6],
  //   shininess: 0 },
  { color: "131417" },
  { color: "374047" },
  { color: "5f6e78" },
  { color: "7f8a93" },
  { color: "97a1a7" },
  { color: "acb4b9" },
  { color: "DF9998" },
  { color: "7C6862" },
  { color: "A3AB84" },
  { color: "D6CCB1" },
  { color: "F8D5C4" },
  { color: "A3AE99" },
  { color: "EFF2F2" },
  { color: "B0C5C1" },
  { color: "8B8C8C" },
  { color: "565F59" },
  { color: "CB304A" },
  { color: "FED7C8" },
  { color: "C7BDBD" },
  { color: "3DCBBE" },
  { color: "264B4F" },
  { color: "389389" },
  { color: "85BEAE" },
  { color: "F2DABA" },
  { color: "F2A97F" },
  { color: "D85F52" },
  { color: "D92E37" },
  { color: "FC9736" },
  { color: "F7BD69" },
  { color: "A4D09C" },
  { color: "4C8A67" },
  { color: "25608A" },
  { color: "75C8C6" },
  { color: "F5E4B7" },
  { color: "E69041" },
  { color: "E56013" },
  { color: "11101D" },
  { color: "630609" },
  { color: "C9240E" },
  { color: "EC4B17" },
  { color: "281A1C" },
  { color: "4F556F" },
  { color: "64739B" },
  { color: "CDBAC7" },
  { color: "946F43" },
  { color: "66533C" },
  { color: "173A2F" },
  { color: "153944" },
  { color: "27548D" },
  { color: "438AAC" },
];
const BACKGROUND_COLOR = 0xf1f1f1;
const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !0 });
renderer.shadowMap.enabled = !0;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = cameraFar;
camera.position.x = 0;
const INITIAL_MTL = new THREE.MeshPhongMaterial({
  color: 0xf1f1f1,
  shininess: 10,
});
const INITIAL_MAP = [
  { childID: "back", mtl: INITIAL_MTL },
  { childID: "base", mtl: INITIAL_MTL },
  { childID: "cushions", mtl: INITIAL_MTL },
  { childID: "legs", mtl: INITIAL_MTL },
  { childID: "supports", mtl: INITIAL_MTL },
];
var loader = new THREE.GLTFLoader();
loader.load(
  MODEL_PATH,
  function (gltf) {
    theModel = gltf.scene;
    theModel.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = !0;
        o.receiveShadow = !0;
      }
    });
    theModel.scale.set(2, 2, 2);
    theModel.rotation.y = Math.PI;
    theModel.position.y = -1;
    for (let object of INITIAL_MAP) {
      initColor(theModel, object.childID, object.mtl);
    }
    scene.add(theModel);
    LOADER.remove();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
function initColor(parent, type, mtl) {
  parent.traverse((o) => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type;
      }
    }
  });
}
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);
var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = !0;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xeeeeee,
  shininess: 0,
});
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = !0;
floor.position.y = -1;
scene.add(floor);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = !0;
controls.enablePan = !1;
controls.dampingFactor = 0.1;
controls.autoRotate = !1;
controls.autoRotateSpeed = 0.2;
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  if (theModel != null && loaded == !1) {
    initialRotation();
    DRAG_NOTICE.classList.add("start");
  }
}
animate();
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, !1);
  }
  return needResize;
}
window.onscroll = function () {
  window.scrollTo(0, 0);
};
function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement("div");
    swatch.classList.add("tray__swatch");
    if (color.texture) {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else {
      swatch.style.background = "#" + color.color;
    }
    swatch.setAttribute("data-key", i);
    TRAY.append(swatch);
  }
}
buildColors(colors);
const options = document.querySelectorAll(".option");
for (const option of options) {
  option.addEventListener("click", selectOption);
}
function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove("--is-active");
  }
  option.classList.add("--is-active");
}
const swatches = document.querySelectorAll(".tray__swatch");
for (const swatch of swatches) {
  swatch.addEventListener("click", selectSwatch);
}
function selectSwatch(e) {
  let index = parseInt(e.target.dataset.key);
  if (isNaN(index) || index < 0 || index >= colors.length) {
    console.error("Invalid color index:", index);
    return;
  }
  let color = colors[index];
  let new_mtl;
  if (color.texture) {
    let txt = new THREE.TextureLoader().load(color.texture);
    txt.repeat.set(
      color.size ? color.size[0] : 1,
      color.size ? color.size[1] : 1
    );
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;
    new_mtl = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10,
    });
  } else {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt("0x" + color.color),
      shininess: color.shininess ? color.shininess : 10,
    });
  }
  setMaterial(theModel, activeOption, new_mtl);
}
function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}
let initRotate = 0;
function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = !0;
  }
}
var slider = document.getElementById("js-tray"),
  sliderItems = document.getElementById("js-tray-slide"),
  difference;
function slide(wrapper, items) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    threshold = 20,
    posFinal,
    slides = items.getElementsByClassName("tray__swatch");
  items.onmousedown = dragStart;
  items.addEventListener("touchstart", dragStart);
  items.addEventListener("touchend", dragEnd);
  items.addEventListener("touchmove", dragAction);
  function dragStart(e) {
    e = e || window.event;
    posInitial = items.offsetLeft;
    difference = sliderItems.offsetWidth - slider.offsetWidth;
    difference = difference * -1;
    if (e.type == "touchstart") {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }
  function dragAction(e) {
    e = e || window.event;
    if (e.type == "touchmove") {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    if (
      items.offsetLeft - posX2 <= 0 &&
      items.offsetLeft - posX2 >= difference
    ) {
      items.style.left = items.offsetLeft - posX2 + "px";
    }
  }
  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
    } else if (posFinal - posInitial > threshold) {
    } else {
      items.style.left = posInitial + "px";
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
slide(slider, sliderItems);
const downloadButton = document.getElementById("download-btn");
const exporter = new THREE.GLTFExporter();
downloadButton.addEventListener("click", () => {
  if (!theModel) {
    console.error("No model loaded!");
    return;
  }
  exporter.parse(
    theModel,
    function (result) {
      const blob = new Blob([result], { type: "model/gltf-binary" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "customized_model.glb";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    { binary: !0 }
  );
});
