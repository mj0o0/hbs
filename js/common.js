
 
$(function(){
  let lang = $('html').attr('lang') || 'ko'

  // 상단 gnb 부분
  $.getJSON(`/inc/menu_${lang}.json`, function(data){
    const depth1 = data.depth1;
    const depth2 = data.depth2;
    const link = data.link;

    let html = '';

    for (let i = 0; i < depth1.length; i++) {
      const d1 = depth1[i];
      const hasSub = depth2[d1] && depth2[d1].length > 0;

      html += `<li class="depth_item depth1_item${hasSub ? ' has' : ''} ">
               <a class="depth_text depth1_text" href="${hasSub ? '#' : (link[d1] || '#')}">${d1}</a>`;
      
      if (hasSub) {
        html += `<div class="depth depth2"> <ul class="depth_list depth2_list">`;
        for (let j = 0; j < depth2[d1].length; j++) {
          const d2 = depth2[d1][j];
          html += `<li class="depth_item depth2_item">
                   <a class="depth_text depth2_text" href="${link[d2] || '#'}">${d2}</a>
                   </li>`;
        }
        html += `</ul></div>`;
      }
      html += `</li>`
    } 
    $('#header .depth_list').html(html);

    // .has 클래스는 자동으로 처리되나 제어하는 개념으로 아래 처리
    $('.depth_item').each(function(){
      if ($(this).find('.depth2').length > 0 ) {
        $(this).addClass('has')
      }
    })
  });

});
  // 맨 위인지 판단
function updateScrollState() {
  const scrollTop = $(window).scrollTop();
  const currentState = $('body').attr('data-top');
  const newState = scrollTop > 0 ? 'no-top' : 'top';

  if (currentState !== newState) {
    $('body').attr('data-top', newState);
  }
}
updateScrollState();
$(window).on('scroll', updateScrollState);


$(function (){
  // 현재, 이전 스크롤 위치
  let prevScrollTop = 0;
  const getScrollDirection = (current, previous) => (previous - current > 0 ? 'up' : 'down');

  // 스크롤 업/다운 체크
  $(window).on('scroll', function(){
    const currentScrolltop = $(this).scrollTop();

    if (currentScrolltop > 0 ) {
      const direction = getScrollDirection(currentScrolltop, prevScrollTop);
      $('html').toggleClass('scroll_down', direction == 'down');
      prevScrollTop = currentScrolltop;
    } else {
      $('html').removeClass('scroll_down');
    }
  });

  // pc 1차 메뉴 호버시 전체 gnb 열기/닫기
  $('#header').hover(
    function (){
      if (window.innerWidth > 1200) $('html').addClass('gnb_open');
    },
    function (){
    if (window.innerWidth > 1200) $('html').removeClass('gnb_open');
    }
  );

// pc 메뉴 펼치기 
$(document).on('click', '.depth_text', function(e) {
  const $item = $(this).parent();
  const husSubMenu = $item.hasClass('has');
  const isAcative = $item.hasClass('active');
  const isDepth2 = $(this).hasClass('depth2_text');
  const isPc = window.innerWidth > 1200;

  if (!husSubMenu) return; // 하위 메뉴가 없다면

  e.preventDefault(); // a 태그 클릭시 페이지 이동 막음

  if (isPc && isDepth2) {
    $('.depth2_item').removeClass('active');
    if (!isAcative) $item.addClass('active');
  } else if (!isPc){
    $('.depth2_item').removeClass('active');
    if (!isAcative) $item.addClass('active').siblings().removeClass('active');
  }

});

// 키보드 진입/이탈 시 gnb 열기/닫기
$(document)
  .on('focusin', '.depth1_text', () => {
    $('html').addClass('gnb_open');
  })
  .on('focusout', '.depth1_item:last-child .depth_item:last-child .depth_text', () => {
    $('html').removeClass('gnb_open');
  })

  // 모바일 gnb 열기/닫기
  $('.menu_open').on('click', () => {
    $('html').addClass('gnb_open')
  });
  });
  $('.menu_close').on('click', () => {
  $('html').removeClass('gnb_open');
  $('.depth_item').removeClass('active')
  });


