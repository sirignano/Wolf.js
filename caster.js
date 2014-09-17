(function() {
    var block, canvas, ctx, dir, draw, draw_column, img, key, key_code, map, plane, player, resizeCanvas, set_key;

    canvas = document.getElementsByTagName("canvas")[0];

    ctx = canvas.getContext("2d");

  canvas.clean = function(ctx)
  {
    ctx.fillStyle = "rgb(0, 194, 243)";
    ctx.fillRect(0,0,canvas.width ,canvas.height / 2);
    ctx.fillStyle = "rgb(100, 100, 130)";
    ctx.fillRect(0,canvas.height / 2,canvas.width ,canvas.height);
    var text = "Started with CoffeeScript by mlalisse."
    var text2 = "hosted and corrected in Js by lsirigna"
    var text3 = "feel free to contribute"
    ctx.font = "10pt Verdana";
    ctx.textAlign = "center"; 
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(127,0,0,0.5)';
    ctx.fillText(text, canvas.width - 200, 30);
    ctx.fillStyle = 'rgba(227,55,127,0.5)';
    ctx.fillText(text2, canvas.width - 200, 45);
    ctx.fillText(text3, canvas.width - 200, 60);
    return ctx;
  };

/* callmap is defined depending level */
  map = callmap();

  block = {
    empty: 0
  };

/* loading image for textures */
/* for 1 */
  img = new Image();
  img.src = '../img/mur7.jpg';
  img.onload = function() {
    return draw();
  };

/* 2 */

  img2 = new Image();
  img2.src = '../img/murold.jpg';
  img2.onload = function() {
    return draw();
  };

/* 3 */

  img3 = new Image();
  img3.src = '../img/mur2.jpg';
  img3.onload = function() {
    return draw();
  };

/* player initialisation */
  player = { x: return_start_pos_x(), y: return_start_pos_y() };

  dir =
  {
    x: -1,
    y: 0
  };

  plane =
  {
    x: 0,
    y: 0.66
  };

  Math.fabs = function(x) {
    return Math.abs(Math.floor(x));
  };

  draw_column = function(x, height, type, side) {};

/* fct draw */
  draw = function()
  {
    var camera, cast, delta, distance, first_y, height, hit, ray, run, side, step, tex, wall, x, _results;
    canvas.clean(ctx);
    x = 0;
    _results = [];
/* main while */
    while (x < canvas.width)
    {
      camera = { x: 2 * x / canvas.width - 1 };
      ray = { x: player.x, y: player.y, dir: { x: dir.x + plane.x * camera.x, y: dir.y + plane.y * camera.x } };
      cast = { x: Math.floor(ray.x), y: Math.floor(ray.y) };
      delta = { x: Math.sqrt(1 + (ray.dir.y * ray.dir.y) / (ray.dir.x * ray.dir.x)), y: Math.sqrt(1 + (ray.dir.x * ray.dir.x) / (ray.dir.y * ray.dir.y)) };
      run = { x: 0, y: 0 };
      step = { x: 0, y: 0 };
      hit = 0;
      side = void 0;
      step.x = ray.dir.x < 0 ? -1 : 1;
      step.y = ray.dir.y < 0 ? -1 : 1;
      if (ray.dir.x < 0)
      {
        run.x = (ray.x - cast.x) * delta.x;
      }
      else
      {
        run.x = (cast.x + 1.0 - ray.x) * delta.x;
      }
      if (ray.dir.y < 0)
      {
        run.y = (ray.y - cast.y) * delta.y;
      }
      else
      {
        run.y = (cast.y + 1.0 - ray.y) * delta.y;
      }
/* ray LAUNCHER GOGOGO */
      while (hit === 0)
      {
        if (run.x < run.y)
        {
          run.x += delta.x;
          cast.x += step.x;
          side = 0;
        }
        else
        {
          run.y += delta.y;
          cast.y += step.y;
          side = 1;
        }
        if (map[cast.x][cast.y] > 0)
        {
          hit = 1;
        }
      }
      
      /* distance */
      
      distance = side === 0 ? Math.abs((cast.x - ray.x + (1 - step.x) / 2) / ray.dir.x) : Math.abs((cast.y - ray.y + (1 - step.y) / 2) / ray.dir.y);
      
      /* scale */

      height = canvas.height / distance;
      first_y = Math.round(canvas.height / 2 - height / 2);

      /* OLD COLORS (with no textures)
      bright = if side is 1 then 255 else 128
      ctx.fillStyle = "rgb(0, 0, 255)";
      switch map[cast.x][cast.y]
        when 1 then ctx.fillStyle = "rgb(#{bright}, 0, 0)"
        when 2 then ctx.fillStyle = "rgb(255, #{bright}, 0)"
        when 3 then ctx.fillStyle = "rgb(0, 0, #{bright})"
      ctx.fillRect x, first_y, 1, Math.round(height)
      */

      wall = {};
      if (side === 1)
      {
        wall.x = ray.x + ((cast.y - ray.y + (1 - step.y) / 2) / ray.dir.y) * ray.dir.x;
      }
      else
      {
        wall.x = ray.y + ((cast.x - ray.x + (1 - step.x) / 2) / ray.dir.x) * ray.dir.y;
      }
      wall.x -= Math.floor(wall.x);

/* floor 

//FLOOR CASTING
      var floorXWall, floorYWall; //x, y position of the floor texel at the bottom of the wall

      //4 different wall directions possible
      if (side == 0 && ray.dir.x > 0)
      {
        floorXWall = cast.x;
        floorYWall = cast.y + wall.x;
      }
      else if (side == 0 && ray.dir.x < 0)
      {
        floorXWall = cast.x + 1.0;
        floorYWall = cast.y + wall.x;
      }
      else if (side == 1 && ray.dir.y > 0)
      {
        floorXWall = cast.x + wall.x;
        floorYWall = cast.y;
      }
      else
      {
        floorXWall = cast.x + wall.x;
        floorYWall = cast.y + 1.0;
      } 
      
      var distWall, distPlayer, currentDist;  

      distWall = distance;
      distPlayer = 0.0;

      //draw the floor from drawEnd to the bottom of the screen
      var y = first_y + height;
      var h = first_y + height;
        imgfloor = new Image();
        imgfloor.src = 'mur.jpg';
        imgfloor.onload = function() { return draw(); };
      while (y < canvas.height)
      {
        currentDist = h / (2.0 * y - h); //you could make a small lookup table for this instead

        var weight = (currentDist - distPlayer) / (distWall - distPlayer);
         
        var currentFloorX = weight * floorXWall + (1.0 - weight) * player.x;
        var currentFloorY = weight * floorYWall + (1.0 - weight) * player.y;
        
        var floorTexX, floorTexY;
        floorTexX = Math.ceil(currentFloorX * imgfloor.width) % imgfloor.width;
        floorTexY = Math.ceil(currentFloorY * imgfloor.height) % imgfloor.height;
        
        //floor
 //       buffer[x][y] = (texture[3][texWidth * floorTexY + floorTexX] >> 1) & 8355711;
        ctx.drawImage(imgfloor, floorTexX, 0, 1, floorTexY, x, h, 1, canvas.height - h);
        //ceiling (symmetrical!)
  //      buffer[x][h - y] = texture[6][texWidth * floorTexY + floorTexX];
        y++;
      }

 end of floor */

      if (map[cast.x][cast.y] === 1)
      {
	      tex = { x: Math.round(wall.x * img.width) % img.width };
      }
      else if (map[cast.x][cast.y] === 2)
      {
	      tex = { x: Math.round(wall.x * img2.width) % img2.width };
      }
      else if (map[cast.x][cast.y] > 2)
      {
              tex = { x: Math.round(wall.x * img3.width) % img3.width };
      }

      if (side === 0 && ray.dir.x > 0)
      {
	       if (map[cast.x][cast.y] > 2)
         {
	          tex.x = img3.width - tex.x - 1;
	       }
	       else if (map[cast.x][cast.y] === 2)
	       {
	           tex.x = img2.width - tex.x - 1;
	       }
	       else
         {
        	tex.x = img.width - tex.x - 1;
	       }
      }
      if (side === 1 && ray.dir.y < 0)
      {
        if (map[cast.x][cast.y] > 2)
        {
	        tex.x = img3.width - tex.x - 1;
	      }
      	else if (map[cast.x][cast.y] === 2)
	      {
	        tex.x = img2.width - tex.x - 1;
	      }
	      else
        {
        	tex.x = img.width - tex.x - 1;
	      }
      }

      if (img && map[cast.x][cast.y] === 1)
      {
        ctx.drawImage(img, tex.x, 0, 1, img.height, x, first_y, 1, height);
      }
      else if (img2 && map[cast.x][cast.y] === 2)
      {
        ctx.drawImage(img2, tex.x, 0, 1, img2.height, x, first_y, 1, height);
      }
      else if (img3 && map[cast.x][cast.y] > 2)
      {
        ctx.drawImage(img3, tex.x, 0, 1, img3.height, x, first_y, 1, height);
      }

     _results.push(x++);
    }
    return _results;
  };

/* key HOOK */

  key = {};

  key_code =
  {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };

  set_key = function(e, n)
  {
    if (e.keyCode === key_code.down) { key.down = n; }
    if (e.keyCode === key_code.up) { key.up = n; }
    if (e.keyCode === key_code.right) { key.right = n; }
    if (e.keyCode === key_code.left) { return key.left = n; }
  };

  window.addEventListener('keydown', (function(e) { return set_key(e, 1); }), true);

  window.addEventListener('keyup', (function(e) { return set_key(e, 0); }), true);

  canvas.addEventListener('click', (function(e)
                                    {
                                      var x, y;
                                      x = e.pageX;
                                      y = e.pageY;
/*  trying to add shoot */
                                            camera = { x: 2 * x / canvas.width - 1 };
                                            ray = { x: player.x, y: player.y, dir: { x: dir.x + plane.x * camera.x, y: dir.y + plane.y * camera.x } };
                                            cast = { x: Math.floor(ray.x), y: Math.floor(ray.y) };
                                            delta = { x: Math.sqrt(1 + (ray.dir.y * ray.dir.y) / (ray.dir.x * ray.dir.x)), y: Math.sqrt(1 + (ray.dir.x * ray.dir.x) / (ray.dir.y * ray.dir.y)) };
                                            run = { x: 0, y: 0 };
                                            step = { x: 0, y: 0 };
                                            hit = 0;
                                            side = void 0;
                                            step.x = ray.dir.x < 0 ? -1 : 1;
                                            step.y = ray.dir.y < 0 ? -1 : 1;
                                            if (ray.dir.x < 0)
                                            {
                                              run.x = (ray.x - cast.x) * delta.x;
                                            }
                                            else
                                            {
                                              run.x = (cast.x + 1.0 - ray.x) * delta.x;
                                            }
                                            if (ray.dir.y < 0)
                                            {
                                              run.y = (ray.y - cast.y) * delta.y;
                                            }
                                            else
                                            {
                                              run.y = (cast.y + 1.0 - ray.y) * delta.y;
                                            }
                                            while (hit === 0)
                                            {
                                              if (run.x < run.y)
                                              {
                                                run.x += delta.x;
                                                cast.x += step.x;
                                                side = 0;
                                              }
                                              else
                                              {
                                                run.y += delta.y;
                                                cast.y += step.y;
                                                side = 1;
                                              }
                                              if (map[cast.x][cast.y] > 0)
                                              {
                                                hit = 1;
                                              }
                                            }
                                            distance = side === 0 ? Math.abs((cast.x - ray.x + (1 - step.x) / 2) / ray.dir.x) : Math.abs((cast.y - ray.y + (1 - step.y) / 2) / ray.dir.y);
/* retrieving Y */
                                            height = canvas.height / distance;
                                            first_y = Math.round(canvas.height / 2 - height / 2);
                                            if (y > first_y && y < first_y + height && map[cast.x][cast.y] > 1)
                                                map[cast.x][cast.y] = 0;
                                            draw();


/* en of shoot */

                                      return ;
                                    }
                                    ), true);

  resizeCanvas = function()
  {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return draw();
  };

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas, false);

  setInterval((function()
  {
            var moveSpeed, move_toward, rotSpeed, rot_vector;
            moveSpeed = 0.15;
            rotSpeed = Math.PI / 60;
            move_toward = function(dir)
            {
              var d, hop;
              d = { x: dir.x * moveSpeed, y: dir.y * moveSpeed };
              hop = { x: Math.floor(player.x + d.x), y: Math.floor(player.y + d.y) };
              if (Math.floor(hop.x) < map.length && Math.floor(hop.y) > map[0].length)
              {
                return;
              }
              if (map[hop.x][Math.floor(player.y)] === 0)
              {
                player.x += d.x;
              }
              if (map[Math.floor(player.x)][hop.y] === 0)
              {
                return player.y += d.y;
              }
            };

            if (key.down)
            {
              move_toward({ x: -dir.x, y: -dir.y });
            }

            if (key.up)
            {
              move_toward(dir);
            }

            rot_vector = function(v, angle)
            {
              return { x: v.x * Math.cos(angle) - v.y * Math.sin(angle), y: v.x * Math.sin(angle) + v.y * Math.cos(angle) };
            };

            if (key.right)
            {
              dir = rot_vector(dir, -rotSpeed);
              plane = rot_vector(plane, -rotSpeed);
            }

            if (key.left)
            {
              dir = rot_vector(dir, rotSpeed);
              plane = rot_vector(plane, rotSpeed);
            }

            if (key.up || key.down || key.left || key.right)
            {
              draw();
        	    var text3 = player.x + " " + player.y
          	  ctx.font = "10pt Verdana";
         	    ctx.textAlign = "center"; 
         	    ctx.textBaseline = 'top';
         	    ctx.fillStyle = 'rgba(127,0,0,0.5)';
         	    ctx.fillText(text3, canvas.width - 600, 30);
              posend_x = ft_get_end_x();
              posend_y = ft_get_end_y();
            	if (player.x > posend_x && player.x < posend_x + 1 && player.y > posend_y && player.y < posend_y + 1)
            	{
                  var text4 = "YOU WON"
                  ctx.font = "60pt Verdana";
                  ctx.textAlign = "center"; 
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = 'rgba(127,0,0,0.5)';
                  ctx.fillText(text4, canvas.width / 2, canvas.height / 2);
                  var redirect = ft_redirect();
                  setTimeout(redirect,1000);
              }
            }

  }), 25);

}).call(this);
