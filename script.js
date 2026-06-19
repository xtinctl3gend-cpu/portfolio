// nav stuff
const nav = document.getElementById('nav')
const menuBtn = document.getElementById('menuToggle')
const mobileNav = document.getElementById('mobileMenu')

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled')
  } else {
    nav.classList.remove('scrolled')
  }
}, { passive: true })

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open')
    menuBtn.classList.toggle('open', isOpen)
    mobileNav.setAttribute('aria-hidden', !isOpen)
  })

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open')
      menuBtn.classList.remove('open')
      mobileNav.setAttribute('aria-hidden', true)
    })
  })
}

// cursor follow effect - skip on touch devices
const glowEl = document.getElementById('cursorGlow')
if (glowEl && !window.matchMedia('(pointer: coarse)').matches) {
  let mouseX = -999, mouseY = -999
  let curX = -999, curY = -999

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX
    mouseY = e.clientY
  }, { passive: true })

  function updateCursor() {
    curX += (mouseX - curX) * 0.08
    curY += (mouseY - curY) * 0.08
    glowEl.style.left = curX + 'px'
    glowEl.style.top = curY + 'px'
    requestAnimationFrame(updateCursor)
  }
  updateCursor()
} else if (glowEl) {
  glowEl.style.display = 'none'
}

// particles canvas
const canvas = document.getElementById('particles')
if (canvas) {
  const ctx = canvas.getContext('2d')
  let W = canvas.width = canvas.offsetWidth
  let H = canvas.height = canvas.offsetHeight

  window.addEventListener('resize', () => {
    W = canvas.width = canvas.offsetWidth
    H = canvas.height = canvas.offsetHeight
  })

  // spawn particles
  const dots = []
  const total = 80
  const cols = ['rgba(139,92,246,', 'rgba(236,72,153,', 'rgba(167,139,250,']

  for (let i = 0; i < total; i++) {
    dots.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.6 + 0.1,
      col: cols[Math.floor(Math.random() * cols.length)],
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2
    })
  }

  function drawDots() {
    ctx.clearRect(0, 0, W, H)

    for (let d of dots) {
      d.x += d.vx
      d.y += d.vy
      d.phase += d.speed

      if (d.x < 0) d.x = W
      if (d.x > W) d.x = 0
      if (d.y < 0) d.y = H
      if (d.y > H) d.y = 0

      const alpha = d.a * (0.5 + 0.5 * Math.sin(d.phase))
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = d.col + alpha + ')'
      ctx.fill()
    }

    requestAnimationFrame(drawDots)
  }
  drawDots()
}

// scroll reveal - using IntersectionObserver
const revealEls = document.querySelectorAll('.reveal')

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    entry.target.classList.add('is-visible')
    revealObs.unobserve(entry.target)
  })
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
})

revealEls.forEach(el => revealObs.observe(el))

// skill bars animate when they scroll into view
const skillEls = document.querySelectorAll('.skill-item')

const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const i = [...skillEls].indexOf(entry.target)
    setTimeout(() => entry.target.classList.add('is-visible'), i * 60)
    skillObs.unobserve(entry.target)
  })
}, { threshold: 0.2 })

skillEls.forEach(el => skillObs.observe(el))

// typing effect on the hero headline
const typingEl = document.getElementById('typingTarget')
const typingCursor = document.getElementById('typingCursor')

if (typingEl && typingCursor) {
  const words = ['worlds.', 'games.', 'systems.', 'experiences.']
  let wi = 0
  let ci = words[0].length
  let deleting = false

  typingCursor.style.opacity = '0'
  setTimeout(() => typingCursor.style.opacity = '1', 1500)

  function tick() {
    const word = words[wi]

    if (!deleting) {
      typingEl.textContent = word.slice(0, ci)
      if (ci === word.length) {
        deleting = true
        setTimeout(tick, 2200)
        return
      }
      ci++
      setTimeout(tick, 95)
    } else {
      typingEl.textContent = word.slice(0, ci)
      if (ci === 0) {
        deleting = false
        wi = (wi + 1) % words.length
        setTimeout(tick, 400)
        return
      }
      ci--
      setTimeout(tick, 55)
    }
  }

  setTimeout(tick, 2000)
}

// discord copy button
const discordBtn = document.getElementById('discordCopy')
const discordVal = document.getElementById('discordValue')

if (discordBtn && discordVal) {
  discordBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('kungfupandamaster')
    } catch {
      // fallback for browsers that block clipboard
      const tmp = document.createElement('textarea')
      tmp.value = 'kungfupandamaster'
      document.body.appendChild(tmp)
      tmp.select()
      document.execCommand('copy')
      document.body.removeChild(tmp)
    }

    discordVal.textContent = 'Copied!'
    discordBtn.classList.add('copied')

    setTimeout(() => {
      discordVal.textContent = 'kungfupandamaster'
      discordBtn.classList.remove('copied')
    }, 2000)
  })
}

// highlight active nav link based on scroll position
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)')

const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + entry.target.id
        ? 'var(--color-text)'
        : ''
    })
  })
}, { rootMargin: '-40% 0px -50% 0px' })

sections.forEach(s => navObs.observe(s))
