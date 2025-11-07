const mainSpaceElement = document.getElementById("main-space");

// todo 현재 재설정 버튼 방식이 기존 document 에 있는 plant 들을 불러오는 방식이라 
// todo element 를 지워버리는 지금 방식이랑 맞지 않아 오류가 발생함.
// todo 차후 동적으로 plant img 를 만들어주는 식으로 할 수 있음.
function reset() {
    for (let i = 1; i < 15; i++) {
        let plant = document.getElementById(`plant${i}`);
        setRandomLoc(plant);
    }
}
function setRandomLoc(plant) {
    const clWidth = mainSpaceElement.clientWidth - 30;
    const clHeight = mainSpaceElement.clientHeight - 30;
    const randomX = Math.random() * (clWidth - plant.offsetWidth);
    const randomY = Math.random() * (clHeight - plant.offsetHeight);

    // mainSpace 기준 상대 위치로 설정
    plant.style.left = `${randomX}px`; // 가로
    plant.style.top = `${randomY}px`;  // 세로
}

// todo 결과물 이미지로 다시 합성을 하는 경우 오류가 발생함. 
// todo 이 문제는 새 결과물은 합성이 안 되게끔 하거나, 아니면 그 옆에 지금 게 덧붙여지는 
// todo 방식으로 콘텐츠의 재미를 살릴 수도 있을 것 같음.
function setDragEvents(el) {
    el.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/plain", el.id);
    });
    el.addEventListener("dragover", (ev) => {
        ev.preventDefault();
    });
    el.addEventListener("drop", async (e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text/plain");

        if (!draggedId || draggedId === e.target.id) return;

        const targetImg = e.target;
        const draggedImg = document.getElementById(draggedId);

        // 두 이미지 로드 함수
        const loadImage = (src) => new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.src = src.src;
        });

        const [img1, img2] = await Promise.all([
            loadImage(draggedImg),
            loadImage(targetImg)
        ]);

        // canvas 생성 및 그리기
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img2, 0, 0, 100, 100);
        ctx.drawImage(img1, 100, 0, 100, 100);
        const mergedUrl = canvas.toDataURL('image/png');

        const t = targetImg;
        console.log(`${t.style.left}, ${t.style.top}`);
        const midX = roundTo3((Number(targetImg.style.left.slice(0, -2)) + Number(draggedImg.style.left.slice(0, -2)))/2);
        const midY = roundTo3((Number(targetImg.style.top.slice(0, -2)) + Number(draggedImg.style.top.slice(0, -2)))/2);
        console.log(`(${midX}, ${midY})`)

        // 결과 이미지 만들기
        const mergedImg = document.createElement('img');
        mergedImg.src = mergedUrl;
        mergedImg.style.position = 'absolute';
        moveToPoint(mergedImg, midX, midY);
        // mergedImg.style.transform = 'translate(-100%, -100%)';
        mergedImg.alt = 'merged result';

        moveToPoint(targetImg, midX, midY);
        processMergeAnimation(draggedImg, midX, midY, ()=>{
            // 기존 이미지 제거
            draggedImg.remove();
            targetImg.remove();
            // 결과 이미지 보이기
            document.getElementById("main-space").appendChild(mergedImg);
        });
    });
}

function moveToPoint(el, x, y) {
    el.style.left = `${x}px`
    el.style.top = `${y}px`
}

function processMergeAnimation(el, targetX, targetY, callback) {
    const properties = ["left", "top"];
    const finished = new Set();

    const handler = (event) => {
        if (properties.includes(event.propertyName)) {
            finished.add(event.propertyName);
        }
        // 두 속성 모두 끝났을 때
        if (finished.size === properties.length) {
            el.removeEventListener("transitionend", handler);
            if (callback) callback();
        }
    };

    el.addEventListener("transitionend", handler);

    requestAnimationFrame(()=>{moveToPoint(el, targetX, targetY)});
}

function roundTo3(num) {
    return Math.round(num * 1000) / 1000;
}

/* -------------------------- 메인 로직 -------------------------- */
document.getElementById("regen-btn").addEventListener("click", reset);

for (let i = 1; i < 15; i++) {
    let plant = document.getElementById(`plant${i}`);
    plant.setAttribute("draggable", "true");
    setRandomLoc(plant);
    setDragEvents(plant);
}