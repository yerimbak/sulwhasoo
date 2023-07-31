
/**
 * @description requestAnimationFrame으로 스크롤이벤트시 무분별한 호출을 막음(브라우저가 화면을 새로그릴때 호출)
 * @param {*} callback 실행콜백
 * @returns 래퍼함수
 */
function optimizeAnimation(callback) {
  let ticking = false

  return () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => {
        callback()
        ticking = false
      })
    }
  }
}

function reveal() {
  let windowWidth = window.innerWidth
  let windowHeight = window.innerHeight
  let windowTop = $(window).scrollTop()
  let reveals = document.querySelectorAll('.ani')
  let scBox = document.querySelector('.scroll-box')
  let wdEnd = document.querySelector('.rebloom').getBoundingClientRect().bottom - windowHeight

  //progress bar
  const barElem = document.querySelector('.progress-bar')
  // const barWarp = document.querySelector('.progress-bar-con')
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  let scrollPer = (winScroll / height) * 100
  barElem.style.width = scrollPer + '%'

  // intro fade
  let introTop = document.querySelector('.intro').getBoundingClientRect().top + windowHeight
  let introBottom = document.querySelector('.intro').getBoundingClientRect().bottom + windowHeight
  let intro1 = document.querySelector('.intro1')
  let introVideo = document.querySelector('.intro-video-box')

  // mobile - height:window-half , pc - height:window-full
  if (windowWidth < 640) {
    if (introTop + windowHeight / 2 < windowHeight && introBottom > windowHeight) {
      intro1.classList.add('fade-out')
      introVideo.classList.add('fade-in')
      barElem.parentNode.classList.remove('progress-none')
      scBox.classList.remove('back-white')
    } else if (introTop + windowHeight / 2 >= windowHeight) {
      intro1.classList.remove('fade-out')
      introVideo.classList.remove('fade-in')
      barElem.parentNode.classList.add('progress-none')
    } else {
      barElem.parentNode.classList.remove('progress-none')
    }
  } else {
    if (introTop + windowHeight < windowHeight && introBottom > windowHeight) {
      intro1.classList.add('fade-out')
      introVideo.classList.add('fade-in')
      scBox.classList.remove('back-white')
    } else if (introTop + windowHeight >= windowHeight) {
      intro1.classList.remove('fade-out')
      introVideo.classList.remove('fade-in')
    }
  }

  // cont1 video
  let cont1Top = document.querySelector('.cont1').getBoundingClientRect().top + windowHeight
  let cont1Bottom = document.querySelector('.cont1-full').getBoundingClientRect().bottom + windowHeight

  let cont11Top = document.querySelector('.cont11').getBoundingClientRect().top + windowHeight
  let cont11Bottom = document.querySelector('.cont11').getBoundingClientRect().bottom + windowHeight

  if (
    (introBottom < windowHeight && cont1Top + windowHeight > windowHeight) ||
    (cont11Top < windowHeight && cont11Bottom / 2 > windowHeight)
  ) {
    scBox.classList.add('back-white') // scrollBox color control
    barElem.parentNode.classList.add('progress-ver2') // progress color control
  } else if (cont11Top > windowHeight) {
    scBox.classList.remove('back-white')
    scBox.classList.remove('none')
    barElem.parentNode.classList.remove('progress-ver2')
  } else if (cont11Top + windowHeight <= windowHeight) {
    scBox.classList.add('back-white')
    barElem.parentNode.classList.add('progress-none')
    scBox.classList.add('none')
  }

  if ((cont1Top / 2 + cont1Top < windowHeight && cont1Bottom > windowHeight) || cont11Top <= 0) {
    scBox.classList.remove('back-white')
  }

  // cont3 scale
  let cont3 = document.querySelector('.cont3')
  let cont3ScaleBox = document.querySelector('.cont3-scale-box')
  let cont3Top = cont3.getBoundingClientRect().top + windowHeight
  let cont3Bottom = cont3.getBoundingClientRect().bottom

  if (cont3Top < windowHeight && cont3Bottom > windowHeight) {
    cont3ScaleBox.classList.add('video-scale')
    scBox.classList.remove('back-white')
  } else if (cont3Top > windowHeight) {
    cont3ScaleBox.classList.remove('video-scale')
  }

  scrollBox(introTop, introBottom, windowWidth, windowHeight)

  let activeHeight = 0 // active 객체
  let activeCount = 0 // active 안 콘텐츠 갯수
  let activeNum = 1 // active 콘텐츠 분기
  for (let i = 0; i < reveals.length; i++) {
    let elementTop = reveals[i].getBoundingClientRect().top + windowHeight
    let elementEnd = reveals[i].getBoundingClientRect().bottom

    if (elementEnd <= windowHeight) {
      reveals[i].classList.add('end')
    } else {
      reveals[i].classList.remove('end')
    }

    if (elementTop < windowHeight) {
      reveals[i].classList.add('active')

      if (reveals[i].classList.contains('cont3') || reveals[i].classList.contains('cont11')) {
        activeHeight = parseInt(reveals[i].getBoundingClientRect().height)
      } else {
        activeHeight = parseInt(reveals[i].getBoundingClientRect().height - windowHeight / 2)
      }

      if (activeHeight > windowHeight) {
        if (reveals[0].getBoundingClientRect().bottom > 0) {
          // intro active control
          if (elementTop < windowHeight && elementTop + activeHeight > windowHeight) {
            activeCount = parseInt(activeHeight / windowHeight)

            for (a = 0; a <= activeCount; a++) {
              if (elementTop > -(windowHeight * a) && elementTop <= -(windowHeight * (a - 1))) {
                activeNum = a + 1
              }
              reveals[i].classList.remove('now' + (a + 1))
            }
            reveals[i].classList.add('now' + activeNum)
          }
        } else if (
          // cont3 active control
          reveals[3].getBoundingClientRect().top + windowHeight < windowHeight &&
          reveals[3].getBoundingClientRect().bottom > 0
        ) {
          activeHeight = parseInt(reveals[i].getBoundingClientRect().height - windowHeight)
          let windowHeight2 = windowHeight / 2
          elementTop = reveals[i].getBoundingClientRect().top + windowHeight2

          if (elementTop < windowHeight2 && elementTop + activeHeight > windowHeight2) {
            activeCount = parseInt(activeHeight / windowHeight2)

            for (a = 0; a <= activeCount; a++) {
              if (elementTop > -(windowHeight2 * a) && elementTop <= -(windowHeight2 * (a - 1))) {
                activeNum = a + 1
              }
              reveals[i].classList.remove('now' + (a + 1))
            }
            reveals[i].classList.add('now' + activeNum)
          }
        } else {
          // other active control
          if (elementTop < windowHeight && elementTop + activeHeight > windowHeight) {
            activeCount = parseInt(activeHeight / windowHeight)

            for (a = 0; a <= activeCount; a++) {
              if (elementTop > -(windowHeight * a) && elementTop <= -(windowHeight * (a - 1))) {
                activeNum = a + 1
              }
              reveals[i].classList.remove('now' + (a + 1))
            }
            reveals[i].classList.add('now' + activeNum)
          }
        }
      }
    } else {
      reveals[i].classList.remove('now1')
      reveals[i].classList.remove('active')
    }
  }

  vControl(windowTop)
  endRedirect(windowWidth, wdEnd)
}

