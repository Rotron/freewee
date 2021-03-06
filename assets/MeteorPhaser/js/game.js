
var bgtile;
var meteor,explode,health,healthbarfull,    meteorLifeText;
var meteorHP;
var damageDone;
var playBoom;
var starloop;

var numPlayers=4; 
var BPunchSound,RPunchSound,SPunchSound,explosionSound;

var Game = {

    preload : function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#eee'; //green background colour

        // game.load.spritesheet('catspr','./img/catsprite.png',586,758);
        // game.load.spritesheet('meteorSS','./img/meteorspritesheet.png',2381,1407);
        // game.load.spritesheet('explosionSS','./img/explosionspritesheet.png',1921,1850);
        // game.load.spritesheet('healthSS','./img/healthspritesheet.png',1166,107);
        // //game.load.image('bg','./img/nebulaSky.jpg');

    },

    create : function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //loading sounds
        BPunchSound=this.add.audio('BPunch');
        RPunchSound=this.add.audio('RPunch');
        SPunchSound=this.add.audio('SPunch');
        explosionSound=this.add.audio('explodeSound');

        //bgtile = this.add.tileSprite(0,0,game.world.width,game.world.height,'bg');
        var bgtile = this.add.sprite(0,0,'bg');
        bgtile.width=game.world.width;
        bgtile.height=game.world.height;

        //ading meteor 
        meteor=game.add.sprite(game.world.centerX,game.world.height*0.01,'meteorSS');
        meteor.frame=0;
        meteor.anchor.set(0.5,0);
        meteor.scale.setTo(0.45,0.4);
        meteor.animations.add('crack',[0,1,2,3,4,5,6,7],5,true);

        //adding text 
        textStyle = { font: '18px Arial', fill: '#0095DD' };
        meteorLifeText=game.add.text(5,5,'Meteor HP: 50',textStyle);

        //adding explosion animations 
        explode=game.add.sprite(game.world.centerX,game.world.centerY,'explosionSS');
        explode.anchor.set(0.5,0.5);
        explode.scale.setTo(0.5,0.45);
        explode.animations.add('boom',[0,1,2,3,4],4,true);
        explode.visible=false;
        
        //adding cats 
        var xposition={
            1: 0.5,
            2: 0.38,
            3: 0.3,
            4: 0.2
        }
//loop, to generate sequence 
        timer=this.time.events;
        starloop=timer.loop(1000,this.star,this); 

        catGroup = game.add.group();
        for (var i=0;i<numPlayers;i++){
            var cat = catGroup.create(game.world.width*xposition[numPlayers]+200*i,game.world.height,'sumoSS');
            cat.frame=i*4;
            cat.anchor.set(0,1);
            cat.scale.setTo(0.2);
            cat.animations.add('lifting',[i*4,i*4+1,i*4+2,i*4+3],3,true);

        }

        //adding health bar
        healthbarfull = game.add.sprite(game.world.width*0.25,game.world.height*0.15,'healthSS');
        healthbarfull.scale.setTo(0.5);
        health=game.add.sprite(game.world.width*0.25,game.world.height*0.15,'healthSS');
        health.scale.setTo(0.5);
        health.frame=2;
        meteorHP=50;
        damageDone = 0;

        //creating timer
        me=this;
        me.startTime=new Date();
        me.totalTime=20; //time of entire game
        me.timeElapsed=0;
        me.createTimer();
        me.gameTimer=game.time.events.loop(100,function(){
            me.updateTimer();
        });

        
        loop=timer.loop(1000,this.increaseHP,this); 
        playBoom = false;

        
    }, 

    update:function() {
        if(me.timeElapsed >= me.totalTime){
            me.timeLabel.visible=false;
            meteor.visible=false;

            catGroup.forEach(function(member){
            member.visible=false;
            });
            healthbarfull.visible=false;
            health.visible=false;
            timer.remove(loop);
            explode.visible=true;
            explode.animations.play('boom');
             if (playBoom == false){
                explosionSound.play();
                playBoom = true;
            }
            
            //game.state.start('Game_Over');
            this.over();
            
        
            }

        //decrease HP for every mouseclick. to be replaced with phone inputs. will get a count
        game.input.onDown.add(this.decreaseHP);

    },

    star:function(){
        var graphics = game.add.graphics(0,0);
        for (var i=0;i<10;i++){
            // set a fill and line style
            graphics.beginFill(0xffffff);
            
            var cir=graphics.drawCircle(game.world.randomX,game.world.randomY,100);
            
            cir.alpha=0;
            game.add.tween(cir).to({alpha:1},1000,Phaser.Easing.Linear.None,true,0,1000,true);     
            cir.kill();
            //graphics.drawCircle(this.world.randomX, this.world.randomY,10);
            

        }
        graphics.endFill();
        
    },

    over: function(){
        this.time.events.add(3000,function(){
            game.state.start('Game_Over');
        },this);
        
    },

    createTimer: function(){
        //me = this;
        me.timeLabel = me.game.add.text(me.game.world.centerX, 20, "00:00", {font: "50px Arial", fill: "#000000"}); 
        me.timeLabel.anchor.setTo(0.5, 0);
        me.timeLabel.align = 'center';
     
    },

    updateTimer: function(){
        if(me.timeElapsed < me.totalTime){                
            //me = this;
            var currentTime = new Date();
            var timeDifference = me.startTime.getTime() - currentTime.getTime();
         
            //Time elapsed in seconds
            me.timeElapsed = Math.abs(timeDifference / 1000);
         
            //Time remaining in seconds
            var timeRemaining = me.totalTime - me.timeElapsed; 
         
            //Convert seconds into minutes and seconds
            var minutes = Math.floor(timeRemaining / 60);
            var seconds = Math.floor(timeRemaining) - (60 * minutes);
         
            //Display minutes, add a 0 to the start if less than 10
            var result = (minutes < 10) ? "0" + minutes : minutes; 
         
            //Display seconds, add a 0 to the start if less than 10
            result += (seconds < 10) ? ":0" + seconds : ":" + seconds; 
         
            me.timeLabel.text = result;
        }
     
    },
    increaseHP:function(){
        //recursive function increases HP of meteor 
        if (meteorHP<50){
            //increasing HP 
            damageDone--;
            meteorHP++;
            meteorLifeText.setText("Meteor HP: "+meteorHP);
            health.scale.setTo(0.5*meteorHP/50,0.5);

            if (meteorHP>=25){
                health.frame=2; //change to dangerous HP (red)
            }
            if (damageDone==-10){
                meteor.frame-=1; //take away the crack
                damageDone=0;
            }
    
        }
    },

    decreaseHP:function(){
        //decreasing HP 
        catGroup.children[0].animations.play('lifting');
        if (meteorHP>0){
            meteorHP--;
            meteorLifeText.setText("Meteor HP: "+meteorHP);
            damageDone++;
            health.scale.setTo(0.5*meteorHP/50,0.5);


            if (meteorHP<25){
                health.frame=1; //change to healthy HP (green)
            }

        }
        
        if (damageDone==10){
            meteor.frame+=1; //add crack 
            damageDone=0;
            SPunchSound.play();

        }
    }
        
};
