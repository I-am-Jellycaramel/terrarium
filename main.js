let maxZIndex = 14

dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));

function dragElement(terrariumElement) {
    // 이미지일 때만
    if (terrariumElement.tagName !== 'IMG') return;

    let pos1=0, pos2=0, pos3=0, pos4=0;
    
    terrariumElement.onpointerdown = pointerDrag;
    function pointerDrag(e) {
        e.preventDefault(); // 이벤트의 기본 동작 막기
        // console.log(e); // PointerEvent 정보 확인
        pos3 = e.clientX;
        pos4 = e.clientY;
        // 아래 속성 각각은 이벤트 핸들러이고, 그 뒤는 함수 참조임.
        document.onpointermove = elementDrag;
        document.ondblclick = pullUp;
        document.onpointerup = stopElementDrag;
    }
    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // console.log(pos1, pos2, pos3, pos4);
        // 오브젝트를 실제로 이동시키는 부분. css 로 이동시켜야 해서 css 값 바꾸어서 이동시킴.
        terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
        terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
    }
    function stopElementDrag() {
        document.onpointerup = null;
        document.onpointermove = null;
        // 여기서 제일 위로 올리는 것까지
        maxZIndex++;
        terrariumElement.style.zIndex = maxZIndex;
    }
    function pullUp() {
        maxZIndex++;
        terrariumElement.style.zIndex = maxZIndex;
    }
}