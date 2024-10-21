enum ModuleTurn {
    MATUTINE = 'Matutino',
    NOCTURN = 'Nocturno',
  }

function getModuleTurns() {
    return Object.values(ModuleTurn);
}

export {ModuleTurn, getModuleTurns}