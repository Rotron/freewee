var sumo,runtext;
var bgmusic;
var Menu = {

    preload : function() {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to, 
        // the second one is the path to our file.
        game.load.image('menu', './img/grassfield2.png');
        game.load.image('runtext','./img/RunSumoRun.png');
        game.load.audio('startMusic','./sound/SumoRun BGM before starting race.mp3');
        game.load.image('gameover', './img/grassfield3.png');

        game.load.spritesheet('sumoWLSS','./img/sumolosewinspritesheet.png',969,914);
        game.load.spritesheet('sumoSS','./img/sumoRunSpriteSheet.png',773,914);
        
        game.load.image('track','img/track.png');
        game.load.audio('breathing','./sound/breath_short.mp3');
        game.load.audio('cheering','./sound/cheer_sound_short.mp3');
        game.load.audio('countdown','./sound/countdown.mp3');
        game.load.audio('collisionSound','./sound/collision.mp3');
    },

    create: function () {
        bgmusic=game.add.audio('startMusic');
        
        //use loopFull(volume) to loop the sound
        bgmusic.loopFull(1);

        


        game.physics.startSystem(Phaser.Physics.ARCADE);

        //background image
        game.add.tileSprite(0,0,game.world.width,game.world.height,'menu');
        
        // Add menu screen.
        // It will act as a button to start the game.
        this.add.button(0, 0, 'menu', this.startGame, this);


        //adding of sumo sprite 
        sumo = game.add.sprite(0,game.world.height*0.4,'sumoSS');
        sumo.frame=16;
        sumo.scale.setTo(0.15);
        sumo.animations.add('running',[16,17],4,true);
        sumo.animations.play('running');
        game.physics.enable(sumo,Phaser.Physics.ARCADE);
        sumo.body.velocity.x=200;

        //adding of text as a sprite 
        runtext  = game.add.sprite(-1100,game.world.height*0.6,'runtext');
        runtext.scale.setTo(0.4);
        runtext.anchor.set(0,1);
        runtext.animations.add('run',[0,1],5,true);
        runtext.animations.play('run');
        game.add.tween(runtext).to({x:200},7000,Phaser.Easing.Linear.None,true);
    
        game.time.events.add(3000,function(){
            var text=game.add.text(game.world.width*0.4,game.world.height*0.7,'Click to continue',{font:'25px Arial',fill:'#0095DD'});
            text.alpha=0;
            game.add.tween(text).to({alpha:1},1000,Phaser.Easing.Linear.None,true,0,1000,true);
                    
        });
         

    },

  
    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};