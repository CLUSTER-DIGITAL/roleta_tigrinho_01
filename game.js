var spinCount = 0; 
var modalActive = false;
var isSpinning = false; 

function setPrizes(index_prizes){
    /*
        o - Bônus de até R$300
        1 - Bônus de até R$200
        2 - Bônus de até R$100
        3 - R$10 + 100% do seu primeiro depósito
        4 - Sem sorte, gire novamente
        5 - Bônus de até R$400
        6 - Bônus de até R$300
        7 - Bônus de até R$200
        8 - Bônus de até R$100
        9 - R$10 + 100% do seu primeiro depósito
        10 - Sem sorte, gire novamente
        11 - Bônus de até R$400
    */

   return index_prizes
}

// seta prêmio
var index_prize = setPrizes(6)


function getPrizeText(index_prizes) {
    const prizes = [
        "Bônus de até R$300",       
        "Bônus de até R$200",       
        "Bônus de até R$100",       
        "R$10 + 100% do seu primeiro depósito",  
        "Sem sorte, gire novamente",           
        "Bônus de até R$400",       
        "Bônus de até R$300",       
        "Bônus de até R$200",       
        "Bônus de até R$100",       
        "R$10 + 100% do seu primeiro depósito",  
        "Sem sorte, gire novamente",             
        "Bônus de até R$400"        
    ];

    return prizes[index_prizes]
}


function createConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.setProperty('--rand', Math.random());
        confetti.style.setProperty('--speed', (Math.random() * 3000 + 3000) + 'ms');
        confetti.style.setProperty('--delay', (Math.random() * 1000) + 'ms');
        document.body.appendChild(confetti);
    }
}

function clearConfetti() {
    document.querySelectorAll('.confetti').forEach(el => el.remove());
}


var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'dwheel',
    transparent: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var winSound;


function preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image("fireCircle", "images/circuloFogo.png");
    // this.load.image("wheel", "images/roleta04.png");
    this.load.image("wheel", "images/roleta04.png");
    // this.load.image("wheel", "images/roletanova.svg");
    this.load.image("needle", "images/ponteiro3.png");
    this.load.image("btnGire", "images/btnGire.png");
    this.load.image("tiger", "images/tiger.png");
    this.load.audio("spinSound", "sounds/spinSound.mp3"); 
    this.load.audio("winSound", "sounds/winSound.mp3"); 
}

// Variáveis para controle de áudio
var audioInitialized = false;
var spinSound, winSound;

function initAudio() {
    // Apenas inicializa uma vez
    if (!audioInitialized) {
        // Cria instâncias de áudio
        game.spinSound = game.sound.add('spinSound');
        game.winSound = game.sound.add('winSound');
        
        // Toca e pausa os sons para desbloquear no iOS
        spinSound.play();
        spinSound.pause();
        winSound.play();
        winSound.pause();

        audioInitialized = true;
    }
}