window.addEventListener('load', () => {
  reveal()
  ifTop()
  document.querySelector('.progress-bar-con').classList.add('progress-none')
  window.addEventListener('scroll', optimizeAnimation(reveal), {passive: true})
})

// scrollBox control
function scrollBox(introTop, introBottom, windowWidth, windowHeight) {
  let scBox = document.querySelector('.scroll-box')
  if (windowWidth > 640) {
    if (introTop < windowHeight) {
      scBox.classList.add('scroll-inpro')
    } else {
      scBox.classList.remove('scroll-inpro')
    }
  } else {
    if (
      introBottom - (windowHeight * 2 - windowHeight / 2) <= windowHeight &&
      introBottom - windowHeight > windowHeight
    ) {
      scBox.classList.add('mo-fade')
    } else if (
      introBottom - windowHeight < windowHeight ||
      (introTop < windowHeight && introBottom - windowHeight > windowHeight)
    ) {
      scBox.classList.add('none')
    } else {
      scBox.classList.remove('mo-fade')
    }
  }
}

let nowEnd = false // location 중복 방지

// top control
function scrollBoxTop() {
  let windowHeight = window.innerHeight
  let scBox = document.querySelector('.scroll-top')

  scBox.addEventListener('click', function () {
    anis = document.querySelectorAll('.ani')
    if ($(window).scrollTop() > windowHeight) {
      $(window).scrollTop(0)
      nowEnd = true
      ifTop()
    } else {
      return
    }
  })
}

