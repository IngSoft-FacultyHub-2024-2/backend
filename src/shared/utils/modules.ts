import { ModuleResponseDto } from '../../modules/teacher';

export function getTimesOfModules(modules: ModuleResponseDto[]) {
  modules.sort((a, b) => a.time.localeCompare(b.time));
  const startTime = modules[0].time.split('-')[0];
  const endTime = modules[modules.length - 1].time.split('-')[1];
  return `${startTime}-${endTime}`;
}
