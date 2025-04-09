// scriptCard.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".stack-container");

  const cardCount = 8;
  const radius = 400; // 원형 반지름

  for (let i = 0; i < cardCount; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundImage = `url('https://source.unsplash.com/random/800x600?sig=${i}')`;

    // 회전 위치 계산
    const angle = (360 / cardCount) * i;
    card.style.transform = `
      rotateY(${angle}deg) 
      translateZ(${radius}px) 
      rotateX(-10deg)
    `;

    container.appendChild(card);
  }

  // 회전 애니메이션 (스크롤 대신 간단한 자동 회전)
  let angle = 0;
  setInterval(() => {
    angle += 0.5;
    container.style.transform = `rotateY(${angle}deg)`;
  }, 30);
});