function create() {
    // configurando áudio no primeiro toque no iphone
    var game = this;
    this.audioInitialized = false; // Estado inicial do áudio

    // Carrega áudio na primeira interação com o usuário
    this.input.once('pointerdown', function () {
        initAudio(game);
    });

    // Uso para desktop
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    var wheelScale = 0.7; 
    var btnGireScale = 0.32;
    // var wheelScale = 0.4; // para images/roletanova.svg
    var fireCircleScale = wheelScale * 4.5;
    var needleScale = 0.21;
    var tigerScale = 0.5;
    var wheelPositionX = 450;               // Posição X da roleta para desktop
    var wheelPositionY = height / 2 - 50;   // Posição Y centralizada
    var needlePositionX = 750;              // Posição X da agulha para desktop
    var needlePositionY = height / 2 - 55;   // Posição Y centralizada da agulha
    var tigerPositionX = 1200;              // Posição X do tigre para desktop
    var tigerPositionY = height / 2 + 165;  // Posição Y do tigre abaixo da roleta


    // Ajustes para telas de notebook
    if (width >= 1024 && width <= 1440) {
        wheelScale = 0.6;
        btnGireScale = 0.28;
        needleScale = 0.18;
        tigerScale = 0.45;
        positions.wheel.x = width / 2;
        positions.needle.x = positions.wheel.x + 300;
        positions.tiger.x = positions.wheel.x + 450;
        
    }

    // Ajustes para telas de celulares
    if (width < 600) {
        // Redefine as escalas e posições para dispositivos móveis
        wheelScale = 0.48;
        btnGireScale = 0.22;
        fireCircleScale = wheelScale * 4.5;
        needleScale = 0.15;
        tigerScale = 0.37;
        wheelPositionX = width / 2 - 20;
        wheelPositionY = height / 2 - 205;
        needlePositionX = width / 1 - 45;
        needlePositionY = height / 2 - 215;
        tigerPositionX = width / 2;
        tigerPositionY = height / 2 + 190;
    }

    // Adiciona o círculo de fogo
    var fireCircle = this.add.sprite(wheelPositionX, wheelPositionY, "fireCircle");
    fireCircle.setOrigin(0.5);
    fireCircle.setScale(wheelScale);

    // Adiciona a roleta
    var wheel = this.add.sprite(wheelPositionX, wheelPositionY, "wheel");
    wheel.setOrigin(0.5, 0.5);
    wheel.setScale(wheelScale);

    // Adiciona o botão "Gire" no centro da roleta
    var btnGire = this.add.sprite(wheelPositionX, wheelPositionY, "btnGire").setInteractive();
    btnGire.setOrigin(0.5);
    btnGire.setScale(btnGireScale); 
    
    // Adiciona a agulha
    var needle = this.add.sprite(needlePositionX, needlePositionY, "needle");
    needle.setOrigin(0.5);
    needle.setScale(needleScale);

    // Adiciona o tigre
    var tiger = this.add.image(tigerPositionX, tigerPositionY, "tiger");
    tiger.setScale(tigerScale);

    var spinSound = this.sound.add("spinSound");
    winSound = this.sound.add("winSound");

    btnGire.on('pointerdown', function () {
        // if (!audioInitialized) {
        //     initAudio(); 
        // }
        if (!modalActive && !isSpinning && spinCount < 3) {
            isSpinning = true;
            spinCount++;
            console.log(spinCount)
            spinSound.play();
            var segmentAngle = 360 / 12;                                // Cada segmento tem 30 graus
            var desiredPrizeIndex = spinCount < 3 ? 4 : index_prize;    // Index de cada prêmio/segmento (0 - 11)
            var stopAngle = segmentAngle * desiredPrizeIndex;           // Parar no prêmio desejado
            var randomSpins = Phaser.Math.Between(5, 10) * 360;         // Número aleatório de voltas completas
            var totalAngle = randomSpins + stopAngle;

            // Inicia a rotação do botão "Gire"
            var btnGireTween = this.tweens.add({
                targets: btnGire,
                angle: -360,
                duration: 2000,
                ease: 'Linear',
                repeat: -1
            });

            this.tweens.add({
                targets: wheel,
                angle: totalAngle,
                duration: 8000,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    spinSound.stop();
                    wheel.angle -= totalAngle;
                    // Para a rotação do botão "Gire" e redefine o ângulo
                    isSpinning = false;
                    btnGireTween.stop();
                    btnGire.angle = 0;
                    checkResult.call(this);
                }
            });
        }
    }, this);
}

function checkResult() {
    modalActive = true;
    let modalText = document.getElementById('modal-text');
    let modalButton = document.getElementById('modal-button');
    let modal = document.getElementById('overlay');
    let winningMessage = document.getElementById('winning-message');
    let title = document.getElementById('title-msg')
    let titleWin = document.getElementById('title-win')
    let msg = document.getElementById('msg')

    let prizeText; 

    if (spinCount < 3) {
        prizeText = "Mas não desanime, você pode tentar novamente!"; 
        title.style.display = "block";
        title.textContent = "Infelizmente, você não teve sorte nessa rodada."
        modalButton.textContent = "Gire Novamente!";
        winningMessage.style.display = "none";
    } else {
        createConfetti();
        prizeText = getPrizeText(index_prize); 
        title.style.display = "none";
        msg.style.display = "block";
        msg.textContent = "VOCÊ ACABOU DE GANHAR SEU BÔNUS: ";
        titleWin.style.display = "block";
        titleWin.textContent = "PARABÉNS";
        modalButton.textContent = "Resgatar Prêmio";
        // winningMessage.style.display = "flex";
        modalButton.onclick = function() {
            window.location.href = 'https://www.bet69pro.bet/register?id=657b639287f7080028f3d57c';
        };
        winSound.play();
    }

    modalText.textContent = prizeText;
    modal.style.display = "flex"; 
}

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    modalActive = false; 
}
