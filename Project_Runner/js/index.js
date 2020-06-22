
    const config = {
        type: Phaser.CANVAS,
        parent: 'game',
        width: 1000,
        height: 600,
        scene: {
          preload,
          create,
          update
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: {y: 500},
            },
        }
      };
  
    const game = new Phaser.Game(config);
  

     

  
  // Tous les joueurs en ligne
  var onlinePlayer;
  let onlinePlayers = [];
  var overlapCollider;
  
  
  
  function preload() {
  
    this.load.image('background', './assets/images/background.png');
    
    this.load.image('tiles', './assets/maps/tileset.png');
  
    this.load.tilemapTiledJSON('map', './assets/maps/level_one.json');
  
    // Load image/anims joueur
    this.load.image('start_img', './assets/images/player1/Glide.png');
    this.load.atlas('player_run', './assets/images/player1/ninja_run.png', './assets/images/player1/ninja_run.json');
    this.load.atlas('player_idle', './assets/images/player1/ninja_idle.png', './assets/images/player1/ninja_idle.json');
    this.load.atlas('player_jump', './assets/images/player1/ninja_jump.png', './assets/images/player1/ninja_jump.json');
  
    // Load image/anims deuxieme joueur
    this.load.image('ostart_img', './assets/images/player2/Idle.png');
    this.load.atlas('oplayer_run', './assets/images/player2/girl_run.png', './assets/images/player2/girl_run.json');
    this.load.atlas('oplayer_idle', './assets/images/player2/girl_idle.png', './assets/images/player2/girl_idle.json');
    this.load.atlas('oplayer_jump', './assets/images/player2/girl_jump.png', './assets/images/player2/girl_jump.json');
  
    this.load.image('flag', './assets/images/flag.png');
  }
  
  function create() {


  
    this.physics.world.setBounds(0, 0, 8000, 1480);
  
    this.container = [];
  
    // creation de la connexion socket
    this.socket = io.connect(`http://localhost:8080`);
  
  
    // chargement des joueurs deja en ligne
    this.socket.on("CURRENT_PLAYERS", players => {
  
        Object.keys(players).forEach(playerId => {
            if (players[playerId].playerId !== this.socket.id) {
                this.onlinePlayer = this.physics.add.sprite(players[playerId].x, players[playerId].y, "ostart_img");
                this.onlinePlayer.setScale(0.3,0.3);
                this.onlinePlayer.setBounce(0.1);
                this.onlinePlayer.setCollideWorldBounds(true);
                this.physics.add.collider(this.onlinePlayer, platforms);
                onlinePlayers[players[playerId].playerId] = this.onlinePlayer;
            }
        })
    });
  
    // chargement des joueurs nouvellement connecter
    this.socket.on('NEW_PLAYER', (player) => {
  
        this.onlinePlayer = this.physics.add.sprite(player.x, player.y, "ostart_img");
        this.onlinePlayer.setScale(0.3,0.3);
        this.onlinePlayer.setBounce(0.1);
        this.onlinePlayer.setCollideWorldBounds(true);
        this.physics.add.collider(this.onlinePlayer, platforms);
        onlinePlayers[player.playerId] = this.onlinePlayer;
    });
  
    this.socket.on("PLAYER_MOVED", playerInfo => {  
        onlinePlayers[playerInfo.playerId].setPosition(playerInfo.x, playerInfo.y);
    });
  
    this.socket.on('PLAYER_DISCONNECT', (player) => {
  
        onlinePlayers[player].destroy()
    });
  
  
    // creation de la map
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('tileset', 'tiles', 16,16, 1, 2);
  
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    bg.setScale(5, 1.4);
    
    const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
  
    map.createStaticLayer('Details', tileset, 0, 200);
    platforms.setCollisionByExclusion(-1, true); // -1 = pour tous


    // Gestion de la fin
    const flg = this.physics.add.image(7900, 1250, 'flag');  
  
    // Ajout joueur
    this.player = this.physics.add.sprite(100, 1200, 'start_img');
    this.player.setScale(0.3,0.3)
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(flg, platforms);

    overlapCollider = this.physics.add.overlap(this.player, flg, finish.bind(this));


    // Animations
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNames('player_run', {
            prefix: 'Run__00',
            suffix: '.png',
            start: 0,
            end: 9,
        }),
        frameRate: 10,
        repeat: -1
    });
  
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNames('player_jump', {
            prefix: 'Jump__00',
            suffix: '.png',
            start: 0,
            end: 9,
        }),
        frameRate: 25,
        repeat: 0
    });
  
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNames('player_idle', {
            prefix: 'Idle__00',
            suffix: '.png',
            start: 0,
            end: 9,
        }),
        frameRate: 10,
        repeat: -1
    });
  
  
    // Creation des touches
    this.cursors = this.input.keyboard.addKeys(
        {
        space:Phaser.Input.Keyboard.KeyCodes.SPACE,
        up:Phaser.Input.Keyboard.KeyCodes.UP,
        down:Phaser.Input.Keyboard.KeyCodes.DOWN,
        left:Phaser.Input.Keyboard.KeyCodes.LEFT,
        right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
        up2:Phaser.Input.Keyboard.KeyCodes.W,
        down2:Phaser.Input.Keyboard.KeyCodes.S,
        left2:Phaser.Input.Keyboard.KeyCodes.A,
        right2:Phaser.Input.Keyboard.KeyCodes.D});
  
  
  
    // Cameras
    this.cameras.main.setBounds(0, 0, 8000, 1480);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    
  }

  var overlapTriggered = false;
  
  function finish() {
      
    if(overlapTriggered){
        this.physics.world.removeCollider(overlapCollider);
        return;
      };
  
    this.socket.emit('ARRIVER', {})
      
      console.log('arriver');
      overlapTriggered=true;
  }
  
  //var pour le double jump
  var jump = 0;
  
  function update() {
  
    this.player.body.setSize(this.player.width, this.player.height)
  
  
    // Droite/Gauche et Idle
    if (this.cursors.left.isDown || this.cursors.left2.isDown) {
        this.player.setVelocityX(-250);
        if (this.player.body.onFloor()) {
           this.player.anims.play('run', true); 
        }
    } else if (this.cursors.right.isDown || this.cursors.right2.isDown) {
        this.player.setVelocityX(1000);
        
        if (this.player.body.onFloor()) {
        this.player.anims.play('run', true);
    }
    } else {
        this.player.setVelocityX(0);
        if (this.player.body.onFloor()) {
            this.player.anims.play('idle', true);
        }
    }
  
  
    // Saut
    if (this.player.body.onFloor()) {
        jump = 2;
    }
  
    if ((Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.cursors.up2)) && jump > 0)
     {
        jump--;
        this.player.body.setVelocityY(-1000);
        
        this.player.anims.play('jump');
    }
  
    
  
  
    // Flip pour tourner
    if (this.player.body.velocity.x > 0) {
        this.player.setFlipX(false);
    } else if (this.player.body.velocity.x < 0) {
        this.player.setFlipX(true);
    }
  
    // Envoie dans socket pour les autres
    let x = this.player.x;
    let y = this.player.y;
    if (this.container.oldPosition && (this.container.oldPosition.x !== x || this.container.oldPosition.y !== y)) {
        this.socket.emit('PLAYER_MOVED', {x, y})
    }
  
    this.container.oldPosition = {
        x: this.player.x,
        y: this.player.y
    }
  
  
  }
  
  