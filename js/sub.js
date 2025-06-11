
(function($){
  const lang = document.documentElement.lang || 'ko';

  const pathParts = window.location.pathname.split('/');
  const fileName = pathParts.pop(); //pop() : 배열의 가장 마지막 요소 제거하고 그 값을 반환
  //01_about.html 

  const urlBase = '/inc/menu_' + lang + '.json'
  //const urlBase = `/inc/menu_${lang}.json`

  $.ajax({ // ajax: jQuery의 브라우저에서 서버로 데이터를 주고 받기 위한 요청 함수
    type: 'GET', // HTTP 요청 방식 (GET, POST 등) => GET(서버에서 정보를 가져올 때) / POST(서버에 정보를 제출, 생성, 전송)
    url: urlBase,
    async: false, // 비동기 여부(기본은 true:권장)
    dateType: 'json',
    success: function(data){
      const { link,depth2 } = data;

      const menuKeys = Object.keys(link);
      const nowPageKey = menuKeys.find(key => link[key].endsWith('/'+fileName));

      if (!nowPageKey) return;

      const parentKey = Object.keys(depth2).find(depth1 => depth2[depth1].includes(nowPageKey));
      if (!parentKey) return;

      // page_name은 depth1 출력
      const pageNameEl = document.querySelector('h2.page_name');
      if (pageNameEl) pageNameEl.innerText = parentKey;

      // title은 그대로 depth2 제목 출력
      const titlePrefix = '|회사소개';
      document.title = `${nowPageKey}${titlePrefix}`;
      
      // path_list 랜드링
      const html = depth2[parentKey].map(key => {
        const isActive = key === nowPageKey;
        return `<li class="path_item${isActive ? ' active' : ''}">
          <a class="path_text" href="${link[key]}"><span>${key}</span></a>
        </li>`;
      }).join('');

      const pathLineEl = document.querySelector('.path_wrap .path_list');
      if (pathLineEl) pathLineEl.innerHTML = html;

    }
  });
  const url = location.href.split('#')[0];

  // tab 메뉴 처리
  function activeTab(index) {
    $('.sub_tabbox .tab_list li').eq(index).addClass('active').siblings().removeClass('active');
    $('.tab_match .matchbox').eq(index).addClass('active').siblings().removeClass('active');

    // 탭 목록 스크롤 이동
    const $tab = $('.sub_tabbox .tab_list li').eq(index).find('.tab_btn');
    $('.sub_tabbox .tab_list').animate({
      scrollLeft:$tab.offset().left
    },200);

    // 화면 스크롤 이동
    $('html, body').animate({
      scrollTop: $('.sub_tabbox').offset().top + 10
    },300, 'swing')
  }

  // 1. 해시값이 있을 경우 해당 탭 활성화 
  if (location.hash) { // 현재 url에 # 해시값이 있는지 확인
    const hashNumber = Number(location.hash.replace('#','')); // Number함수 해시를 제거하고 숫자로 변환
    if (!isNaN(hashNumber) && hashNumber > 0) {
      activeTab(hashNumber - 1);
    }
  }

  // 2. 탭 클릭 이벤트
  $('.sub_tabbox').on('click', '.tab_list li .tab_btn',function(){
    const index = $(this).parent().index();
    activeTab(index);
    history.replaceState(null, null, url + '#' + (index+1)); // 해시 업데이트
  });

  // 3. 스크롤 고정
  if($('.sub_tabbox').length > 0) {
    $(window).on('scroll',function(){
      const nowTop = $(document).scrollTop();
      const tabTop = $('.sub_tabbox').offset().top;
      $('.sub_tabbox .tab_list').toggleClass('fixed', nowTop > tabTop);
    });
  }
  // 반응형 테이블
  $('.table.responsive').each(function(){
    const $table = $(this);
    const $header = $table.find('thead th');

    $table.find('tbody tr').each(function(){
      const $cells = $(this).find('td');

      $cells.each(function (index){
        const headerText = $header.eq(index).text().trim();
        $(this).attr('data-content', `${headerText} : `);
      });
    });
  });

  // open-table
  $('.open_table').on('click', function(){
    const $btn = $(this);
    const $target = $btn.next('.conbox');
    const isOpen = $btn.attr('title') === '열기';

    if (window.innerWidth < 1001) {
      $btn
        .attr('title', isOpen ? '닫기' : '열기')
        .toggleClass('on', isOpen);

        $target.stop(true).slideToggle(300);      
    }
  });

})(jQuery);

// 브랜드 상품 팝업 처리
const urlParams = new URL(location.href).searchParams;
const brandId = urlParams.get('brandId');

//팝업 열기 함수
function openBrandPopup(brand) {
  const $popup = $('.brand_layer_popup');
  $popup.addClass('on')
        .find('ly_' + brand).addClass('active')
        .siblings().removeClass('active');

  $popup.find('.layer_close').focus();
  $('body').addClass('lock');
}

//팝업 닫기 함수
function closeBrandPopup() {
  const activeBrand = $('.layer_con.active').data('brand');
  $('.brand_layer_popup').removeClass('on');
  // $('.brand_box button[data-brand = "' + activeBrand + '"]').focus()
  $(`.brand_box button[data-brand = "${activeBrand}"]`).focus()
  $('body').removeClass('lock');
}

// url에 브랜드 id가 있으면 팝업 자동 오픈
if (brandId) {
  openBrandPopup(brandId);
}
  // 브랜드 버튼 클릭 시 팝업 오픈
  $('.brand_box button').on('click', function (){
    const brand = $(this).data('brand');
    openBrandPopup(brand);

  })

  // 닫기 버튼 클릭 시 팝업 닫기
  $('.layer_close').on('click', closeBrandPopup);

  // 바깥 영역 클릭 시 팝업 오픈
  $('.brand_layer_popup').on('click', function(e){
    if(!$(e.target).closest('.layer_con').length) {
      $(this).removeClass('on');
      $('body').removeClass('lock');
    }
  })




