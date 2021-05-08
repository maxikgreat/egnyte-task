import io from 'socket.io-client';

import './styles.css';

interface Checkbox {
  id: string,
  label: string,
  value: boolean
}

let socket: SocketIOClient.Socket | null = null;

const openWsConnection = (checkboxContainer: Element): void => {
  socket = io('http://localhost:3001');

  socket.on('checkbox-all', (data: Checkbox[]) => {
    let checkboxes: string = '';
    data.forEach(({id, label, value}) => {
      checkboxes += `
        <div>
          <input type="checkbox" id="${id}" ${value ? 'checked' : ''}>
          <label for="${id}">${label}</label>
        </div>
      `;
    });

    checkboxContainer.innerHTML = checkboxes;

    [...checkboxContainer.children].forEach((container) => {
      const input = container.querySelector('input');

      if (!input) return;

      input.addEventListener('change', (event) => {
        if (!socket) return;
        // @ts-expect-error
        const {id, checked} = event.target;

        socket.emit('checkbox-changed', {id, value: checked});
      });
    });
  });

  socket.on('checkbox-changed', ({id, value}: Checkbox) => {
    const input = document.querySelector(`input[id="${id}"]`);

    if (!input) return;

    console.log(input);
    if (value) {
      input.setAttribute('checked', 'checked');
    } else {
      input.removeAttribute('checked');
    }
  });
};

const closeWsConnection = (): void => {
  if (!socket) return;
  socket.close();
};

window.onload = (): void => {
  const checkboxContainer = document.querySelector('section.checkbox__container');

  if (!checkboxContainer) return;

  openWsConnection(checkboxContainer);
};

window.onclose = (): void => {
  closeWsConnection();
};

export {};
