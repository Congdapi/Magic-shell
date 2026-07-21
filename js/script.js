/* =========================================================================
   마법의 소라고둥 — 인터랙션 스크립트 (Vanilla JS)
   1) 히어로 캐러셀: 자동 재생 + 수동 전환(닷 클릭) + 접근성 aria 처리
   2) 리뷰 라이트박스 모달: 클릭/키보드 오픈, 배경 클릭 및 X버튼으로 닫기
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. 히어로 캐러셀
     --------------------------------------------------------------------- */
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const AUTO_PLAY_INTERVAL = 5000; // 5초마다 자동 전환
  let currentIndex = 0;
  let autoPlayTimer = null;

  function goToSlide(index) {
    slides[currentIndex].classList.remove('is-active');
    dots[currentIndex].classList.remove('is-active');
    dots[currentIndex].setAttribute('aria-selected', 'false');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('is-active');
    dots[currentIndex].classList.add('is-active');
    dots[currentIndex].setAttribute('aria-selected', 'true');
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => goToSlide(currentIndex + 1), AUTO_PLAY_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  // 닷(인디케이터) 수동 클릭 시 해당 슬라이드로 전환하고, 자동재생 타이머를 리셋한다.
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.index);
      goToSlide(index);
      startAutoPlay();
    });
  });

  // 사용자가 캐러셀에 마우스를 올리면 잠시 자동재생을 멈춰 이미지를 편히 볼 수 있게 한다.
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  if (slides.length > 1) startAutoPlay();


  /* ---------------------------------------------------------------------
     2. 리뷰 라이트박스 모달
     --------------------------------------------------------------------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalImg = document.getElementById('modalImg');
  const modalName = document.getElementById('modalName');
  const modalRole = document.getElementById('modalRole');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const triggers = document.querySelectorAll('[data-modal-trigger]');

  let lastFocusedElement = null;

  function openModal(trigger) {
    lastFocusedElement = document.activeElement;

    modalImg.src = trigger.dataset.img;
    modalImg.alt = `${trigger.dataset.name}님의 후기 배경 이미지`;
    modalName.textContent = trigger.dataset.name;
    modalRole.textContent = trigger.dataset.role;

    modalOverlay.hidden = false;
    modalCloseBtn.focus(); // 접근성: 모달 오픈 시 포커스를 닫기 버튼으로 이동
    document.body.style.overflow = 'hidden'; // 배경 스크롤 잠금
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus(); // 접근성: 트리거 요소로 포커스 복귀
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger));
    // 키보드 접근성: Enter/Space로도 모달 오픈 가능하도록 처리
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(trigger);
      }
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);

  // 모달 바깥(어두운 배경) 클릭 시 닫기
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC 키로 모달 닫기 (키보드 접근성)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

});
