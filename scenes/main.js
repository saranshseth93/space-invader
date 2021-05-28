const MOVE_SPEED = 200
const INVADER_SPEED = 50
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 200
const TIME_LEFT = 30
const BULLET_SPEED = 400
const bg_music = play('bg')
bg_music.volume(0.3);
bg_music.loop()

layer(['obj', 'ui'], 'obj')

addLevel([
  '!^^^^^^^^^^^^           &',
  '!^^^^^^^^^^^^           &',
  '!^^^^^^^^^^^^           &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
  '!                       &',
], {
    width: 30,
    height: 22,
    '^': [sprite('space-invader'), scale(0.6), 'space-invader'],
    '!': [sprite('wall'), 'left-wall'],
    '&': [sprite('wall'), 'right-wall'],
  })

let enemies = get("space-invader")

const player = add([
  scale(0.6),
  sprite('space-ship'),
  pos(width() / 2, height() - 20),
  origin('center')
])

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

function spawnBullet(p) {
  add([
    sprite('bullet'),
    scale(0.5),
    pos(p),
    origin('center'),
    'bullet'
  ])
}

keyPress('space', () => {
  spawnBullet(player.pos.add(0, -25))
})

action('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos.y < 0) {
    destroy(b)
  }
})

collides('bullet', 'space-invader', (b, s) => {
  play("shoot-destroy-1", {
    volume: 2.0,
    speed: 0.8,
    detune: 1200,
  });
  camShake(4)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value

  enemies = get("space-invader")
  if (enemies.length <= 0) {
    bg_music.stop()
    play("death", {
      volume: 1.0,
    })
    go('win', { score: score.value })
  }

})

const score = add([
  text('0'),
  pos(50, 50),
  layer('ui'),
  scale(3),
  {
    value: 0,
  }
])

const timer = add([
  text('0'),
  pos(width() - 50, 50),
  scale(2),
  layer('ui'),
  color(rgba(0, 1, 1, 0.9)),
  {
    time: TIME_LEFT,
  },
])


timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(0)
  if (timer.time <= 0) {
    bg_music.stop()
    play("death", {
      volume: 1.0,
    })
    go('lose', { score: score.value })
  }
})

action('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)

})



collides('space-invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space-invader', () => {
  bg_music.stop()
  play("death", {
    volume: 1.0,
  })
  go('lose', { score: score.value })
})

action('space-invader', (s) => {
  // if (s.pos.y >= (12 * 22)) {
  if (s.pos.y >= height()) {
    play("death", {
      volume: 1.0,
    })
    bg_music.stop()
    go('lose', { score: score.value })
  }
})