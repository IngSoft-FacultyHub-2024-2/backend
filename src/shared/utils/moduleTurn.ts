enum ModuleTurn {
    MATUTINE = 'Matutino',
    VESPERTINE = 'Vespertino',
  }

function getModuleTurns() {
    return Object.values(ModuleTurn);
}

export {ModuleTurn, getModuleTurns}