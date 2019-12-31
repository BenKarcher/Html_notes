"use strict";
let content;
let selected=null;
let lastEvent;
let mode=;
const elements=[];
const stackorder=[];
const edge=5;
//item{type,render,p1{x,y},p2{x,y}}
function select(obj){
  deselect();
  selected=obj;
  obj.render.style["background-color"]="yellow";
}
function deselect(){
  selected.render.style["background-color"]="black";
  selected=null;
}

function getClicked(e){
  for(let item of stackorder){
    if(onElement(e,item)){
      return item;
  return null;
}

function onElement(e,item){
  return item.p1.x-edge<e.pageX && item.p1.y-edge<e.pageY && item.p2.x+edge>e.pageX && item.p2.y+edge>e.pageY;
}

function onEdge(e,item){
  return Math.abs(e.pageX-item.p1.x)<=edge || Math.abs(e.pageX-item.p2.x)<=edge || Math.abs(e.pageY-item.p1.y)<=edge || Math.abs(e.pageY-item.p2.y)<=edge;
}

function mode(m={},params=null){
  content.onmousedown=m.down || null;
  content.onmousemove=m.move || null;
  content.onmouseup=m.up || null;
  if(content.onExit)
    content.onExit();
  content.onExit=m.onExit || null;
  if(m.onStart)
    m.onStart(params);
}

function cleanStackorder(){
  for(let i=0;i<stackorder.length;i++){
    if(stackorder[i].render)
      stackorder[i].render.style["z-index"]=stackorder.length-i;
  }
}

function insert(item){
  if(item.render){
    stackorder.unshift(item);
    item.render.style["z-index"]=stackorder.length;
  }
  for(let i=0;i<elements.length;i++){
    if(elements[i].p1.y>item.p1.y)
      elements.splice(i,0,item);
      break;
  }
}

window.onload=function(){
  content=document.getElementById("content");
  document.getElementById("textBox").onclick=function(){
    mode(textM);
  }
  document.getElementById("select").onclick=function(){
    mode(selectM);
  }
};

const defaultM={
  down:function(e){
    let item=getClicked(e);
    if(item)
      mode(onEdge(e,item)?dragM,selectedM,item);
  }
}
const selectedM={
  onStart:select,
  onExit:deselect,
  down:function(e){
    if(onElement(e,selected)){
      if(onEdge(e,selected))
        mode(dargM,selected);
    }else{
      let item = getClicked();
      mode(item?selectedM:defaultM,item);
    }
  }
}
const dragM={
  onStart:select,
  onExit:deselect,
  move:function(e){

  }
}
const textM={
  down:function(e){
    this.result={
      type:"text",
      render:document.createElement("div"),
      p1:{x:e.pageX, y:e.pageY},
      p2:{x:e.pageX, y:e.pageY}
    }
    this.result.render.style.position="absolute";
    this.result.render.style["background-color"]="yellow";
    content.appendChild(this.result.render);
  },
  move:function(e){
    if(this.result){
      this.result.p2.x=e.pageX;
      this.result.p2.y=e.pageY;
      this.result.render.style.left=Math.min(this.result.p1.x,this.result.p2.x)+"px";
      this.result.render.style.top=Math.min(this.result.p1.y,this.result.p2.y)+"px";
      this.result.render.style.width=Math.abs(this.result.p1.x-this.result.p2.x)+"px";
      this.result.render.style.height=Math.abs(this.result.p1.y-this.result.p2.y)+"px";
    }
  },
  up:function(e){
    if(this.result){
      this.result.render.style["background-color"]="black";
      if(this.result.p1.y>this.result.p2.y){
        let temp = this.result.p1.y;
        this.result.p1.y=this.result.p2.y;
        this.result.p2.y=temp;
      }
      if(this.result.p1.x>this.result.p2.x){
        let temp = this.result.p1.x;
        this.result.p1.x=this.result.p2.x;
        this.result.p2.x=temp;
      }
      insert(this.result);
      this.result=null;
      mode();
    }
  }
}
