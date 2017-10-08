/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class GameState
{
    constructor(gs, upd, ren)
    {
	this.Set(gs, upd, ren);
    }
    
    Set(gs, upd, ren)
    {
	this.gs = gs;
	this.update = upd;
	this.render = ren;
    }
};

const K_LEFT = 37;
const K_RIGHT = 39;
const K_UP = 38;
const K_DOWN = 40;

const TILE_SIZE = 10;
class Fruit extends Entity
{
    constructor(pos, size, col)
    {
	super(pos, size, col);
    }
    
    Init()
    {
	this.pos.x = Common.Random(0, Math.floor(gSize.x / 10));
	this.pos.y = Common.Random(0, Math.floor(gSize.y / 10));
	console.log(this.pos.x + ":" + this.pos.y);
    }
    
    Hit(snake)
    {
	var p = snake.Pos;
	if(p.x < this.pos.x)
	    return false;
	
	if(p.x > this.pos.x)
	    return false;
	
	if(p.y < this.pos.y)
	    return false;
	
	if(p.y > this.pos.y)
	    return false;
	
	return true;
    }
    
    Render(ctx, gt)
    {
	var pos = new Point(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE);
	Drawable.RenderRectFill(ctx, pos, this.size, this.color)
    }
};

class SnakePart extends Drawable
{
    constructor(pos, size, col)
    {
	super(pos, size, col);
    }
    
    Render(ctx)
    {
	var pos = new Point(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE);
	Drawable.RenderRectFill(ctx, pos, this.size, this.color)
    }
};


const SD_LEFT = "SD_LEFT";
const SD_RIGHT = "SD_RIGHT";
const SD_UP = "SD_UP";
const SD_DOWN = "SD_DOWN";
const MIN_TIME = 10 / 1000;
const TIME_RED = 30 / 1000;
class Snake
{
    constructor(pos, size, col)
    {
	this.parts = [new SnakePart(pos, size, col)];
	this.time = 0.5;
	this.timer = new Timer(this.time);
	this.dir = SD_LEFT;
	this.ndir = SD_LEFT;
    }
    
    get Pos()
    {
	return this.parts[0].pos;
    }
    
    Init(pos)
    {
	switch(Common.Random(0,4))
	{
	    case 0:
		this.dir = SD_LEFT;
		break;
	    case 1:
		this.dir = SD_RIGHT;
		break;
	    case 2:
		this.dir = SD_UP;
		break;
	    case 3:
		this.dir = SD_DOWN;
		break;
	}
	this.parts = [new SnakePart(pos, new Point(TILE_SIZE, TILE_SIZE), this.parts[0].color)];
	this.timer.Time = 0.5;
	this.timer.Start();
    }
    
    Raise()
    {
	var lp = this.parts[this.parts.length - 1].pos;	
	var pos = new Point(lp.x, lp.y);
	this.time -= TIME_RED;
	if(this.time < MIN_TIME)
	    this.time = MIN_TIME;
	this.timer.Time = this.time;
	
	switch(this.dir)
	{
	    case SD_LEFT:
		pos.x++;
		break;
	    case SD_RIGHT:
		pos.x--;
		break;
	    case SD_UP:
		pos.y++;
		break;
	    case SD_DOWN:
		pos.y--;
		break;
	}
	
	this.parts.push(new SnakePart(pos, new Point(TILE_SIZE, TILE_SIZE), this.color));
    }
    
    HitSelf()
    {
	for(var p = 1; p < this.parts.length; ++p)
	{
	    var part = this.parts[p];
	    
	    if(this.Pos.x === part.pos.x && this.Pos.y === part.pos.y)
		return true;
	}
	
	return false;
    }
    HitBorder(size)
    {
	if(this.Pos.x < 0)
	    return true;
	else if(this.Pos.x >= size.x)
	   return true;
	else if(this.Pos.y < 0)
	    return true;
	else if(this.Pos.y >= size.y)
	    return true;
	
	return false;
    }
    
    UpdateInput(p)
    {
	if(keys[K_LEFT] && !keys[K_RIGHT])
	{
	    if(this.dir !== SD_RIGHT)
	    {
		this.ndir = SD_LEFT;
	    }
	}
	else if(keys[K_RIGHT] && !keys[K_LEFT])
	{
	    if(this.dir !== SD_LEFT)
	    {
		this.ndir = SD_RIGHT;
	    }
	}
	else if(keys[K_UP] && !keys[K_DOWN])
	{
	    if(this.dir !== SD_DOWN)
	    {
		this.ndir = SD_UP;
	    }
	}
	else if(keys[K_DOWN] && !keys[K_UP])
	{
	    if(this.dir !== SD_UP)
	    {
		this.ndir = SD_DOWN;
	    }
	}
    }
    Update(gt)
    {
	this.UpdateInput();
	
	if(this.timer.Update(gt))
	{
	    this.dir = this.ndir;
	    
	    var op = this.parts[0].pos;
	    var np = new Point(0,0);
	    
	    switch(this.dir)
	    {
		case SD_LEFT:
		    np.x--;
		    break;
		case SD_RIGHT:
		    np.x++;
		    break;
		case SD_UP:
		    np.y--;
		    break;
		case SD_DOWN:
		    np.y++;
		    break;
	    }

	    this.parts[0].pos = new Point(np.x + op.x, np.y + op.y);
	    console.log(this.parts.length);
	    for(var p = 1; p < this.parts.length; ++p)
	    {
		var part = this.parts[p];
		var lp = new Point(part.pos.x, part.pos.y);
		//console.log(op.x + ":" + op.y);
		//console.log(lp.x + ":" + lp.y);
		part.pos.x = op.x;
		part.pos.y = op.y;	
		op.x = lp.x;
		op.y = lp.y;
	    }
	    
	    this.timer.Start();
	}
    }
    
    Render(ctx, gt)
    {
	for(var p = 0; p < this.parts.length; ++p)
	{
	    this.parts[p].Render(ctx);
	}
    }
};
