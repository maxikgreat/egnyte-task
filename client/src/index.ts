import io from 'socket.io-client';

import './styles.css';

interface Checkbox {
  id: string,
  label: string,
  value: boolean
}

let socket: SocketIOClient.Socket | null = null;

const showError = (checkboxContainer: Element, message: string): void => {
  checkboxContainer.innerHTML = message;
};

const openWsConnection = (checkboxContainer: Element): void => {
  socket = io('http://localhost:3001');

  socket.on('connect_error', (err: {message: string}) => {
    showError(checkboxContainer, err.message);
  });

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

    if (value) {
      input.setAttribute('checked', 'checked');
    } else {
      input.removeAttribute('checked');
    }
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });
};

const closeWsConnection = (checkboxContainer?: Element, message?: string): void => {
  if (!socket) return;
  socket.close();

  if (checkboxContainer && message) {
    showError(checkboxContainer, message);
  }
};


window.onload = (): void => {
  const checkboxContainer = document.querySelector('section.checkbox__container');

  if (!checkboxContainer) return;
  try {
    openWsConnection(checkboxContainer);
  } catch (err) {
    closeWsConnection(checkboxContainer, err.message);
  }
};

window.onclose = (): void => {
  closeWsConnection();
};

export {};
