import React from 'react';
import {createRoot} from 'react-dom/client';

import Meowsweeper from './ui/Meowsweeper';

function init() {
    const root = createRoot(
        document.getElementById('app-container')
    );
    const element = <Meowsweeper />;
    root.render(element);
}

init();