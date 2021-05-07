import './styles.css';

window.onload = () => {
  const socket = new WebSocket(process.env.WEBSOCKET_URL);

  socket.addEventListener('open', () => {
    console.log('Web socket is connected');
  });


  socket.addEventListener('close', () => {
    console.log('Web socket is closed');
  });

  socket.addEventListener('error', (err) => {
    console.log('Web socket error', err);
  });

  socket.addEventListener('message', (e) => {
    console.log('Your answer is: ', JSON.parse(e.data).message);
  });


  // @ts-ignore
  window.ask = (msg: string) => {
    const payload = {
      action: 'message',
      msg,
    };
    socket.send(JSON.stringify(payload));
  };
};


export {};