function ifTop() {
  $("[class*='now']").each(function () {
    let str = $(this).attr('class')
    str = str.replace('now', '')
    $(this).attr('class', str)
    /*
    let nowList = $(this).attr('class').split(' ')
    nowList = nowList.splice(nowList.length - 1, 1)
    $(this).removeClass(nowList)
    */
  })
  if (nowEnd == false && $(window).scrollTop() > 0) {
    setTimeout(function () {
      $(window).scrollTop(0)
    }, 0)
    setTimeout(function () {
      nowEnd = true
    }, 1500)
  } else {
    nowEnd = true
  }
}

scrollBoxTop()

// video control
function vControl(windowTop) {
  const cont3 = document.querySelector('.cont3')
  const cont3Video = document.querySelector('.cont3-video video')

  if (cont3.classList.contains('now1') == true) {
    let scMin = cont3.offsetTop
    let scMax = cont3.offsetTop + window.innerHeight / 2

    let min = 1 / (scMax - scMin)
    let max = -(min * scMin)
    let totalTime = min * windowTop + max

    cont3Video.currentTime = totalTime
  } else {
    return
  }
}

// film-right control
function filmNextClick() {
  const filmNext = document.querySelectorAll('.film-next-btn')
  const filmPrev = document.querySelectorAll('.film-prev-btn')
  const body = document.querySelector('body')
  let offsetY = 0

  filmNext.forEach(function (fn) {
    fn.addEventListener('click', function () {
      offsetY = $(window).scrollTop()
      body.style.top = '-' + offsetY + 'px'
      body.classList.add('scroll-rock')
      if (fn.classList.contains('cont1-next') == true) {
        fn.closest('.cont1-film').classList.add('film-next-show')
        fn.closest('.film-box').nextElementSibling.setAttribute('aria-hidden', false)
      } else {
        fn.closest('.cont9').classList.add('film-next-show')
        fn.closest('.cont9-bottom').nextElementSibling.setAttribute('aria-hidden', false)
      }
    })
  })

  filmPrev.forEach(function (fp) {
    fp.addEventListener('click', function () {
      body.style = ''
      body.classList.remove('scroll-rock')
      $(window).scrollTop(offsetY)
      if (fp.classList.contains('cont1-prev') == true) {
        fp.closest('.cont1-film').classList.remove('film-next-show')
        fp.closest('.film-box-next').setAttribute('aria-hidden', true)
        fp.previousElementSibling.children[0].contentWindow.postMessage(
          '{"event":"command","func":"' + 'stopVideo' + '","args":""}',
          '*'
        )
      } else {
        fp.closest('.cont9').classList.remove('film-next-show')
        fp.closest('.cont9-right').setAttribute('aria-hidden', true)
        fp.previousElementSibling.children[0].contentWindow.postMessage(
          '{"event":"command","func":"' + 'stopVideo' + '","args":""}',
          '*'
        )
      }
    })
  })
}

filmNextClick()

function endRedirect(windowWidth, wdEnd) {
  if (nowEnd == true && windowWidth > 640) {
    if (wdEnd <= 0) {
      setTimeout(function () {
        window.location.assign('https://www.sulwhasoo.com/kr/ko/about/beauty-grows-campaign/brand-manifesto.html')
      }, 1500)
    }
  }
}

window.addEventListener('resize', () => {
  reveal()
})
