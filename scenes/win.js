add([
  text('YOU WIN'),
  origin('center'),
  scale(10),
  pos(width()/2, height()/2)
])

add([
  text('Score: '+args.score),
  origin('center'),
  scale(4),
  pos(width()/2, height()/2 + 70),
  color(0,1,0)
])