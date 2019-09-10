let socket;

const submitForm = (oEvent) => {
    oEvent.preventDefault();

    socket = io('', {
        query: 'nickname=' + document.getElementById('nickname').value
    });

    socket.on('connect', handleConnect);

    document.getElementById('form').style.display = 'none';
};

const updateCursor = (sSocketId, oSocket) => {
    let oCursorRef = document.getElementById(sSocketId);

    if (!oCursorRef) {
        oCursorRef = document.createElement('div');
        oCursorRef.setAttribute('id', sSocketId);
        oCursorRef.classList.add('cursor');
        oCursorRef.style.backgroundColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

        oNickName = document.createElement('div');
        oNickName.classList.add('nickname');
        oNickName.textContent = oSocket.nickname;

        oCursorRef.appendChild(oNickName);
        document.body.appendChild(oCursorRef);
    }

    oCursorRef.style.left = oSocket.x;
    oCursorRef.style.top = oSocket.y;
};

const updateCursors = (oCursors) => {
    for (const sKey in oCursors) {
        if (sKey !== socket.id) {
            updateCursor(sKey, oCursors[sKey]);
        }
    }
};

const handleMouseMove = (event) => {
    const x = event.clientX;
    const y = event.clientY;

    socket.emit('mousemove', {
        x: x,
        y: y
    });
};

const handleConnect = () => {
    document.onmousemove = handleMouseMove;
    socket.on('broadcast', updateCursors);
};