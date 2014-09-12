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
  img = new Image();
  img.src = 'mur.jpg';
  img.onload = function() {
    return draw();
  };

  img2 = new Image();
  img2.src = 'mur2.jpg';
  img2.onload = function() {
    return draw();
  };

  img3 = new Image();
  img3.src = 'mur3.jpg';
  img3.onload = function() {
    return draw();
  };

/* player initialisation */
  player = { x: return_pos_x(), y: return_pos_y() };

  dir = {
    x: -1,
    y: 0
  };

  plane = {
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

  key_code = {
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

  canvas.addEventListener('click', (function(e) { var x, y; console.log(x = e.pageX); return console.log(y = e.pageY); }), true);

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
            	if (player.x > 30 && player.y > 12)
            	{
                  var text4 = "YOU WON"
                  ctx.font = "60pt Verdana";
                  ctx.textAlign = "center"; 
                  ctx.textBaseline = 'top';
                  ctx.fillStyle = 'rgba(127,0,0,0.5)';
                  ctx.fillText(text4, canvas.width / 2, canvas.height / 2);
                  var redirect = ft_redirect();
                  setTimeout(redirect,2000);
              }
            }

  }), 25);

}).call(this);
