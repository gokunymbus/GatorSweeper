import React from 'react';
import {createRoot} from 'react-dom/client';

import Game from './ui/Game';

// Import cs Variables
import './ui/Variables.css';
import './index.css';

function init() {
    const root = createRoot(
        document.getElementById('app-container')
    );
    const element = <Game />;
    root.render(element);
}

init();