
var bgtile;
var meteor,explode,health,healthbarfull,    meteorLifeText;
var meteorHP=50;
var damageDone=0;

var numPlayers=2; 

var Game = {

    preload : function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#eee'; //green background colour

        game.load.spritesheet('catspr','./img/catsprite.png',586,758);
        game.load.spritesheet('meteorSS','./img/meteorspritesheet.png',2381,1407);
        game.load.spritesheet('explosionSS','./img/explosionspritesheet.png',1921,1850);
        game.load.spritesheet('healthSS','./img/healthspritesheet.png',1166,107);
        //game.load.image('bg','./img/nebulaSky.jpg');

    },

    create : function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //bgtile = game.add.tileSprite(0,0,game.world.width,game.world.height,'bg');
        
        //ading meteor 
        meteor=game.add.sprite(game.world.centerX,20,'meteorSS');
        meteor.frame=0;
        meteor.anchor.set(0.5,0);
        meteor.scale.setTo(0.45,0.4);
        meteor.animations.add('crack',[0,1,2,3,4,5,6,7],5,true);
        //meteor.animations.play('crack');

        //adding text 
        textStyle = { font: '18px Arial', fill: '#0095DD' };
        meteorLifeText=game.add.text(5,5,'Meteor HP: 50',textStyle);

        //adding explosion animations 
        explode=game.add.sprite(game.world.centerX,game.world.centerY,'explosionSS');
        explode.anchor.set(0.5,0.5);
        explode.scale.setTo(0.5,0.45);
        explode.animations.add('boom',[0,1,2,3,4],4,true);
        explode.visible=false;
     //   explode.animations.play('he');
         
        //adding cats 
        var xposition={
            1: 0.5,
            2: 0.38,
            3: 0.3,
            4: 0.25
        }
        catGroup = game.add.group();
        for (var i=0;i<numPlayers;i++){
            var cat = catGroup.create(game.world.width*xposition[numPlayers]+200*i,game.world.height,'catspr');
            cat.anchor.set(0,1);
            cat.scale.setTo(0.2);
            cat.animations.add('lifting',[0,1,2],1,true);

        }

        //adding health bar
        healthbarfull = game.add.sprite(game.world.width*0.25,40,'healthSS');
        healthbarfull.scale.setTo(0.5);
        health=game.add.sprite(game.world.width*0.25,40,'healthSS');
        health.scale.setTo(0.5);
        health.frame=2;

   // //SOUND EFFECTS ADD IN 
   
        //creating timer
        me=this;
        me.startTime=new Date();
        me.totalTime=20; //time of entire game
        me.timeElapsed=0;
        me.createTimer();
        me.gameTimer=game.time.events.loop(100,function(){
            me.updateTimer();
        });

        //loop, to generate sequence 
        timer=game.time.events;
        loop=timer.loop(1000,this.increaseHP,this); 
    }, 

    update:function() {
        if(me.timeElapsed >= me.totalTime){
            me.timeLabel.visible=false;
            meteor.visible=false;
            catGroup.children=false;
            healthbarfull.visible=false;
            health.visible=false;
            explode.visible=true;
            explode.animations.play('boom');
            //game.state.start('Game_Over');//Do what you need to do
        }

        //decrease HP for every mouseclick. to be replaced with phone inputs. will get a count
        game.input.onDown.add(this.decreaseHP);

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
        meteorHP--;
        meteorLifeText.setText("Meteor HP: "+meteorHP);
        damageDone++;
        health.scale.setTo(0.5*meteorHP/50,0.5);
        
        if (meteorHP<25){
            health.frame=1; //change to healthy HP (green)
        }

        if (damageDone==10){
            meteor.frame+=1; //add crack 
            damageDone=0;
        }
    }
        
};