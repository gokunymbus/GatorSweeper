export const testData = [
    [
      {
        "isMine": false,
        "isRevealed": false,
        "row": 0,
        "column": 0,
        "isFlagged": false
      },
      {
        "isMine": false,
        "isRevealed": false,
        "row": 0,
        "column": 1
      },
      {
        "isMine": false,
        "isRevealed": false,
        "row": 0,
        "column": 2
      },
      {
        "isMine": false,
        "isRevealed": false,
        "row": 0,
        "column": 3
      }
    ],
    [
      {
        "isMine": true,
        "isRevealed": false,
        "row": 1,
        "column": 0
      },
      {
        "isMine": true,
        "isRevealed": false,
        "row": 1,
        "column": 1
      },
      {
        "isMine": true,
        "isRevealed": false,
        "row": 1,
        "column": 2
      },
      {
        "isMine": false,
        "isRevealed": false,
        "row": 1,
        "column": 3
      }
    ],
    [
      {
        "isMine": true,
        "isRevealed": false,
        "row": 2,
        "column": 0
      },
      {
        "isMine": false,
        "isRevealed": false,
        "row": 2,
        "column": 1,
      },
      {
        "isMine": true,
        "isRevealed": false,
        "row": 2,
        "column": 2
      },
      {
        "isMine": false,
        "isRevealed": false,
        "row": 2,
        "column": 3
      }
    ],
    [
      {
        "isMine": true,
        "isRevealed": false,
        "row": 3,
        "column": 0
      },
      {
        "isMine": true,
        "isRevealed": false,
        "row": 3,
        "column": 1
      },
      {
        "isMine": true,
        "isRevealed": false,
        "row": 3,
        "column": 2
      },
      {
        "isMine": false,
        "isRevealed": false,
        "row": 3,
        "column": 3
      }
    ]
];

export const testDataTwo = [
  [
    {
      "isMine": false,
      "isRevealed": false,
      "row": 0,
      "column": 0,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 0,
      "column": 1,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 0,
      "column": 2,
      "proximities": 1
    },
    {
      "isMine": true,
      "isRevealed": false,
      "row": 0,
      "column": 3,
      "proximities": 0
    }
  ],
  [
    {
      "isMine": false,
      "isRevealed": false,
      "row": 1,
      "column": 0,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 1,
      "column": 1,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 1,
      "column": 2,
      "proximities": 1
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 1,
      "column": 3,
      "proximities": 1
    }
  ],
  [
    {
      "isMine": false,
      "isRevealed": false,
      "row": 2,
      "column": 0,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 2,
      "column": 1,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 2,
      "column": 2,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 2,
      "column": 3,
      "proximities": 0
    }
  ],
  [
    {
      "isMine": false,
      "isRevealed": false,
      "row": 3,
      "column": 0,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 3,
      "column": 1,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 3,
      "column": 2,
      "proximities": 0
    },
    {
      "isMine": false,
      "isRevealed": false,
      "row": 3,
      "column": 3,
      "proximities": 0
    }
  ]
];

export const testDataTwoRevealed = [
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 1
    },
    {
      "isFlagged": false,
      "isMine": true,
      "isRevealed": false,
      "proximities": 0
    }
  ],
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 1
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 1
    }
  ],
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    }
  ],
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": true,
      "proximities": 0
    }
  ]
];

export const testDataThreeRevealed = [
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 1
    },
    {
      "isFlagged": false,
      "isMine": true,
      "isRevealed": true,
      "proximities": 0
    }
  ],
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 1
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 1
    }
  ],
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    }
  ],
  [
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    },
    {
      "isFlagged": false,
      "isMine": false,
      "isRevealed": false,
      "proximities": 0
    }
  ]
];

export const processTargetsResult =  [
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 0,
    column: 0
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 0,
    column: 1
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 1,
    row: 0,
    column: 2
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 1,
    column: 0
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 1,
    column: 1
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 1,
    row: 1,
    column: 2
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 2,
    column: 0
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 2,
    column: 1
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 2,
    column: 2
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 1,
    row: 1,
    column: 3
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 2,
    column: 3
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 3,
    column: 2
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 3,
    column: 1
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 3,
    column: 0
  },
  {
    isFlagged: false,
    isMine: false,
    isRevealed: false,
    proximities: 0,
    row: 3,
    column: 3
  }
];
