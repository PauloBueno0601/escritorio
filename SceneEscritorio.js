export default class SceneEscritorio extends Phaser.Scene {
    constructor() {
        super({ key: "SceneEscritorio", physics: { default: "arcade", arcade: { debug: true } } });
    }

    preload() {
        this.load.tilemapTiledJSON('escritorio', './src/assets/mapas/escritorio.json');
        this.load.image('chao', './src/assets/tiles/chaoo.png');
        this.load.image('paredes', './src/assets/tiles/objetoss.png'); 
        this.load.image('objetos', './src/assets/tiles/obj.png'); 
        this.load.image('dogs', './src/assets/tiles/dogs.png');
        // Carrega o atlas do jogador com os caminhos do seu projeto
        this.load.atlas("jogadorAtlas", "src/assets/sprites/spritesheet.png", "src/assets/sprites/sprites.json");
    }

    create() {
        const map = this.make.tilemap({ key: 'escritorio' });

        // Associando os tilesets
        const tilesetChao = map.addTilesetImage('chao', 'chao'); 
        const tilesetParedes = map.addTilesetImage('paredes ', 'paredes'); 
        const tilesetObjetos = map.addTilesetImage('objetos', 'objetos'); 
        const tilesetDogs = map.addTilesetImage('dogs', 'dogs');

        // Criando as camadas
        const chao = map.createLayer('chao', tilesetChao, 0, 0);
        const muros = map.createLayer('parede', [tilesetParedes, tilesetObjetos], 0, 0);
        const objetos = map.createLayer('obj', [tilesetParedes, tilesetObjetos, tilesetDogs], 0, 0);

        // Verificação de carregamento
        console.log('Tileset chão:', tilesetChao);
        console.log('Tileset paredes:', tilesetParedes);
        console.log('Tileset objetos:', tilesetObjetos);
        console.log('Tileset dogs:', tilesetDogs);
        console.log('Camada chão:', chao);
        console.log('Camada paredes:', muros);
        console.log('Camada objetos:', objetos);
        console.log(this.textures.exists("jogadorAtlas") ? "Atlas do jogador carregado!" : "Erro: Atlas do jogador não encontrado!");

        // Criando o sprite do jogador com frame inicial válido
        this.jogadorSprite = this.physics.add.sprite(50, 450, "jogadorAtlas", "frente0000")
            .setScale(1.6)
            .setOrigin(0.5, 0.5)
            .setDepth(1);
        this.jogadorSprite.setCollideWorldBounds(true);

        // Configurando controles
        this.teclaW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.teclaS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.teclasCursor = this.input.keyboard.createCursorKeys();

        // Configurando a câmera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.jogadorSprite, true, 0.05, 0.05);
        this.cameras.main.setZoom(2);

        // Criando animações do jogador
        this.criarAnimacoes();

        // Configurando colisões
        if (muros) {
            muros.setCollisionByProperty({ collider: true });
            this.physics.add.collider(this.jogadorSprite, muros);
        }

        if (objetos) {
            objetos.setCollisionByProperty({ collider: true });
            this.physics.add.collider(this.jogadorSprite, objetos);
        }
    }

    criarAnimacoes() {
        const animacoes = ["frente", "costas", "direita", "esquerda"];
        animacoes.forEach((animacao) => {
            this.anims.create({
                key: animacao,
                frames: this.anims.generateFrameNames("jogadorAtlas", {
                    prefix: `${animacao}000`, 
                    start: 0,
                    end: 3,
                    zeroPad: 4 // Mantendo 4 dígitos para corresponder ao JSON
                }),
                frameRate: 10,
                repeat: -1
            });
        });
    }
    
    update() {
        this.jogadorSprite.setVelocity(0);
    
        const reproduzirAnimacaoSegura = (chaveAnimacao) => {
            if (this.jogadorSprite.anims.currentAnim?.key !== chaveAnimacao) {
                this.jogadorSprite.anims.play(chaveAnimacao, true);
            }
        };
    
        if (this.teclasCursor.left.isDown || this.teclaA.isDown) {
            this.jogadorSprite.setVelocityX(-160);
            reproduzirAnimacaoSegura("esquerda");
        } else if (this.teclasCursor.right.isDown || this.teclaD.isDown) {
            this.jogadorSprite.setVelocityX(160);
            reproduzirAnimacaoSegura("direita");
        } else if (this.teclasCursor.up.isDown || this.teclaW.isDown) {
            this.jogadorSprite.setVelocityY(-160);
            reproduzirAnimacaoSegura("costas");
        } else if (this.teclasCursor.down.isDown || this.teclaS.isDown) {
            this.jogadorSprite.setVelocityY(160);
            reproduzirAnimacaoSegura("frente");
        } else {
            this.jogadorSprite.anims.stop();
        }
    }
}    
