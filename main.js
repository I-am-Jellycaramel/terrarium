const mainSpaceElement = document.getElementById("main-space");

function reset() {
    for (let i = 1; i < 15; i++) {
        let plant = document.getElementById(`plant${i}`);
        setRandomLoc(plant);
    }
}
function setRandomLoc(plant) {
    const clWidth = mainSpaceElement.clientWidth- 30;
    const clHeight = mainSpaceElement.clientHeight - 30;
    const randomX = Math.random() * (clWidth - plant.offsetWidth);
    const randomY = Math.random() * (clHeight - plant.offsetHeight);

    // mainSpace 기준 상대 위치로 설정
    plant.style.left = `${randomX}px`; // 가로
    plant.style.top = `${randomY}px`;  // 세로
}
function dragstartHandler(ev) {
  // Add different types of drag data
  
}

function setDragEvents(el) {
    el.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/plain", ev.target.src);
    });
    el.addEventListener("dragover", (ev) => {
        ev.preventDefault();
    });
    el.addEventListener("drop", (ev) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text/plain");
        ev.target.append(data);
    });
}

document.getElementById("regen-btn").addEventListener("click", reset);

for (let i = 1; i < 15; i++) {
    let plant = document.getElementById(`plant${i}`);
    plant.setAttribute("draggable", "true");
    setRandomLoc(plant);
    setDragEvents(el);
}