var popul;
var lifespane=300;
var target;
var count=0;

var rx=100;
var ry=300;
var rh=20;
var rw=200;


function setup() {
 createCanvas(400, 600);
 popul=new Population();
 target=createVector(200,50);

}

function draw() {
  background(000);
  rect(rx,ry,rw,rh);
  popul.run();
  count++;
  if(count==lifespane){
    popul.eval();
    popul.selection();
    
    count=0;
    
  }
  ellipse(target.x,target.y,20,20);
}

function Population(){
  this.rockets=[];
  this.populationSize=100;
  this.matingPool=[];


  this.eval=function(){
    maxFeet=0;
    for(var i=0;i<this.populationSize;i++){
      this.rockets[i].calcFetness();
      if(maxFeet<this.rockets[i].fitness){
        maxFeet=this.rockets[i].fitness;
      }
    }
    for(var i=0;i<this.populationSize;i++){
      this.rockets[i].fitness/=maxFeet;
    }
    this.matingPool=[]
    for(var i=0;i<this.populationSize;i++){
      var n=this.rockets[i].fitness*100;
     
      for(var j=0;j<n;j++){
        this.matingPool.push(this.rockets[i]);
      }
    }
  }

  this.selection= function(){
    var newRockets=[];
    for(var i=0;i<this.populationSize;i++){
      var parentA=random(this.matingPool).dna;
      var parentB=random(this.matingPool).dna;
      var child=parentA.crossover(parentB);
      child.mutaion();
      newRockets[i]=new Rocket(child);
    }
    this.rockets=newRockets;
  }

 

  for(var i=0;i<this.populationSize;i++){
    this.rockets[i]=new Rocket();
  }

  this.run= function(){
    for(var i=0;i<this.populationSize;i++){
      this.rockets[i].update();
      this.rockets[i].show();
    }
  }
}



function Rocket(dna){
  this.position=createVector(200,550);
  this.acceleration=createVector(0,-1);
  this.velosity=createVector();
  if(dna){
    this.dna=dna;
  }else{
    this.dna=new DNA();
  }
  
  this.fitness=0;
  this.complited=false;
  this.crash=false;




 this.calcFetness=function(){
   var d=dist(this.position.x,this.position.y,target.x,target.y);
   this.fitness=map(d,0,width,width,0);
   //this.fitness=1/d;
   if(this.complited){
      this.fitness*=15;
   }
   if(this.crash){
     this.fitness/=100;
   }
 }

  this.applyForce = function(force){
      this.acceleration.add(force);
  }

  this.update=function(){

    if(this.position.x>rx && this.position.x < rx+rw && this.position.y > ry &&  this.position.y<ry+rh){
      this.crash=true;
    }
    if(this.position.x<0 || this.position.x>400){
      this.crash=true;
    }
    if(this.position.y<0 || this.position.y>600){
      this.crash=true;
    }

    var d =dist(this.position.x,this.position.y,target.x,target.y);

    if(d<20){
      this.complited=true;
      this.position=target.copy();
    }
    this.applyForce(this.dna.genes[count]);
    if(this.complited==false && this.crash==false){
      this.velosity.add(this.acceleration);
      this.position.add(this.velosity);
      this.acceleration.mult(0);
    }
      
  }

  this.show = function(){
      push();
      translate(this.position.x,this.position.y);
      rotate(this.velosity.heading());
      rectMode(CENTER);
      
      //fill(norm(this.fitness,0,255));

      rect(0, 0 , 55, 10);
      pop();    
  }
}



function DNA(genes){
  if(genes){
    this.genes=genes;
  }else{
    this.genes=[];
    for(var i = 0;i<lifespane;i++){
      this.genes[i]=p5.Vector.random2D();
      this.genes[i].setMag(0.9);
    }
  }
  

  this.crossover=function(partner){
    var newdna=[];
    var medpoint=floor(random(this.genes.length));
    for(var i=0;i<this.genes.length;i++){
      if(i<medpoint){
        newdna[i]=this.genes[i];
      }else{
        newdna[i]=partner.genes[i];
      }
    }
    return new DNA(newdna);
  }

  this.mutaion= function(){
    for(var i=0;i<this.genes.length;i++){
      var a=random(1)
      if(a<0.001){
        this.genes[i]=p5.Vector.random2D();
        this.genes[i].setMag(0.1);
        console.log("mutation"+a);
      }
    }
  }
}