# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    caster.coffee                                      :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mlalisse <mlalisse@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2014/01/14 01:22:40 by mlalisse          #+#    #+#              #
#    Updated: 2014/01/19 18:18:25 by mlalisse         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

canvas = document.getElementsByTagName("canvas")[0]
ctx = canvas.getContext("2d")

canvas.clean = (ctx) ->
  ctx.fillStyle = "rgb(255, 255, 255)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

map = new Array()
map.push [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1]
map.push [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1]
map.push [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,2,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,2,0,0,0,0,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,2,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,2,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
map.push [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

block =
  empty: 0

img = new Image()
img.src = 'mur.jpg'
img.onload = ->
  draw()

player  = { x: 22.0, y: 12.0 }
dir     = { x: -1, y: 0 }
plane   = { x: 0, y: 0.66 }

Math.fabs = (x) -> Math.abs Math.floor(x)

draw_column = (x, height, type, side) ->

draw = ->

  canvas.clean(ctx)

  x = 0
  while x < canvas.width
    camera = x: (2 * x / canvas.width - 1)
    ray = x: player.x, y: player.y, dir:
      x: (dir.x + plane.x * camera.x)
      y: (dir.y + plane.y * camera.x)

    # which box of the map we're in
    cast =
      x: Math.floor(ray.x)
      y: Math.floor(ray.y)

    #length of ray from one x or y-side to next x or y-side
    delta =
      x: Math.sqrt(1 + (ray.dir.y * ray.dir.y) / (ray.dir.x * ray.dir.x))
      y: Math.sqrt(1 + (ray.dir.x * ray.dir.x) / (ray.dir.y * ray.dir.y))

    run = x: 0, y: 0

    step = x: 0, y: 0
    hit = 0 #was there a wall hit?

    side = undefined #was a NS or a EW wall hit?

    step.x = if (ray.dir.x < 0) then -1 else 1
    step.y = if (ray.dir.y < 0) then -1 else 1

    if (ray.dir.x < 0)
      run.x = (ray.x - cast.x) * delta.x
    else
      run.x = (cast.x + 1.0 - ray.x) * delta.x

    if (ray.dir.y < 0)
      run.y = (ray.y - cast.y) * delta.y
    else
      run.y = (cast.y + 1.0 - ray.y) * delta.y

    while hit is 0
      if (run.x < run.y)
        run.x += delta.x
        cast.x += step.x
        side = 0
      else
        run.y += delta.y
        cast.y += step.y
        side = 1

      # Check if ray has hit a wall
      hit = 1 if map[cast.x][cast.y] > 0

    distance = if side is 0
      Math.abs((cast.x - ray.x + (1 - step.x) / 2) / ray.dir.x)
    else
      Math.abs((cast.y - ray.y + (1 - step.y) / 2) / ray.dir.y)

    height = canvas.height / distance

    first_y = Math.round(canvas.height / 2 - height / 2)

    ###
    bright = if side is 1 then 255 else 128
    switch map[cast.x][cast.y]
      when 1 then ctx.fillStyle = "rgb(#{bright}, 0, 0)"
      when 2 then ctx.fillStyle = "rgb(255, #{bright}, 0)"
      when 3 then ctx.fillStyle = "rgb(0, 0, #{bright})"
    ctx.fillRect x, first_y, 1, Math.round(height)
    ###
    wall = {}
    if (side == 1)
      wall.x = ray.x + ((cast.y - ray.y + (1 - step.y) / 2) / ray.dir.y) * ray.dir.x
    else
      wall.x = ray.y + ((cast.x - ray.x + (1 - step.x) / 2) / ray.dir.x) * ray.dir.y
    wall.x -= Math.floor wall.x

    #wall = x: 0

    tex = x: Math.round(wall.x * img.width) % img.width
    if(side == 0 && ray.dir.x > 0)
      tex.x = img.width - tex.x - 1
    if(side == 1 && ray.dir.y < 0)
      tex.x = img.width - tex.x - 1

    if img
      ctx.drawImage(img, tex.x, 0, 1, img.height, x, first_y, 1, height)
    x++

key = {}
key_code = left: 37, up: 38, right: 39, down: 40

set_key = (e, n) ->
  if e.keyCode is key_code.down
    key.down = n
  if e.keyCode is key_code.up
    key.up = n
  if e.keyCode is key_code.right
    key.right = n
  if e.keyCode is key_code.left
    key.left = n

window.addEventListener('keydown', ((e) -> set_key(e, 1)), true)
window.addEventListener('keyup', ((e) -> set_key(e, 0)), true)
canvas.addEventListener('click', ((e) ->
  console.log(x = e.pageX)
  console.log(y = e.pageY)
), true)

resizeCanvas = ->
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  draw()

resizeCanvas()

window.addEventListener('resize', resizeCanvas, false)

setInterval (->

  moveSpeed = 0.3
  rotSpeed = Math.PI / 60

  move_toward = (dir) ->
    d = x: dir.x * moveSpeed, y: dir.y * moveSpeed
    hop = x: Math.floor(player.x + d.x), y: Math.floor(player.y + d.y)

    return if Math.floor(hop.x) < map.length and Math.floor(hop.y) > map[0].length
    player.x += d.x if map[hop.x][Math.floor(player.y)] is 0
    player.y += d.y if map[Math.floor(player.x)][hop.y] is 0

  if key.down
    move_toward x: - dir.x, y: - dir.y
  if key.up
    move_toward dir

  rot_vector = (v, angle) ->
    x: v.x * Math.cos(angle) - v.y * Math.sin(angle)
    y: v.x * Math.sin(angle) + v.y * Math.cos(angle)

  if key.right
    dir = rot_vector(dir, - rotSpeed)
    plane = rot_vector(plane, - rotSpeed)
  if key.left
    dir = rot_vector(dir, rotSpeed)
    plane = rot_vector(plane, rotSpeed)

  if key.up or key.down or key.left or key.right
    draw()
), 25

#window.addEventListener 'keydown', doKeyDown, true
# ...
